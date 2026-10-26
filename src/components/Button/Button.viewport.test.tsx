import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { composeStories } from '@storybook/react-vite';
import { Button } from './Button';
import * as stories from './Button.stories';

const { ResponsiveSize } = composeStories(stories);

test('ResponsiveSize is L (44px) on a phone and S (28px) at 1024px', async () => {
  await page.viewport(375, 800);
  const screen = await render(<ResponsiveSize />);
  const button = screen.getByRole('button').element();
  await expect.poll(() => button.getBoundingClientRect().height).toBe(44);

  await page.viewport(1024, 800);
  await expect.poll(() => button.getBoundingClientRect().height).toBe(28);
});

test('a consumer `fixed` class (floating action button) still wins over hit-area', async () => {
  const screen = await render(
    <Button className="fixed right-4 bottom-4" variant="primary">
      Add task
    </Button>,
  );
  const button = screen.getByRole('button', { name: 'Add task' }).element();
  await expect.poll(() => getComputedStyle(button).position).toBe('fixed');
});
