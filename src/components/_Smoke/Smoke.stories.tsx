import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

const meta = {
  title: 'Smoke/Button',
  render: () => <button className="rounded bg-black px-3 py-1 text-white">Smoke</button>,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Smoke' })).toBeVisible();
  },
};
