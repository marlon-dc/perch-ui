import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { composeStories } from '@storybook/react-vite';
import * as stories from './List.stories';

const { LongContent } = composeStories(stories);

test('ListRow LongContent neither overflows the page nor clips the value at 320px', async () => {
  await page.viewport(320, 800);
  const screen = await render(<LongContent />);
  const row = screen.getByRole('listitem').element();
  const value = row.querySelector<HTMLElement>('[data-slot="value"]')!;
  await expect.poll(() => document.documentElement.scrollWidth).toBeLessThanOrEqual(320);
  await expect.poll(() => value.scrollWidth).toBe(value.clientWidth);
  const rowRect = row.getBoundingClientRect();
  expect(value.getBoundingClientRect().right).toBeLessThanOrEqual(rowRect.right);
});
