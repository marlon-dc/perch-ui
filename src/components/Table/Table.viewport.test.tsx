import { expect, test } from 'vitest';
import { cdp } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { composeStories } from '@storybook/react-vite';
import * as stories from './Table.stories';

const { MonthGrid } = composeStories(stories);

async function forcedColors(value: 'active' | 'none') {
  await cdp().send('Emulation.setEmulatedMedia', {
    features: [{ name: 'forced-colors', value }],
  });
}

test('Table cell left border is hidden in forced colors except on partial cells', async () => {
  await forcedColors('active');
  try {
    const screen = await render(<MonthGrid />);
    const plain = screen
      .getByRole('row', { name: /^Electricity/ })
      .element()
      .querySelector('td')!;
    const partial = screen.getByRole('cell', { name: /\(Partly paid\)$/ }).element();
    const probe = document.createElement('div');
    probe.style.backgroundColor = 'Canvas';
    document.body.append(probe);
    const canvas = getComputedStyle(probe).backgroundColor;
    probe.remove();
    await expect.poll(() => getComputedStyle(plain).borderLeftColor).toBe(canvas);
    expect(getComputedStyle(partial).borderLeftColor).not.toBe(canvas);
  } finally {
    await forcedColors('none');
  }
});
