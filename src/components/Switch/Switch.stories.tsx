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
    // Thumb colours: muted on the surface-2 track when off, surface on accent when on (both >=3:1).
    const thumb = sw.nextElementSibling as HTMLElement;
    const color = (cls: string) => {
      const probe = document.createElement('div');
      probe.className = cls;
      canvasElement.append(probe);
      const value = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return value;
    };
    await expect(getComputedStyle(thumb).backgroundColor).toBe(color('bg-muted'));
    await userEvent.click(sw);
    await expect(sw).toBeChecked();
    await expect(getComputedStyle(thumb).backgroundColor).toBe(color('bg-surface'));
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

States.play = async ({ canvasElement }) => {
  await expect(within(canvasElement).getByRole('switch', { name: 'Disabled' })).toBeDisabled();
};

/** On coarse pointers the whole label row gets a hit area of at least 44px tall. */
export const HitArea: Story = {
  args: { size: 's' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const target = canvas.getByRole('switch').closest('label')!;
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
