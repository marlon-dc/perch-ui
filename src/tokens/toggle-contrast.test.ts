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
