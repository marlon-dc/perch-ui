import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from '../Button';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Components/Display/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: 'No bills yet',
    description: 'Add your first bill to start tracking what is due this month.',
    action: <Button>Add bill</Button>,
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('No bills yet')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Add bill' })).toBeVisible();
  },
};

export const TitleOnly: Story = { args: { description: undefined, action: undefined } };

export const Dark: Story = { ...Default, globals: { theme: 'dark' } };
