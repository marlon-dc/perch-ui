import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { resolveSize } from './size';

const meta = {
  title: 'Internals/Density',
  tags: ['!autodocs'],
  render: () => (
    <div className="flex flex-col gap-4">
      <div
        data-testid="responsive"
        className={`${resolveSize({ base: 'l', m: 's' })} h-(--pu-ctl-h) bg-surface-2`}
      >
        Responsive
      </div>
      <button
        data-testid="touch"
        className="density-s ctl-text-input hit-area h-(--pu-ctl-h) bg-surface-2"
      >
        Touch
      </button>
    </div>
  ),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    // Vitest browser viewport is >= 768px, so m:density-s applies (28px).
    expect(window.innerWidth).toBeGreaterThanOrEqual(768);
    const box = canvas.getByTestId('responsive');
    await expect(getComputedStyle(box).height).toBe('28px');

    const btn = canvas.getByTestId('touch');
    document.documentElement.dataset['pointer'] = 'coarse';
    try {
      await expect(getComputedStyle(btn).fontSize).toBe('16px');
      const after = getComputedStyle(btn, '::after');
      await expect(after.minWidth).toBe('44px');
      await expect(after.minHeight).toBe('44px');
    } finally {
      delete document.documentElement.dataset['pointer'];
    }
    await expect(getComputedStyle(btn).fontSize).toBe('12px');
  },
};

export const Dark: Story = {
  ...Default,
  globals: { theme: 'dark' },
};
