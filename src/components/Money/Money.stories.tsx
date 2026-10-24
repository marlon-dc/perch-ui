import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Money } from './Money';

const meta = {
  title: 'Components/Primitives/Money',
  component: Money,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Formats an amount with the tabular number font and a real minus sign (U+2212). Defaults to ₱ and \`en-PH\`; \`currency\` and \`locale\` are configurable, \`symbol\` shows the currency sign and \`colored\` tints positive and negative amounts.

**Keyboard:** none; Money is text.

**Semantics:** a plain \`<span>\` with the formatted text, so screen readers read the number and sign. Color is never the only signal: negatives always carry the minus sign.

**Do** use it for every money value so columns line up. **Don't** pass preformatted strings; pass the number.`,
      },
    },
  },
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
      <Money amount={1e-7} colored />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('−₱250.00')).toHaveClass('text-negative');
    await expect(canvas.getByText('₱400.00')).toHaveClass('text-positive');
    for (const el of canvas.getAllByText('₱0.00')) {
      await expect(el).not.toHaveClass('text-negative');
      await expect(el).not.toHaveClass('text-positive');
    }
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
