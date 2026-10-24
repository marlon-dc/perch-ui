import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Inputs/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { label: 'Show empty items' },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Toggle: Story = {
  args: { label: 'Show empty items' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sw = canvas.getByRole('switch', { name: 'Show empty items' });
    await expect(sw).not.toBeChecked();
    await userEvent.click(sw);
    await expect(sw).toBeChecked();
    await userEvent.keyboard(' ');
    await expect(sw).not.toBeChecked();
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {(['s', 'm', 'l'] as const).map((size) => (
        <Switch key={size} size={size} label={`Size ${size.toUpperCase()}`} defaultChecked />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const w = (name: string) => canvas.getByRole('switch', { name }).getBoundingClientRect().width;
    await expect(w('Size S')).toBe(32);
    await expect(w('Size M')).toBe(36);
    await expect(w('Size L')).toBe(40);
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Switch label="Unchecked" />
      <Switch label="Checked" defaultChecked />
      <Switch label="Disabled" disabled />
      <Switch label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};

export const Dark: Story = { ...States, globals: { theme: 'dark' } };
