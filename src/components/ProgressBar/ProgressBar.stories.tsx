import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Components/Display/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A thin bar showing progress toward a goal, such as a sprint or upload. \`value\` is clamped between 0 and \`max\` (default 100); sizes are s and m.

**Keyboard:** none; it is not focusable.

**Semantics:** \`role="progressbar"\` with \`aria-valuemin\`, \`aria-valuemax\`, \`aria-valuenow\` and a required \`label\` as its name. The track border is line-strong (3:1) and the fill turns Highlight in forced colors.

**Do** show the values as text nearby. **Don't** use it for loading states with no known end.`,
      },
    },
  },
  args: { value: 40, label: 'Vacation fund' },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar', { name: 'Vacation fund' });
    await expect(bar).toHaveAttribute('aria-valuenow', '40');
    await expect(bar).toHaveAttribute('aria-valuemax', '100');
  },
};

export const Clamp: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <ProgressBar value={140} label="Over" />
      <ProgressBar value={-5} label="Under" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('progressbar', { name: 'Over' })).toHaveAttribute(
      'aria-valuenow',
      '100',
    );
    await expect(canvas.getByRole('progressbar', { name: 'Under' })).toHaveAttribute(
      'aria-valuenow',
      '0',
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <ProgressBar size="s" value={60} max={200} label="Small" />
      <ProgressBar size="m" value={60} max={200} label="Medium" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const h = (n: string) =>
      canvas.getByRole('progressbar', { name: n }).getBoundingClientRect().height;
    await expect(h('Small')).toBe(8); // 6px + 1px borders
    await expect(h('Medium')).toBe(10);
  },
};

export const Dark: Story = { ...Sizes, globals: { theme: 'dark' } };
