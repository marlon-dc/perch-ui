import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { contrastRatio, parseThemeBlocks } from './contrast';

// ConfirmToggle sits on `surface` and on `done-bg` (done ledger rows).
const PAIRS = [
  ['muted', 'surface'],
  ['muted', 'done-bg'],
  ['done-ink', 'surface'],
  ['done-ink', 'done-bg'],
] as const;

test.each(['light', 'dark'] as const)('ConfirmToggle ring/fill keeps >=3:1 in %s', (theme) => {
  const tokens = parseThemeBlocks(readFileSync('src/tokens/tokens.css', 'utf8'))[theme];
  for (const [fg, bg] of PAIRS) {
    const ratio = contrastRatio(tokens[fg]!, tokens[bg]!);
    expect(ratio, `${fg} on ${bg}`).toBeGreaterThanOrEqual(3);
  }
});

// SegmentedControl: the selected segment's line-strong border sits on the surface-2 track, and the
// line-strong track border sits on the page (bg) or a card (surface).
test.each(['light', 'dark'] as const)('SegmentedControl borders keep >=3:1 in %s', (theme) => {
  const tokens = parseThemeBlocks(readFileSync('src/tokens/tokens.css', 'utf8'))[theme];
  for (const bg of ['surface-2', 'surface', 'bg']) {
    const ratio = contrastRatio(tokens['line-strong']!, tokens[bg]!);
    expect(ratio, `line-strong on ${bg}`).toBeGreaterThanOrEqual(3);
  }
});

// Switch: the off thumb (muted) sits on the surface-2 track; the on thumb (surface) on accent.
test.each(['light', 'dark'] as const)(
  'Switch thumb keeps >=3:1 against its track in %s',
  (theme) => {
    const tokens = parseThemeBlocks(readFileSync('src/tokens/tokens.css', 'utf8'))[theme];
    for (const [fg, bg] of [
      ['muted', 'surface-2'],
      ['surface', 'accent'],
    ] as const) {
      const ratio = contrastRatio(tokens[fg]!, tokens[bg]!);
      expect(ratio, `${fg} on ${bg}`).toBeGreaterThanOrEqual(3);
    }
  },
);
