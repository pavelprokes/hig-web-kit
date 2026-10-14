/*! hig-web-kit v0.1.0 | MIT | Not affiliated with Apple Inc. | Generated from tokens/tokens.json — do not edit */
// The color pairs that must meet WCAG 2.2 AA in "aa" mode (and in increased-contrast sets).
// Each pair: [label, foregroundLayers, backgroundLayers, minimumRatio].
// Layers are token names or literal colors, topmost first; they are flattened before measuring.
// Translucent glass is measured over BOTH a black and a white backdrop and the worse result counts.

export const BACKDROPS = ['#000000', '#ffffff'];

export const PAIRS = [
  // 1.4.3 Contrast (Minimum) — text 4.5:1
  ['Primary text on page', ['label'], ['bg'], 4.5],
  ['Secondary text on page', ['label-2'], ['bg'], 4.5],
  ['Secondary text on secondary background', ['label-2', 'bg-2'], ['bg-2'], 4.5],
  ['Secondary text on grouped card', ['label-2', 'grouped-bg-2'], ['grouped-bg-2'], 4.5],
  ['Secondary text on grouped page', ['label-2', 'grouped-bg'], ['grouped-bg'], 4.5],
  ['Placeholder in text field', ['placeholder', 'fill-3', 'bg'], ['fill-3', 'bg'], 4.5],
  ['Link / accent text on page', ['accent-text'], ['bg'], 4.5],
  ['Accent text on secondary background', ['accent-text'], ['bg-2'], 4.5],
  ['Accent text on gray button', ['accent-text', 'fill-2', 'bg'], ['fill-2', 'bg'], 4.5],
  ['Label on primary (filled) button', ['on-accent'], ['accent-fill'], 4.5],
  ['Label on destructive (filled) button', ['on-destructive'], ['destructive-fill'], 4.5],
  ['Destructive text on page', ['destructive-text'], ['bg'], 4.5],
  ['Destructive text on gray button', ['destructive-text', 'fill-2', 'bg'], ['fill-2', 'bg'], 4.5],
  ['Success text on page', ['success-text'], ['bg'], 4.5],
  ['Success text on secondary background', ['success-text'], ['bg-2'], 4.5],
  ['Warning text on page', ['warning-text'], ['bg'], 4.5],
  ['Warning text on secondary background', ['warning-text'], ['bg-2'], 4.5],
  ['Label on regular glass (worst backdrop)', ['glass-label', 'glass-tint', '@backdrop'], ['glass-tint', '@backdrop'], 4.5],
  ['Label on large glass (worst backdrop)', ['glass-label', 'glass-tint-large', '@backdrop'], ['glass-tint-large', '@backdrop'], 4.5],
  ['White label on clear glass over media (worst backdrop)', ['#ffffff'], ['glass-tint-clear', '@backdrop'], 4.5],

  // 1.4.11 Non-text Contrast — UI component boundaries, states and focus 3:1
  ['Switch "on" track vs card', ['switch-on'], ['bg-2'], 3],
  ['Switch "on" track vs page', ['switch-on'], ['bg'], 3],
  ['Control border (field, switch off, segmented) vs page', ['control-border', 'bg'], ['bg'], 3],
  ['Control border vs grouped card', ['control-border', 'grouped-bg-2'], ['grouped-bg-2'], 3],
  ['Slider fill / selected indicator vs page', ['accent'], ['bg'], 3],
  ['Focus ring vs page', ['focus-ring', 'bg'], ['bg'], 3],
  ['Focus ring vs secondary background', ['focus-ring', 'bg-2'], ['bg-2'], 3],
];

/** Resolve a layer list against a token set; '@backdrop' is replaced by the given backdrop. */
export function resolveLayers(layers, set, backdrop) {
  return layers.map(l => (l === '@backdrop' ? backdrop : l.startsWith('#') ? l : set[l]));
}
