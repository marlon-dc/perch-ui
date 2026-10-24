import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Toggletip } from './Toggletip';

const meta = {
  title: 'Components/Overlays/Toggletip',
  component: Toggletip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `An info button that shows a short explanation on click, for terms such as "Forecast". The tip is a Radix Popover positioned beside the button.

**Keyboard:** Tab to the button, Enter or Space to open or close; Escape closes and returns focus to the button.

**Semantics:** an IconButton named by \`label\` (e.g. "What does Forecast mean?") that controls a non-modal \`dialog\` with the same name. Content is shown on demand, not on hover.

**Do** keep tips to one or two sentences. **Don't** put links or form controls inside a toggletip.`,
      },
    },
  },
  args: {
    label: 'What does Forecast mean?',
    children: 'Forecast is what we expect to spend based on past months.',
  },
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
    await expect(
      within(canvasElement).getByRole('button', { name: 'What does Forecast mean?' }),
    ).toBeVisible();
  },
};

export const Open: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'What does Forecast mean?' });
    await userEvent.click(trigger);
    const body = within(document.body);
    await expect(
      await body.findByRole('dialog', { name: 'What does Forecast mean?' }),
    ).toBeVisible();
    await expect(await body.findByText(/what we expect to spend/)).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByText(/what we expect to spend/)).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const Dark: Story = { ...Default, globals: { theme: 'dark' } };
