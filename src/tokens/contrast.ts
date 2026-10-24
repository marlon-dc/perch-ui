export type ContrastPair = { fg: string; bg: string; min: 3 | 4.5 };

function channel(hex: string, start: number): number {
  const c = parseInt(hex.slice(start, start + 2), 16) / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error(`Expected #rrggbb, got "${hex}"`);
  return 0.2126 * channel(hex, 1) + 0.7152 * channel(hex, 3) + 0.0722 * channel(hex, 5);
}

/** WCAG 2.1 contrast ratio between two `#rrggbb` colors. */
export function contrastRatio(fg: string, bg: string): number {
  const [a, b] = [luminance(fg), luminance(bg)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function declarations(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [, name, value] of body.matchAll(/--pu-([\w-]+)\s*:\s*([^;]+);/g)) {
    out[name!] = value!.trim();
  }
  return out;
}

function blockAfter(css: string, opener: string): string {
  const start = css.indexOf(opener);
  if (start === -1) throw new Error(`Block not found: ${opener}`);
  const end = css.indexOf('}', start);
  return css.slice(start + opener.length, end);
}

/** Reads the `:root` (light) and `:root[data-theme="dark"]` (dark) token blocks. */
export function parseThemeBlocks(css: string): {
  light: Record<string, string>;
  dark: Record<string, string>;
} {
  return {
    light: declarations(blockAfter(css, ':root {')),
    dark: declarations(blockAfter(css, ':root[data-theme="dark"] {')),
  };
}

const SURFACES = ['bg', 'surface', 'surface-2'];
const TINTS = ['tint-earn', 'tint-ded', 'tint-inflow', 'tint-exp'];
const CATS = ['cat-earn', 'cat-ded', 'cat-inflow', 'cat-exp'];

export const CONTRAST_PAIRS: ReadonlyArray<ContrastPair> = [
  ...SURFACES.flatMap((bg) =>
    ['ink', 'muted', 'positive', 'negative', 'accent'].map((fg) => ({ fg, bg, min: 4.5 as const })),
  ),
  { fg: 'accent-ink', bg: 'accent', min: 4.5 },
  { fg: 'done-ink', bg: 'done-bg', min: 4.5 },
  { fg: 'warn-ink', bg: 'warn-bg', min: 4.5 },
  ...TINTS.flatMap((bg) => ['ink', 'muted'].map((fg) => ({ fg, bg, min: 4.5 as const }))),
  { fg: 'line-strong', bg: 'surface', min: 3 },
  ...CATS.map((fg) => ({ fg, bg: 'surface', min: 3 as const })),
  { fg: 'accent', bg: 'surface', min: 3 },
];
