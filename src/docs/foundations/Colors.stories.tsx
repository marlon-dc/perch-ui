import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { ColorSwatches, ContrastTable } from './ColorSwatches';

const meta = {
  title: 'Foundations/ColorsDemo',
  parameters: { docs: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tokens: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <ColorSwatches />
      <ContrastTable />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('table')).toBeVisible();
    await expect(canvas.queryAllByText(/Fail/)).toHaveLength(0);
  },
};

export const Dark: Story = { ...Tokens, globals: { theme: 'dark' } };
