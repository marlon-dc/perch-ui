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
  parameters: {
    docs: {
      description: {
        component: `Brief, non-blocking confirmations such as "Changes saved". Wrap the app in ToastProvider and call \`useToast().show(message)\`; each toast closes after \`durationMs\` (4 seconds by default) and can be swiped down to dismiss.

**Keyboard:** F8 moves focus to the toast region; Escape dismisses the focused toast. Toasts pause while hovered or focused.

**Semantics:** Radix Toast with \`type="background"\`, announced politely through a live region. The region sits at the bottom and lets taps pass through to the page around the toasts.

**Do** keep messages short and past tense. **Don't** put the only copy of important information in a toast; it disappears.`,
      },
    },
  },
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
    // The full-width viewport must not swallow taps on the page around the toast.
    const toast = visible.closest('li')!;
    await expect(getComputedStyle(toast.parentElement!).pointerEvents).toBe('none');
    await expect(getComputedStyle(toast).pointerEvents).toBe('auto');
    // swipeDirection="down": the toast follows the finger while swiping (Radix sets data-swipe).
    toast.style.setProperty('--radix-toast-swipe-move-y', '20px');
    toast.setAttribute('data-swipe', 'move');
    await expect(getComputedStyle(toast).translate).toBe('0px 20px');
    toast.removeAttribute('data-swipe');
    // Radix also renders a visually hidden polite live region that announces "<label> Saved".
    await waitFor(() =>
      expect(document.querySelector('[role="status"][aria-live="polite"]')?.textContent).toMatch(
        /Saved/,
      ),
    );
  },
};

export const Dark: Story = { ...Show, globals: { theme: 'dark' } };
