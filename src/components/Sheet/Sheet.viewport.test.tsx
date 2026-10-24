import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { composeStories } from '@storybook/react-vite';
import * as stories from './Sheet.stories';

const { Narrow } = composeStories(stories);

test('Sheet is a bottom sheet at 375px and a centered dialog at 1024px', async () => {
  await page.viewport(375, 800);
  const screen = await render(<Narrow />);
  const dialog = await screen.getByRole('dialog', { name: 'Edit item' }).element();
  await expect.poll(() => Math.round(dialog.getBoundingClientRect().bottom)).toBe(800);

  await page.viewport(1024, 800);
  await expect
    .poll(() => {
      const r = dialog.getBoundingClientRect();
      return { bottomAnchored: Math.round(r.bottom) === 800, centerX: Math.round(r.left + r.width / 2) };
    })
    .toEqual({ bottomAnchored: false, centerX: 512 });
});
