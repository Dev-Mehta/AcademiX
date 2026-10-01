declare module "*.md";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'orbit-reviewarea': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        color?: string;
        debug?: boolean;
      }, HTMLElement>;
      'orbit-prompt': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        question?: string;
        answer?: string;
        cloze?: string;
        'question-attachments'?: string;
        'answer-attachments'?: string;
      }, HTMLElement>;
      'quick-review-deck': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'data-prompts'?: string;
        'section-id'?: string;
      }, HTMLElement>;
      'review-prompt': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        question?: string;
        answer?: string;
      }, HTMLElement>;
    }
  }
}
