import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Numeric } from './Numeric';

const meta = {
  title: 'Components/Primitives/Numeric',
  component: Numeric,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Formats a number with the tabular number font and a real minus sign (U+2212), so columns of figures line up. \`format\` is \`decimal\` (default), \`currency\` or \`percent\` (pass a ratio: 0.25 → 25%); \`currency\`, \`locale\` and \`fractionDigits\` are configurable, and \`colored\` tints positive and negative values.

**Keyboard:** none; Numeric is text.

**Semantics:** a plain \`<span>\` with the formatted text, so screen readers read the number and sign. Color is never the only signal: negatives always carry the minus sign.

**Do** use it for every figure in a list, table or summary. **Don't** pass preformatted strings; pass the number.`,
      },
    },
  },
  args: { value: 1234.5 },
} satisfies Meta<typeof Numeric>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const el = canvas.getByText('1,234.5');
    await expect(el).toHaveClass('font-num', 'tabular-nums');
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-baseline gap-4">
      {(['xs', 's', 'm', 'l', 'xl'] as const).map((s) => (
        <Numeric key={s} {...args} size={s} />
      ))}
    </div>
  ),
};

export const Formats: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Numeric value={1500} />
      <Numeric value={1234.5} format="currency" />
      <Numeric value={0.42} format="percent" />
      <Numeric value={3} fractionDigits={2} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('1,500')).toBeVisible();
    await expect(canvas.getByText('$1,234.50')).toBeVisible();
    await expect(canvas.getByText('42%')).toBeVisible();
    await expect(canvas.getByText('3.00')).toBeVisible();
  },
};

export const Colored: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Numeric value={-250} colored />
      <Numeric value={400} colored />
      <Numeric value={0} colored />
      <Numeric value={1e-7} colored />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('−250')).toHaveClass('text-negative');
    await expect(canvas.getByText('400')).toHaveClass('text-positive');
    for (const el of canvas.getAllByText('0')) {
      await expect(el).not.toHaveClass('text-negative');
      await expect(el).not.toHaveClass('text-positive');
    }
  },
};

export const States: Story = {
  render: () => <Numeric value={NaN} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('—')).toBeVisible();
  },
};

export const Dark: Story = { ...Colored, globals: { theme: 'dark' } };
