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

export const Dark: Story = { ...States, globals: { theme: 'dark' } };
