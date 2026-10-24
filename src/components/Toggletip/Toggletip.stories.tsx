import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Toggletip } from './Toggletip';

const meta = {
  title: 'Components/Overlays/Toggletip',
  component: Toggletip,
  tags: ['autodocs'],
  args: { label: 'What does Forecast mean?', children: 'Forecast is what we expect to spend based on past months.' },
} satisfies Meta<typeof Toggletip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <p className="flex items-center gap-2">
      Forecast <Toggletip {...args} />
    </p>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'What does Forecast mean?' })).toBeVisible();
  },
};

export const Open: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'What does Forecast mean?' });
    await userEvent.click(trigger);
    const body = within(document.body);
    await expect(await body.findByText(/what we expect to spend/)).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByText(/what we expect to spend/)).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const Dark: Story = { ...Default, globals: { theme: 'dark' } };
