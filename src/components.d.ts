export declare function initComponents(root?: ParentNode): () => void;
export declare function openDialog(d: HTMLDialogElement | string): void;
export declare function closeDialog(d: HTMLDialogElement | string): void;
export declare function layoutSegmented(seg: Element): void;
export declare function layoutTabbar(bar: Element): void;
export interface ToastOptions {
  /** Inline SVG markup shown before the message. */
  icon?: string;
  /** Milliseconds before it hides (minimum 2000; paused while hovered). Default 4000. */
  duration?: number;
}
/** Show a HUD toast (role="status") at the top of the screen. Returns a function that dismisses it. */
export declare function showToast(message: string, options?: ToastOptions): () => void;
