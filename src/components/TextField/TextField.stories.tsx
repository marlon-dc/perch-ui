import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { TextField } from './TextField';

const meta = {
  title: 'Components/Inputs/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A labelled text input with hint, error, optional prefix (such as ₱) and a \`numeric\` mode that right-aligns digits and opens the decimal keypad. Sizes follow S, M and L.

**Keyboard:** Tab to focus; standard text editing.

**Semantics:** a native \`<input>\` labelled by its Field, with \`aria-invalid\` and \`aria-describedby\` for hint and error. The prefix is decorative. On coarse pointers the text is at least 16px so iOS does not zoom; the bordered box itself is the touch target (a documented exception to the 44px hit area).

**Do** put the unit in \`prefix\`, not in the value. **Don't** use the placeholder as the label.`,
      },
    },
  },
  args: { label: 'Description' },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Description', hint: 'What was it for?', placeholder: 'Groceries' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Description');
    await userEvent.type(input, 'Rent');
    await expect(input).toHaveValue('Rent');
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(['s', 'm', 'l'] as const).map((size) => (
        <TextField key={size} {...args} size={size} label={`Size ${size.toUpperCase()}`} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const height = (name: string) => canvas.getByLabelText(name).getBoundingClientRect().height;
    await expect(height('Size S')).toBe(28);
    await expect(height('Size M')).toBe(36);
    await expect(height('Size L')).toBe(44);
  },
};

export const WithError: Story = {
  args: { label: 'Amount', error: 'Enter an amount', hint: 'In pesos' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Amount');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    const ids = (input.getAttribute('aria-describedby') ?? '').split(' ');
    const texts = ids.map((id) => canvasElement.ownerDocument.getElementById(id)?.textContent);
    await expect(texts).toContain('Enter an amount');
  },
};

export const Numeric: Story = {
  args: { label: 'Amount', numeric: true, prefix: '₱' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Amount');
    await expect(input).toHaveAttribute('inputmode', 'decimal');
    await userEvent.type(input, '1,234.50');
    await expect(input).toHaveValue('1,234.50');
  },
};

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <TextField {...args} label="Normal" />
      <TextField {...args} label="Disabled" disabled />
      <TextField {...args} label="Invalid" error="Something is off" />
      <TextField {...args} label="Required" required />
    </div>
  ),
};

export const TouchFontSize: Story = {
  args: { label: 'Note', size: 's' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Note');
    try {
      document.documentElement.dataset.pointer = 'coarse';
      await expect(getComputedStyle(input).fontSize).toBe('16px');
    } finally {
      delete document.documentElement.dataset.pointer;
    }
    await expect(getComputedStyle(input).fontSize).toBe('12px');
  },
};

export const Dark: Story = { ...States, globals: { theme: 'dark' } };
