import { expect, test } from 'vitest';
import { cdp } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { composeStories } from '@storybook/react-vite';
import * as stories from './Tabs.stories';

const { Default } = composeStories(stories);

async function forcedColors(value: 'active' | 'none') {
  await cdp().send('Emulation.setEmulatedMedia', {
    features: [{ name: 'forced-colors', value }],
  });
}

test('Tabs active marker is visible and inactive marker is hidden in forced colors', async () => {
  await forcedColors('active');
  try {
    const screen = await render(<Default />);
    const active = getComputedStyle(screen.getByRole('tab', { name: 'Overview' }).element());
    const inactiveEl = screen.getByRole('tab', { name: 'Activity' }).element();
    const inactive = getComputedStyle(inactiveEl);
    const probe = document.createElement('div');
    probe.style.backgroundColor = 'Canvas';
    document.body.append(probe);
    const canvas = getComputedStyle(probe).backgroundColor;
    probe.remove();
    await expect.poll(() => inactive.borderBottomColor).toBe(canvas);
    expect(active.borderBottomColor).not.toBe(inactive.borderBottomColor);
  } finally {
    await forcedColors('none');
  }
});
