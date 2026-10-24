import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Money } from './Money';

const meta = {
  title: 'Components/Primitives/Money',
  component: Money,
  tags: ['autodocs'],
  args: { amount: 1234.5 },
} satisfies Meta<typeof Money>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const el = canvas.getByText('₱1,234.50');
    await expect(el).toHaveClass('font-num', 'tabular-nums');
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-baseline gap-4">
      {(['xs', 's', 'm', 'l', 'xl'] as const).map((s) => (
        <Money key={s} {...args} size={s} />
      ))}
    </div>
  ),
};

export const Colored: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Money amount={-250} colored />
      <Money amount={400} colored />
      <Money amount={0} colored />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('−₱250.00')).toHaveClass('text-negative');
    await expect(canvas.getByText('₱400.00')).toHaveClass('text-positive');
    await expect(canvas.getByText('₱0.00')).not.toHaveClass('text-negative');
    await expect(canvas.getByText('₱0.00')).not.toHaveClass('text-positive');
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Money amount={1500} symbol={false} />
      <Money amount={NaN} />
      <Money amount={12} currency="USD" locale="en-US" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('1,500.00')).toBeVisible();
    await expect(canvas.getByText('—')).toBeVisible();
    await expect(canvas.getByText('$12.00')).toBeVisible();
  },
};

export const Dark: Story = { ...Colored, globals: { theme: 'dark' } };
