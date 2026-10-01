import os
import json
import re
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

def clean_text_from_html(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "nav", "table", "footer", "quick-review-deck", "orbit-reviewarea"]):
        tag.decompose()
    
    text_blocks = []
    for elem in soup.find_all(["h1", "h2", "h3", "p"]):
        txt = elem.get_text(strip=True)
        if len(txt) > 25:
            text_blocks.append(txt)
    return "\n\n".join(text_blocks)

def normalize_prompts(prompts_raw: list) -> list[dict]:
    normalized = []
    for item in prompts_raw:
        if not isinstance(item, dict):
            continue
        q = (item.get("question") or item.get("prompt") or "").strip()
        a = (item.get("answer") or "").strip()
        if q and a:
            normalized.append({"question": q, "answer": a})
    return normalized

def generate_section_prompts(topic: str, section_title: str, section_content: str) -> list[dict]:
    """
    Generates a set of 3-4 active recall prompts for a specific section of an article.
    Uses Gemini API if available, with intelligent fallback.
    """
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if gemini_key:
        try:
            return generate_with_gemini(topic, section_title, section_content, gemini_key)
        except Exception as e:
            print(f"[AI Prompts] Gemini section generation failed: {e}")

    openai_key = os.environ.get("OPENAI_API_KEY")
    if openai_key:
        try:
            return generate_with_openai(topic, section_title, section_content, openai_key)
        except Exception as e:
            print(f"[AI Prompts] OpenAI generation failed: {e}")

    return generate_heuristic_section_prompts(topic, section_title, section_content)

def generate_with_gemini(topic: str, section_title: str, content: str, api_key: str) -> list[dict]:
    clean_topic = topic.replace('_', ' ')
    clean_sec = section_title.replace('_', ' ') if section_title else "Core Concepts"

    prompt = f"""You are an elite Computer Science educator creating a focused set of active-recall review cards for a spaced-repetition system (SM-2).

Article Topic: {clean_topic}
Current Section: {clean_sec}

Content of this section:
---
{content[:4000]}
---

Guidelines:
1. Create EXACTLY 3 to 4 high-yield active-recall prompts testing the core concepts and mechanics explained in THIS SPECIFIC SECTION.
2. Questions must be crisp, direct, and unambiguous (e.g. "What is the primary trade-off when increasing X?", "How does Y achieve Z?").
3. Answers must be direct, authoritative, and concise (1-2 sentences maximum, e.g. "Mitochondria" or "By scaling integer bits by a factor $S = 2^f$").
4. Use standard LaTeX ($...$ for inline math, $$...$$ for block math) whenever formulas, equations, or computational complexity are involved.
5. Do NOT ask trivial trivia or meta questions. Focus on core architectural, algorithmic, or mathematical understanding.

Return STRICTLY a JSON array of objects with "question" and "answer":
[
  {{"question": "How does X work?", "answer": "X does Y by ..."}},
  {{"question": "What is the primary benefit of Z?", "answer": "It reduces ... to O(1)."}},
  {{"question": "Given condition A, what happens to B?", "answer": "B is updated to ..."}}
]
"""
    gemini_models = ["gemini-flash-latest", "gemini-flash-lite-latest"]
    last_err = None

    for model_name in gemini_models:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "responseMimeType": "application/json",
                    "temperature": 0.2
                }
            }
            res = requests.post(url, json=payload, timeout=25)
            if res.status_code == 200:
                data = res.json()
                raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                parsed = json.loads(raw_text)
                if isinstance(parsed, dict) and "prompts" in parsed:
                    parsed = parsed["prompts"]
                elif isinstance(parsed, dict):
                    parsed = list(parsed.values())[0] if parsed else []
                prompts = normalize_prompts(parsed)
                if len(prompts) >= 2:
                    return prompts[:4]
            else:
                last_err = f"{model_name} HTTP {res.status_code}: {res.text[:80]}"
        except Exception as e:
            last_err = str(e)
            continue

    raise RuntimeError(f"Gemini generation failed: {last_err}")

def generate_with_openai(topic: str, section_title: str, content: str, api_key: str) -> list[dict]:
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": "You create crisp, conceptual active-recall flashcards for spaced repetition. Return JSON array of {question, answer}."
            },
            {
                "role": "user",
                "content": f"Create 3-4 active recall prompts for topic '{topic}' section '{section_title}':\n\n{content[:3000]}"
            }
        ],
        "response_format": {"type": "json_object"}
    }
    res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=20)
    res.raise_for_status()
    result = res.json()["choices"][0]["message"]["content"]
    data = json.loads(result)
    if isinstance(data, list):
        return normalize_prompts(data)[:4]
    if isinstance(data, dict):
        for v in data.values():
            if isinstance(v, list):
                return normalize_prompts(v)[:4]
    return []

def generate_heuristic_section_prompts(topic: str, section_title: str, content: str) -> list[dict]:
    """Smart heuristic fallback when AI APIs are unreachable."""
    prompts = []
    clean_topic = topic.replace('_', ' ')
    clean_sec = section_title.replace('_', ' ') if section_title else clean_topic

    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', content) if len(s.strip()) > 30]
    for s in sentences:
        if re.search(r'\b(is defined as|is used to|refers to|consists of|allows)\b', s, re.I):
            parts = re.split(r'\b(is defined as|is used to|refers to|consists of|allows)\b', s, maxsplit=1, flags=re.I)
            if len(parts) == 3 and len(parts[0].strip()) < 60:
                subj = parts[0].strip()
                ans = f"{parts[1]} {parts[2]}".strip()
                prompts.append({
                    "question": f"In {clean_sec}, how is {subj} defined and used?",
                    "answer": ans
                })
        if len(prompts) >= 4:
            break

    if len(prompts) < 3:
        prompts.append({
            "question": f"What is the primary role of {clean_sec} in relation to {clean_topic}?",
            "answer": f"{clean_sec} defines key mechanisms and structural principles governing {clean_topic}."
        })
        prompts.append({
            "question": f"Why is understanding {clean_sec} critical when implementing or analyzing {clean_topic}?",
            "answer": f"It ensures correct operational behavior, prevents errors, and optimizes performance in computing systems."
        })
        prompts.append({
            "question": f"What key operational characteristics differentiate {clean_sec} from related mechanisms?",
            "answer": f"Its specific data handling, timing requirements, and architectural trade-offs."
        })

    return prompts[:4]

def format_deck_html(prompts: list[dict], section_id: str = "review-deck") -> str:
    """Formats 3-4 prompts into a clean <quick-review-deck> HTML container."""
    json_str = json.dumps(prompts, ensure_ascii=False)
    # Escape closing script tag if any inside text
    safe_json = json_str.replace("</script>", "<\\/script>")
    return f"""<div class="quick-review-container my-8">
  <quick-review-deck section-id="{section_id}">
    <script type="application/json">
{safe_json}
    </script>
  </quick-review-deck>
</div>"""

def generate_and_inject_prompts(title: str, html: str) -> tuple[str, list[dict]]:
    """
    Parses article sections and paragraphs, generates a set of 3-4 prompts for each major
    section, and injects the <quick-review-deck> directly after the relevant paragraphs
    in the natural flow of the article.
    Returns: (enriched_html, all_prompts_list)
    """
    soup = BeautifulSoup(html, "html.parser")
    clean_title = title.replace('_', ' ')

    # 1. Clean old orbit and quick-review tags
    for el in soup.find_all(['orbit-reviewarea', 'orbit-prompt', 'quick-review-deck']):
        el.decompose()
    for el in soup.find_all('div', class_=['orbit-inline-container', 'quick-review-container']):
        el.decompose()

    # 2. Identify sections
    IGNORED_HEADINGS = {
        'see also', 'references', 'external links', 'notes', 'further reading',
        'bibliography', 'sources', 'contents', 'navigation menu'
    }

    headings = soup.find_all(['h2', 'h3'])
    valid_sections = []

    for h in headings:
        heading_text = h.get_text(strip=True)
        if heading_text.lower() in IGNORED_HEADINGS:
            continue
        
        # Collect paragraphs under this heading until next heading
        paragraphs = []
        curr = h.next_sibling
        while curr and curr.name not in ['h2', 'h3']:
            if getattr(curr, 'name', None) == 'p':
                p_text = curr.get_text(strip=True)
                if len(p_text) > 30:
                    paragraphs.append(curr)
            curr = curr.next_sibling

        if paragraphs:
            valid_sections.append({
                'heading_node': h,
                'heading_text': heading_text,
                'paragraphs': paragraphs,
                'last_paragraph': paragraphs[-1],
                'full_text': "\n\n".join([p.get_text(strip=True) for p in paragraphs])
            })

    all_prompts = []

    # 3. Inject decks after sections in the flow of the article
    if valid_sections:
        # Choose up to 2-3 most substantial sections to avoid card fatigue
        selected_sections = sorted(valid_sections, key=lambda s: len(s['full_text']), reverse=True)[:3]
        # Sort them back in document order
        selected_sections = sorted(selected_sections, key=lambda s: valid_sections.index(s))

        for idx, sec in enumerate(selected_sections):
            section_slug = f"sec-{idx}-{re.sub(r'[^a-zA-Z0-9]+', '-', sec['heading_text'].lower())}"
            prompts = generate_section_prompts(clean_title, sec['heading_text'], sec['full_text'])
            if prompts:
                all_prompts.extend(prompts)
                deck_html = format_deck_html(prompts, section_slug)
                deck_soup = BeautifulSoup(deck_html, "html.parser")
                sec['last_paragraph'].insert_after(deck_soup)
    else:
        # Fallback for articles without h2/h3 tags: split paragraphs
        all_p = soup.find_all('p')
        valid_p = [p for p in all_p if len(p.get_text(strip=True)) > 20]

        if valid_p:
            target_p = valid_p[len(valid_p) // 2] if len(valid_p) >= 3 else valid_p[-1]
            content = "\n\n".join([p.get_text(strip=True) for p in valid_p])
            prompts = generate_section_prompts(clean_title, "Core Overview", content)
            if prompts:
                all_prompts.extend(prompts)
                deck_html = format_deck_html(prompts, "sec-overview")
                deck_soup = BeautifulSoup(deck_html, "html.parser")
                target_p.insert_after(deck_soup)

            if len(valid_p) >= 6:
                target_p2 = valid_p[-1]
                content2 = "\n\n".join([p.get_text(strip=True) for p in valid_p[len(valid_p)//2:]])
                prompts2 = generate_section_prompts(clean_title, "Key Mechanisms", content2)
                if prompts2:
                    all_prompts.extend(prompts2)
                    deck_html2 = format_deck_html(prompts2, "sec-mechanisms")
                    deck_soup2 = BeautifulSoup(deck_html2, "html.parser")
                    target_p2.insert_after(deck_soup2)
        else:
            # Entire text fallback
            content = clean_text_from_html(html)
            prompts = generate_section_prompts(clean_title, "Core Concepts", content)
            if prompts:
                all_prompts.extend(prompts)
                deck_html = format_deck_html(prompts, "sec-overview")
                deck_soup = BeautifulSoup(deck_html, "html.parser")
                soup.append(deck_soup)

    return str(soup), all_prompts

def inject_orbit_prompts_into_html(html: str, title: str) -> str:
    """Wrapper that returns only the enriched HTML with Quick Review decks."""
    enriched, _ = generate_and_inject_prompts(title, html)
    return enriched
