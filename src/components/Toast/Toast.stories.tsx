import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';

function ShowButton({ message = 'Saved' }: { message?: string }) {
  const { show } = useToast();
  return <Button onClick={() => show(message)}>Save changes</Button>;
}

const meta = {
  title: 'Components/Overlays/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  args: { children: null },
  render: () => (
    <ToastProvider>
      <ShowButton />
    </ToastProvider>
  ),
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Save changes' })).toBeVisible();
  },
};

export const Show: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Save changes' }));
    const body = within(document.body);
    const visible = await body.findByText('Saved');
    await expect(visible).toBeVisible();
    await expect(visible.closest('[role="region"]')).not.toBeNull();
    // Radix also renders a visually hidden polite live region that announces "<label> Saved".
    await waitFor(() =>
      expect(document.querySelector('[role="status"][aria-live="polite"]')?.textContent).toMatch(/Saved/),
    );
  },
};

export const Dark: Story = { ...Show, globals: { theme: 'dark' } };
