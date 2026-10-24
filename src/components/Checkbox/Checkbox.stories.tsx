import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Inputs/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'Include in budget' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Toggle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole('checkbox', { name: 'Include in budget' });
    await expect(box).not.toBeChecked();
    await userEvent.click(canvas.getByText('Include in budget'));
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
    const w = (name: string) => canvas.getByRole('checkbox', { name }).getBoundingClientRect().width;
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

export const Dark: Story = { ...States, globals: { theme: 'dark' } };
