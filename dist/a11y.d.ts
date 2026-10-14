export type HigMode = 'apple' | 'aa';
export interface HigPreferences {
  mode: HigMode;
  scheme: 'light' | 'dark';
  contrast: 'standard' | 'more';
  transparency: 'standard' | 'reduce';
  motion: 'standard' | 'reduce';
}
interface PersistOption { persist?: boolean }
export declare function setMode(mode: HigMode, options?: PersistOption): void;
export declare function setScheme(scheme: 'system' | 'light' | 'dark', options?: PersistOption): void;
export declare function setContrast(value: 'system' | 'more' | 'standard', options?: PersistOption): void;
export declare function setTransparency(value: 'system' | 'reduce' | 'standard', options?: PersistOption): void;
export declare function setMotion(value: 'system' | 'reduce' | 'standard', options?: PersistOption): void;
export declare function getPreferences(): HigPreferences;
export declare function currentSet(p?: HigPreferences): `${HigMode}.${'light' | 'dark'}${'' | '-hc'}`;
export declare function savePreferences(): void;
export declare function restorePreferences(options?: { hash?: boolean }): HigPreferences;
export declare function watchPreferences(cb: (p: HigPreferences) => void, options?: { immediate?: boolean }): () => void;
export declare function readColor(name: string, el?: Element): [number, number, number, number];
export interface HigContrastResult { label: string; ratio: number; min: number; pass: boolean }
export declare function checkContrast(el?: Element): HigContrastResult[];
export { contrast, flatten } from './color.js';
