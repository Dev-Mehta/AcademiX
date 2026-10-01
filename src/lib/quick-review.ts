/**
 * AcademiX Custom Quick Review Spaced Repetition Component
 * Implements the SM-2 Spaced Repetition Algorithm.
 * Matches user-provided Figma design with neon-accented violet cards.
 *
 * Features:
 *  - Globally unique, collision-free card progress (scoped to article + question)
 *  - Independent progress tracking per question (each question shows its own SM-2 progress)
 *  - Timeline starting strictly from '0' -> '5d' -> '2wk' -> '1mo' -> '2mo' -> '4mo' -> '1yr'
 *  - Dynamic pixel-perfect arrow centering directly over the active milestone dot
 *  - Memory retention status banner with exact retention interval and re-review date
 *  - Direct Google Calendar reminder URL generation
 *  - Fonts: 'JetBrains Mono' for mono text, 'Inter' for content
 *  - Fluid spring transitions and micro-animations
 */

export interface PromptData {
  question: string;
  answer: string;
  id: string;
}

export interface SM2State {
  repetition: number;
  interval: number; // in days: 0, 5, 14, 30, 60, 120, 365...
  ef: number;       // easiness factor (starts at 2.5, min 1.3)
  lastReview: number;
}

export interface SectionReviewMeta {
  completedAt: number;
  nextReviewAt: number;
  intervalDays: number;
  totalCards: number;
}

export const MILESTONES = [
  { label: '0', days: 0 },
  { label: '5d', days: 5 },
  { label: '2wk', days: 14 },
  { label: '1mo', days: 30 },
  { label: '2mo', days: 60 },
  { label: '4mo', days: 120 },
  { label: '1yr', days: 365 },
];

const SM2_PREFIX = 'academix_v2_sm2_';
const SEC_PREFIX = 'academix_v2_sec_';

function hashString(str: string): string {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 16777619) & 0xFFFFFFFF;
  }
  return (hash >>> 0).toString(36);
}

function getArticleIdentifier(): string {
  const h1 = document.querySelector('h1')?.textContent?.trim();
  if (h1) return h1.toLowerCase().replace(/\s+/g, '_');
  const path = window.location.pathname.replace(/\/$/, '');
  const segments = path.split('/');
  return (segments[segments.length - 1] || 'default').toLowerCase();
}

function generateCardId(articleId: string, sectionId: string, questionText: string, cardIndex: number): string {
  const normQ = questionText.trim().toLowerCase().slice(0, 80);
  const qHash = hashString(`${articleId}::${sectionId}::${normQ}::${cardIndex}`);
  return `card_${qHash}`;
}

function generateSectionId(articleId: string, sectionSlug: string): string {
  const sHash = hashString(`${articleId}::${sectionSlug.toLowerCase()}`);
  return `sec_${sHash}`;
}

function getMilestoneIndex(repetition: number, intervalDays: number): number {
  if (repetition === 0 || intervalDays <= 0) return 0;
  for (let i = 1; i < MILESTONES.length; i++) {
    if (intervalDays <= MILESTONES[i].days) {
      return i;
    }
  }
  return MILESTONES.length - 1;
}

function formatIntervalText(days: number): string {
  if (days <= 1) return '1 day';
  if (days < 14) return `${days} days`;
  if (days < 30) return `${Math.round(days / 7)} weeks`;
  if (days < 365) return `${Math.round(days / 30)} months`;
  return `${Math.round(days / 365)} year`;
}

function generateGoogleCalendarUrl(
  topicTitle: string,
  sectionTitle: string,
  targetDateTimestamp: number,
  url: string
): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  const targetDate = new Date(targetDateTimestamp);
  const start = new Date(targetDate);
  start.setHours(9, 0, 0, 0);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 20);

  const formatDateUTC = (d: Date) => {
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  };

  const title = `AcademiX Spaced Review: ${topicTitle}`;
  const details = `Time for your SM-2 spaced repetition active recall session!\n\nTopic: ${topicTitle}\nSection: ${sectionTitle}\n\nReview link:\n${url}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatDateUTC(start)}/${formatDateUTC(end)}`,
    details: details,
    location: url,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function loadSM2(cardId: string): SM2State {
  try {
    const raw = localStorage.getItem(`${SM2_PREFIX}${cardId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load SM-2 state', e);
  }
  return { repetition: 0, interval: 0, ef: 2.5, lastReview: 0 };
}

function saveSM2(cardId: string, state: SM2State) {
  try {
    localStorage.setItem(`${SM2_PREFIX}${cardId}`, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save SM-2 state', e);
  }
}

function calculateSM2(state: SM2State, grade: number): SM2State {
  // grade: 1 (Forgot), 4 (Remembered)
  let { repetition, interval, ef } = state;
  const newEf = Math.max(1.3, ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));

  if (grade < 3) {
    // Forgot -> reset repetition and interval to 0
    repetition = 0;
    interval = 0;
  } else {
    // Remembered
    if (repetition === 0) {
      interval = 5; // First recall milestone: 5 days
    } else if (repetition === 1) {
      interval = 14; // Second milestone: 2 weeks
    } else {
      interval = Math.round(interval * newEf);
    }
    repetition += 1;
  }

  return {
    repetition,
    interval,
    ef: Number(newEf.toFixed(2)),
    lastReview: Date.now(),
  };
}

function formatMath(text: string): string {
  if (!text) return '';
  const katex = (window as any).katex;

  let out = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    if (katex) {
      try {
        return katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
      } catch {
        return `<div class="math-block">${escapeHtml(math)}</div>`;
      }
    }
    return `<div class="math-block">${escapeHtml(math)}</div>`;
  });

  out = out.replace(/\$([^$]+?)\$/g, (_, math) => {
    if (katex) {
      try {
        return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
      } catch {
        return `<span class="math-inline">${escapeHtml(math)}</span>`;
      }
    }
    return `<span class="math-inline">${escapeHtml(math)}</span>`;
  });

  return out;
}

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export class QuickReviewDeckElement extends HTMLElement {
  private queue: PromptData[] = [];
  private initialTotal = 0;
  private isAnswerRevealed = false;
  private isFinished = false;
  private reaskedCount = 0;
  private rawSectionId = 'default-deck';
  private uniqueSectionId = 'sec-default';
  private cardIntervals: number[] = [];
  private resizeObserver: ResizeObserver | null = null;

  connectedCallback() {
    this.rawSectionId = this.getAttribute('section-id') || 'default-deck';
    this.extractPrompts();

    // Check if this section was already completed in memory and not yet due
    const existingMeta = this.loadSectionMeta();
    if (existingMeta && existingMeta.nextReviewAt > Date.now() && this.initialTotal > 0) {
      this.isFinished = true;
    }

    this.render();

    // Setup resize observer for dynamic arrow center alignment
    this.resizeObserver = new ResizeObserver(() => {
      const activeEl = this.querySelector<HTMLElement>('.qr-milestone.active');
      if (activeEl) {
        const milestones = Array.from(this.querySelectorAll<HTMLElement>('.qr-milestone'));
        const idx = milestones.indexOf(activeEl);
        if (idx !== -1) {
          this.updateArrowPosition(idx);
        }
      }
    });
    this.resizeObserver.observe(this);
  }

  disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  private loadSectionMeta(): SectionReviewMeta | null {
    try {
      const raw = localStorage.getItem(`${SEC_PREFIX}${this.uniqueSectionId}`);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }

  private saveSectionMeta(intervalDays: number) {
    try {
      const meta: SectionReviewMeta = {
        completedAt: Date.now(),
        nextReviewAt: Date.now() + (intervalDays * 86400000),
        intervalDays,
        totalCards: this.initialTotal,
      };
      localStorage.setItem(`${SEC_PREFIX}${this.uniqueSectionId}`, JSON.stringify(meta));
    } catch {}
  }

  private extractPrompts() {
    this.queue = [];
    this.cardIntervals = [];

    const articleId = getArticleIdentifier();
    this.uniqueSectionId = generateSectionId(articleId, this.rawSectionId);

    // 1. Check for JSON script tag
    const scriptTag = this.querySelector('script[type="application/json"]');
    if (scriptTag && scriptTag.textContent) {
      try {
        const parsed = JSON.parse(scriptTag.textContent.trim());
        if (Array.isArray(parsed)) {
          this.queue = parsed.map((p, idx) => {
            const q = p.question || p.prompt || '';
            const a = p.answer || '';
            return {
              question: q,
              answer: a,
              id: generateCardId(articleId, this.rawSectionId, q, idx),
            };
          }).filter(p => p.question && p.answer);
        }
      } catch (e) {
        console.error('Failed to parse quick-review JSON', e);
      }
    }

    // 2. Check for child <review-prompt> tags
    if (this.queue.length === 0) {
      const childPrompts = Array.from(this.querySelectorAll('review-prompt'));
      this.queue = childPrompts.map((el, idx) => {
        const q = el.getAttribute('question') || '';
        const a = el.getAttribute('answer') || '';
        return {
          question: q,
          answer: a,
          id: generateCardId(articleId, this.rawSectionId, q, idx),
        };
      }).filter(p => p.question && p.answer);
    }

    this.initialTotal = this.queue.length;
  }

  private handleShowAnswer = () => {
    this.isAnswerRevealed = true;
    this.render();
  };

  private handleForgot = () => {
    if (this.queue.length === 0) return;
    const current = this.queue[0];
    const currentState = loadSM2(current.id);
    
    // Update SM-2 (grade 1 = Forgot) for this specific card
    const nextState = calculateSM2(currentState, 1);
    saveSM2(current.id, nextState);

    // Re-queue card to ask again later in this session
    this.queue.shift();
    this.queue.push(current);
    this.reaskedCount++;

    this.isAnswerRevealed = false;
    this.render();
  };

  private handleRemembered = () => {
    if (this.queue.length === 0) return;
    const current = this.queue[0];
    const currentState = loadSM2(current.id);

    // Update SM-2 (grade 4 = Remembered) for this specific card
    const nextState = calculateSM2(currentState, 4);
    saveSM2(current.id, nextState);
    this.cardIntervals.push(nextState.interval);

    // Card completed!
    this.queue.shift();

    if (this.queue.length === 0) {
      this.isFinished = true;
      const minInterval = this.cardIntervals.length > 0 ? Math.min(...this.cardIntervals) : 5;
      this.saveSectionMeta(minInterval);
    } else {
      this.isAnswerRevealed = false;
    }
    this.render();
  };

  private handleRestart = () => {
    try {
      localStorage.removeItem(`${SEC_PREFIX}${this.uniqueSectionId}`);
    } catch {}
    this.extractPrompts();
    this.isFinished = false;
    this.isAnswerRevealed = false;
    this.reaskedCount = 0;
    this.render();
  };

  private updateArrowPosition(milestoneIdx: number) {
    requestAnimationFrame(() => {
      const milestones = this.querySelectorAll<HTMLElement>('.qr-milestone');
      const track = this.querySelector<HTMLElement>('.qr-arrow-track');
      const arrowLine = this.querySelector<HTMLElement>('.qr-arrow-line');

      if (milestones[milestoneIdx] && track && arrowLine) {
        const milestoneRect = milestones[milestoneIdx].getBoundingClientRect();
        const trackRect = track.getBoundingClientRect();
        // Calculate the exact horizontal center of the active milestone relative to the track
        const targetX = (milestoneRect.left + (milestoneRect.width / 2)) - trackRect.left;
        arrowLine.style.width = `${Math.max(16, Math.round(targetX))}px`;
      }
    });
  }

  private render() {
    if (this.queue.length === 0 && !this.isFinished) {
      this.innerHTML = '';
      return;
    }

    if (this.isFinished) {
      const meta = this.loadSectionMeta();
      const intervalDays = meta ? meta.intervalDays : 5;
      const intervalText = formatIntervalText(intervalDays);
      const nextDate = meta 
        ? new Date(meta.nextReviewAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        : new Date(Date.now() + (intervalDays * 86400000)).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

      // Finished view milestone represents the mastered interval
      const milestoneIdx = getMilestoneIndex(1, intervalDays);

      const articleHeading = document.querySelector('h1')?.textContent?.trim() || document.title || 'AcademiX';
      const cleanSectionName = this.rawSectionId.replace(/^sec-\d+-/, '').replace(/-/g, ' ');
      const sectionName = cleanSectionName ? (cleanSectionName.charAt(0).toUpperCase() + cleanSectionName.slice(1)) : 'Key Concepts';
      const targetTimestamp = meta ? meta.nextReviewAt : Date.now() + (intervalDays * 86400000);
      const calendarUrl = generateGoogleCalendarUrl(articleHeading, sectionName, targetTimestamp, window.location.href);

      this.innerHTML = `
        <div class="quick-review-card finished-card animate-in fade-in zoom-in-95 duration-300">
          <div class="qr-header">
            <span class="qr-title">Quick Review</span>
            <span class="qr-badge-success">Memory Active ✓</span>
          </div>

          <!-- Spaced Repetition Progress Timeline -->
          <div class="qr-progress-section">
            <div class="qr-timeline-row">
              <div class="qr-progress-label">Progress</div>
              <div class="qr-milestones">
                ${MILESTONES.map((m, idx) => `
                  <div class="qr-milestone ${idx === milestoneIdx ? 'active' : ''}">
                    <span class="qr-dot">•</span>
                    <span class="qr-milestone-text">${m.label}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Neon Yellow Progress Arrow -->
            <div class="qr-arrow-track">
              <div class="qr-arrow-line" style="width: 20px;">
                <div class="qr-arrow-head"></div>
              </div>
            </div>
          </div>

          <div class="finished-body">
            <div class="finished-badge-icon">🧠</div>
            <div class="finished-title">Review Completed!</div>
            
            <div class="retention-box">
              <div class="retention-label">Retained in memory for:</div>
              <div class="retention-value">~${intervalText}</div>
              <div class="retention-sub">Next re-review recommended on <strong>${nextDate}</strong></div>
            </div>

            ${this.reaskedCount > 0 ? `
              <div class="reasked-tag">Practiced forgotten concepts ${this.reaskedCount} time${this.reaskedCount > 1 ? 's' : ''} until mastered.</div>
            ` : ''}

            <div class="finished-actions">
              <a class="qr-calendar-btn" href="${calendarUrl}" target="_blank" rel="noopener noreferrer">
                <svg class="qr-cal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                  <line x1="16" x2="16" y1="2" y2="6"/>
                  <line x1="8" x2="8" y1="2" y2="6"/>
                  <line x1="3" x2="21" y1="10" y2="10"/>
                  <path d="M8 14h.01"/>
                  <path d="M12 14h.01"/>
                  <path d="M16 14h.01"/>
                  <path d="M8 18h.01"/>
                  <path d="M12 18h.01"/>
                </svg>
                <span>Add Calendar Reminder</span>
              </a>

              <button class="qr-restart-btn" id="qr-restart-btn">
                <span>↺</span>
                <span>Practice Again</span>
              </button>
            </div>
          </div>
        </div>
      `;

      this.updateArrowPosition(milestoneIdx);

      const btn = this.querySelector('#qr-restart-btn');
      if (btn) btn.addEventListener('click', this.handleRestart);
      return;
    }

    // Active Card View
    const current = this.queue[0];
    // Load SM-2 progress specifically for THIS question
    const currentCardState = loadSM2(current.id);
    const remainingCount = this.queue.length;
    const isReasked = this.reaskedCount > 0 && remainingCount <= this.reaskedCount;

    // Milestone active calculation starting from 0 for this specific card
    const milestoneIdx = getMilestoneIndex(currentCardState.repetition, currentCardState.interval);

    this.innerHTML = `
      <div class="quick-review-card animate-in fade-in duration-200">
        <!-- Top Title & Badge -->
        <div class="qr-header">
          <span class="qr-title">Quick Review</span>
          <div class="qr-header-right">
            ${isReasked ? `<span class="qr-retry-badge">Reviewing Again</span>` : ''}
            <span class="qr-counter">${Math.max(1, this.initialTotal - remainingCount + 1)} / ${this.initialTotal}</span>
          </div>
        </div>

        <!-- Spaced Repetition Progress Timeline -->
        <div class="qr-progress-section">
          <div class="qr-timeline-row">
            <div class="qr-progress-label">Progress</div>
            <div class="qr-milestones">
              ${MILESTONES.map((m, idx) => `
                <div class="qr-milestone ${idx === milestoneIdx ? 'active' : ''}">
                  <span class="qr-dot">•</span>
                  <span class="qr-milestone-text">${m.label}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Neon Yellow Progress Arrow -->
          <div class="qr-arrow-track">
            <div class="qr-arrow-line" style="width: 20px;">
              <div class="qr-arrow-head"></div>
            </div>
          </div>
        </div>

        <!-- Question & Answer Flow -->
        <div class="qr-content-area ${this.isAnswerRevealed ? 'is-revealed' : ''}">
          ${!this.isAnswerRevealed ? `
            <!-- Frame 29: Question State -->
            <div class="qr-question-large">
              ${formatMath(current.question)}
            </div>

            <div class="qr-actions">
              <button class="qr-show-answer-btn" id="qr-show-btn">
                <svg class="qr-eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>Show Answer</span>
              </button>
            </div>
          ` : `
            <!-- Frame 30: Answer State -->
            <div class="qr-question-small">
              ${formatMath(current.question)}
            </div>

            <div class="qr-answer-large">
              ${formatMath(current.answer)}
            </div>

            <div class="qr-actions-split">
              <button class="qr-action-btn btn-forgot" id="qr-forgot-btn">
                <span class="btn-icon">✕</span>
                <span class="btn-text">Forgot</span>
              </button>

              <button class="qr-action-btn btn-remembered" id="qr-remembered-btn">
                <span class="btn-icon">✓</span>
                <span class="btn-text">Remembered</span>
              </button>
            </div>
          `}
        </div>
      </div>
    `;

    // Dynamic arrow alignment directly over the active milestone dot
    this.updateArrowPosition(milestoneIdx);

    // Attach event listeners
    const showBtn = this.querySelector('#qr-show-btn');
    if (showBtn) {
      showBtn.addEventListener('click', this.handleShowAnswer);
    }

    const forgotBtn = this.querySelector('#qr-forgot-btn');
    if (forgotBtn) {
      forgotBtn.addEventListener('click', this.handleForgot);
    }

    const rememberedBtn = this.querySelector('#qr-remembered-btn');
    if (rememberedBtn) {
      rememberedBtn.addEventListener('click', this.handleRemembered);
    }
  }
}

// Auto-register custom element
if (typeof window !== 'undefined' && !window.customElements.get('quick-review-deck')) {
  window.customElements.define('quick-review-deck', QuickReviewDeckElement);
}
