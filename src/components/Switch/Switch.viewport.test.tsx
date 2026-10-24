import { expect, test } from 'vitest';
import { cdp } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { composeStories } from '@storybook/react-vite';
import * as switchStories from './Switch.stories';
import * as toggleStories from '../ConfirmToggle/ConfirmToggle.stories';

const { Toggle } = composeStories(switchStories);
const { States } = composeStories(toggleStories);

async function forcedColors(value: 'active' | 'none') {
  await cdp().send('Emulation.setEmulatedMedia', {
    features: [{ name: 'forced-colors', value }],
  });
}

test('Switch thumb is distinguishable from the track in forced colors', async () => {
  await forcedColors('active');
  try {
    const screen = await render(<Toggle />);
    const input = screen.getByRole('switch').element();
    const thumb = input.nextElementSibling as HTMLElement;
    await expect
      .poll(
        () => getComputedStyle(thumb).backgroundColor !== getComputedStyle(input).backgroundColor,
      )
      .toBe(true);
  } finally {
    await forcedColors('none');
  }
});

test('ConfirmToggle check is hidden when off', async () => {
  const screen = await render(<States />);
  const off = screen.getByRole('button', { name: 'Mark Rent paid' }).element();
  expect(getComputedStyle(off.querySelector('svg')!).opacity).toBe('0');
});
