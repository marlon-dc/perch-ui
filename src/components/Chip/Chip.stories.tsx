import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { PlusIcon } from '../Icon';
import { Chip } from './Chip';

const meta = {
  title: 'Components/Navigation/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: { children: 'Groceries' },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole('button', { name: 'Groceries' });
    await expect(chip).toBeVisible();
    await expect(chip).not.toHaveAttribute('aria-pressed');
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Chip size="s">Small</Chip>
      <Chip size="m">Medium</Chip>
      <Chip size="l">Large</Chip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const h = (n: string) => canvas.getByRole('button', { name: n }).getBoundingClientRect().height;
    await expect(h('Small')).toBe(28);
    await expect(h('Medium')).toBe(36);
    await expect(h('Large')).toBe(44);
  },
};

export const Toggle: Story = {
  render: () => {
    const [on, setOn] = useState(false);
    return (
      <Chip pressed={on} onClick={() => setOn(!on)}>
        Utilities
      </Chip>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole('button', { name: 'Utilities' });
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(chip);
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(chip);
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
  },
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Chip pressed={false} icon={<PlusIcon />}>
        Rent
      </Chip>
      <Chip pressed icon={<PlusIcon />}>
        Savings
      </Chip>
      <Chip disabled>Archived</Chip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Savings' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(canvas.getByRole('button', { name: 'Archived' })).toBeDisabled();
  },
};

export const Dark: Story = { ...States, globals: { theme: 'dark' } };
