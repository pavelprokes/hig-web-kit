export type RGBA = [number, number, number, number];
export type ColorInput = string | RGBA;
export declare function parseColor(input: string): RGBA;
export declare function toHex(c: ColorInput): string;
export declare function toRgba(c: ColorInput): string;
export declare function over(fg: ColorInput, bg: ColorInput): RGBA;
export declare function flatten(...layers: ColorInput[]): RGBA;
export declare function luminance(c: ColorInput): number;
/** WCAG 2.x contrast ratio (1–21). */
export declare function contrast(a: ColorInput, b: ColorInput): number;
