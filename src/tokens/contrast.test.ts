import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { CONTRAST_PAIRS, contrastRatio, parseThemeBlocks } from './contrast';

test('contrastRatio matches WCAG reference values', () => {
  expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
  expect(contrastRatio('#685d54', '#fffdf9')).toBeCloseTo(6.3, 1);
});

test.each(['light', 'dark'] as const)('every documented pair passes in %s', (theme) => {
  const tokens = parseThemeBlocks(readFileSync('src/tokens/tokens.css', 'utf8'))[theme];
  for (const { fg, bg, min } of CONTRAST_PAIRS) {
    expect(contrastRatio(tokens[fg]!, tokens[bg]!), `${fg} on ${bg}`).toBeGreaterThanOrEqual(min);
  }
});

test('light and dark declare identical token names', () => {
  const { light, dark } = parseThemeBlocks(readFileSync('src/tokens/tokens.css', 'utf8'));
  expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
});

test('dark media block cannot override an explicit light theme', () => {
  const css = readFileSync('src/tokens/tokens.css', 'utf8').replaceAll("'", '"');
  expect(css).toMatch(
    /@media \(prefers-color-scheme: dark\)\s*{\s*:root:not\(\[data-theme="light"\]\)/,
  );
  expect(css).toContain(':root[data-theme="dark"]');
});
