import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Inputs/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A native checkbox with a custom box. The whole label row is the click target, and on coarse pointers it gets a hit area at least 44px tall.

**Keyboard:** Tab to focus, Space to toggle.

**Semantics:** a real \`<input type="checkbox">\` inside its \`<label>\`, so checked, disabled and form submission work natively. The check mark is drawn over the box and hidden with opacity when unchecked.

**Do** use it for an independent yes/no choice that takes effect on save. **Don't** use it for an immediate on/off setting; use Switch.`,
      },
    },
  },
  args: { label: 'Include in report' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Toggle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole('checkbox', { name: 'Include in report' });
    await expect(box).not.toBeChecked();
    await userEvent.click(canvas.getByText('Include in report'));
    await expect(box).toBeChecked();
    box.focus();
    await userEvent.keyboard(' ');
    await expect(box).not.toBeChecked();
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {(['s', 'm', 'l'] as const).map((size) => (
        <Checkbox key={size} size={size} label={`Size ${size.toUpperCase()}`} defaultChecked />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const w = (name: string) =>
      canvas.getByRole('checkbox', { name }).getBoundingClientRect().width;
    await expect(w('Size S')).toBe(16);
    await expect(w('Size M')).toBe(18);
    await expect(w('Size L')).toBe(20);
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};

States.play = async ({ canvasElement }) => {
  await expect(within(canvasElement).getByRole('checkbox', { name: 'Disabled' })).toBeDisabled();
};

/** On coarse pointers the whole label row gets a hit area of at least 44px tall. */
export const HitArea: Story = {
  args: { size: 's' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const target = canvas.getByText('Include in report').closest('label')!;
    try {
      document.documentElement.dataset.pointer = 'coarse';
      const after = getComputedStyle(target, '::after');
      await expect(after.minWidth).toBe('44px');
      await expect(after.minHeight).toBe('44px');
    } finally {
      delete document.documentElement.dataset.pointer;
    }
  },
};

export const Dark: Story = { ...States, globals: { theme: 'dark' } };
