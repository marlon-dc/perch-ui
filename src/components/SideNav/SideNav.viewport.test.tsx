import { expect, test } from 'vitest';
import { cdp } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { composeStories } from '@storybook/react-vite';
import * as stories from './SideNav.stories';

const { Current } = composeStories(stories);

async function forcedColors(value: 'active' | 'none') {
  await cdp().send('Emulation.setEmulatedMedia', {
    features: [{ name: 'forced-colors', value }],
  });
}

test('SideNav active marker is visible and inactive marker is hidden in forced colors', async () => {
  await forcedColors('active');
  try {
    const screen = await render(<Current />);
    const active = getComputedStyle(screen.getByRole('button', { name: 'Budget' }).element());
    const inactiveEl = screen.getByRole('button', { name: 'Overview' }).element();
    const inactive = getComputedStyle(inactiveEl);
    const probe = document.createElement('div');
    probe.style.backgroundColor = 'Canvas';
    document.body.append(probe);
    const canvas = getComputedStyle(probe).backgroundColor;
    probe.remove();
    await expect.poll(() => inactive.borderLeftColor).toBe(canvas);
    expect(active.borderLeftColor).not.toBe(inactive.borderLeftColor);
  } finally {
    await forcedColors('none');
  }
});
