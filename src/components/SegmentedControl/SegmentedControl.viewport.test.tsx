import { expect, test } from 'vitest';
import { cdp } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { composeStories } from '@storybook/react-vite';
import * as stories from './SegmentedControl.stories';

const { Default } = composeStories(stories);

async function forcedColors(value: 'active' | 'none') {
  await cdp().send('Emulation.setEmulatedMedia', {
    features: [{ name: 'forced-colors', value }],
  });
}

test('selected segment is distinguishable from unselected in forced colors', async () => {
  await forcedColors('active');
  try {
    const screen = await render(<Default />);
    const selected = screen.getByRole('tab', { name: 'Month' }).element();
    const other = screen.getByRole('tab', { name: 'Week' }).element();
    await expect
      .poll(
        () =>
          getComputedStyle(selected).backgroundColor !== getComputedStyle(other).backgroundColor,
      )
      .toBe(true);
  } finally {
    await forcedColors('none');
  }
});

test('unselected segment border is hidden (Canvas) in forced colors', async () => {
  await forcedColors('active');
  try {
    const screen = await render(<Default />);
    const other = screen.getByRole('tab', { name: 'Week' }).element();
    const probe = document.createElement('div');
    probe.style.backgroundColor = 'Canvas';
    document.body.append(probe);
    const canvas = getComputedStyle(probe).backgroundColor;
    probe.remove();
    await expect.poll(() => getComputedStyle(other).borderTopColor).toBe(canvas);
  } finally {
    await forcedColors('none');
  }
});
