import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Components/Display/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
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
