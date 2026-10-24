import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Due soon' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Due soon')).toBeVisible();
  },
};

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge tone="neutral">Neutral</Badge>
      <Badge tone="accent">Accent</Badge>
      <Badge tone="warning">Warning</Badge>
      <Badge tone="positive">Positive</Badge>
      <Badge tone="negative">Negative</Badge>
    </div>
  ),
};

export const Dark: Story = { ...AllTones, globals: { theme: 'dark' } };
