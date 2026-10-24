import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Select } from './Select';

const options = [
  { value: 'groceries', label: 'Groceries' },
  { value: 'rent', label: 'Rent' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'salary', label: 'Salary', disabled: true },
];

const meta = {
  title: 'Components/Inputs/Select',
  component: Select,
  tags: ['autodocs'],
  args: { label: 'Category', options, placeholder: 'Choose one', onValueChange: fn() },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Keyboard: Story = {
  args: { hint: 'Used for reports' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: 'Category' });
    trigger.focus();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.getByRole('listbox')).toBeVisible());
    await userEvent.keyboard('{ArrowDown}');
    // The highlighted option needs a non-colour-only cue: an accent outline, not just a 1.1:1 fill.
    const highlighted = body.getByRole('option', { name: 'Rent' });
    await waitFor(() => expect(highlighted).toHaveAttribute('data-highlighted'));
    await expect(getComputedStyle(highlighted).outlineStyle).not.toBe('none');
    await userEvent.keyboard('{Enter}');
    await expect(args.onValueChange).toHaveBeenCalledWith('rent');
    await waitFor(() => expect(trigger).toHaveTextContent('Rent'));
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(['s', 'm', 'l'] as const).map((size) => (
        <Select key={size} {...args} size={size} label={`Size ${size.toUpperCase()}`} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const height = (name: string) =>
      canvas.getByRole('combobox', { name }).getBoundingClientRect().height;
    await expect(height('Size S')).toBe(28);
    await expect(height('Size M')).toBe(36);
    await expect(height('Size L')).toBe(44);
  },
};

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Select {...args} label="Normal" />
      <Select {...args} label="Disabled" disabled />
      <Select {...args} label="Invalid" error="Pick a category" />
      <Select {...args} label="Chosen" defaultValue="rent" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const invalid = canvas.getByRole('combobox', { name: 'Invalid' });
    await expect(invalid).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByRole('combobox', { name: 'Disabled' })).toBeDisabled();
  },
};

/** On coarse pointers an S trigger (28px) gets an invisible hit area of at least 44px. */
export const HitArea: Story = {
  args: { size: 's' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const target = canvas.getByRole('combobox', { name: 'Category' });
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

/** `ref` reaches the trigger button; `name` submits the value with a native form. */
export const RefAndName: Story = {
  render: function Render(args) {
    const ref = useRef<HTMLButtonElement>(null);
    return (
      <form aria-label="Budget form" onSubmit={(event) => event.preventDefault()}>
        <Select {...args} ref={ref} name="category" defaultValue="rent" />
        <button type="button" onClick={() => ref.current?.focus()}>
          Focus category
        </button>
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Focus category' }));
    await expect(canvas.getByRole('combobox', { name: 'Category' })).toHaveFocus();
    const form = canvas.getByRole('form', { name: 'Budget form' }) as HTMLFormElement;
    await expect(new FormData(form).get('category')).toBe('rent');
  },
};

export const Dark: Story = { ...States, globals: { theme: 'dark' } };
