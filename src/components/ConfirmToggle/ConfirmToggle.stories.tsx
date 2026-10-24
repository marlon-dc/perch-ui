import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ConfirmToggle } from './ConfirmToggle';

const meta = {
  title: 'Components/Inputs/ConfirmToggle',
  component: ConfirmToggle,
  tags: ['autodocs'],
  args: { label: 'Mark Rent paid', pressed: false, onPressedChange: fn() },
} satisfies Meta<typeof ConfirmToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Toggle: Story = {
  render: function Render(args) {
    const [pressed, setPressed] = useState(false);
    return (
      <ConfirmToggle
        {...args}
        pressed={pressed}
        onPressedChange={(next) => {
          args.onPressedChange(next);
          setPressed(next);
        }}
      />
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole('button', { name: 'Mark Rent paid' });
    await expect(btn).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(btn);
    await expect(args.onPressedChange).toHaveBeenCalledWith(true);
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(['s', 'm', 'l'] as const).map((size) => (
        <ConfirmToggle
          key={size}
          size={size}
          label={`Size ${size}`}
          pressed
          onPressedChange={() => {}}
        />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="bg-surface p-3">
        <ConfirmToggle label="Mark Rent paid" pressed={false} onPressedChange={() => {}} />
      </div>
      <div className="bg-done-bg p-3">
        <ConfirmToggle label="Mark Electricity paid" pressed onPressedChange={() => {}} />
      </div>
      <div className="bg-done-bg p-3">
        <ConfirmToggle label="Mark Groceries paid" pressed={false} onPressedChange={() => {}} />
      </div>
    </div>
  ),
};

export const HitArea: Story = {
  args: { size: 's' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole('button', { name: 'Mark Rent paid' });
    try {
      document.documentElement.dataset.pointer = 'coarse';
      await expect(getComputedStyle(btn, '::after').minWidth).toBe('44px');
    } finally {
      delete document.documentElement.dataset.pointer;
    }
  },
};

/** `disabled` blocks toggling; the button reports itself disabled. */
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, args }) => {
    const btn = within(canvasElement).getByRole('button', { name: 'Mark Rent paid' });
    await expect(btn).toBeDisabled();
    await userEvent.click(btn);
    await expect(args.onPressedChange).not.toHaveBeenCalled();
  },
};

export const Dark: Story = { ...States, globals: { theme: 'dark' } };
