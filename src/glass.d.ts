export declare function supportsRefraction(): boolean;
export declare function lensMap(w: number, h: number, r: number, bezel: number): string;
export declare function attachRefraction(el: HTMLElement, options?: { strength?: number }): () => void;
export declare function adaptGlass(root?: ParentNode): void;
export declare function observeScrolled(sentinel: Element | null, options?: { barHeight?: number }): () => void;
export declare function minimizeOnScroll(dock: Element | null, options?: { threshold?: number; top?: number }): () => void;
export interface InitGlassOptions {
  root?: ParentNode;
  /** 'auto' enables SVG refraction only in Chromium (Safari renders backdrop-filter:url() as nothing). */
  refraction?: 'auto' | boolean;
  press?: boolean;
  adapt?: boolean;
}
export declare function initGlass(options?: InitGlassOptions): () => void;
