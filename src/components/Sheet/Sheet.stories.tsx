import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button';
import { TextField } from '../TextField';
import { Sheet } from './Sheet';

const meta = {
  title: 'Components/Overlays/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A modal panel for focused tasks such as editing an item: a bottom sheet below 700px and a centered dialog from 700px. It is controlled with \`open\` and \`onOpenChange\`, and takes a \`title\`, optional \`description\` and \`footer\`.

**Keyboard:** focus moves into the sheet when it opens and is trapped there; Escape or the Close button closes it, and focus returns to the element that opened it.

**Semantics:** a Radix \`dialog\` with \`aria-modal\`, named by its title and described by its description when given. The overlay hides the rest of the page from assistive tech.

**Do** keep the primary action in \`footer\`. **Don't** stack one Sheet on top of another.`,
      },
    },
  },
  args: { open: false, onOpenChange: () => {}, title: 'Edit item', children: null },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ initialOpen = false }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit item</Button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="Edit item"
        description="Change the name or amount."
        footer={
          <Button variant="primary" onClick={() => setOpen(false)}>
            Done
          </Button>
        }
      >
        <TextField label="Name" defaultValue="Rent" />
      </Sheet>
    </>
  );
}

export const Default: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Edit item' })).toBeVisible();
  },
};

/** Review Focus 5: focus enters the dialog, scroll is locked, and focus returns to the trigger on close. */
export const FocusReturn: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Edit item' });
    const body = within(document.body);
    for (const how of ['escape', 'close'] as const) {
      await userEvent.click(trigger);
      const dialog = await body.findByRole('dialog', { name: 'Edit item' });
      await expect(dialog).toBeVisible();
      await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
      await expect(
        getComputedStyle(document.body).overflow === 'hidden' ||
          document.body.hasAttribute('data-scroll-locked'),
      ).toBe(true);
      if (how === 'escape') await userEvent.keyboard('{Escape}');
      else await userEvent.click(body.getByRole('button', { name: 'Close' }));
      await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
      await waitFor(() => expect(document.activeElement).toBe(trigger));
    }
  },
};

export const WithoutDescription: Story = {
  args: { open: true, title: 'Edit item', children: <p>Nothing else to describe.</p> },
  play: async () => {
    await expect(
      await within(document.body).findByRole('dialog', { name: 'Edit item' }),
    ).toBeVisible();
  },
};

export const Narrow: Story = {
  render: () => <Demo initialOpen />,
  play: async () => {
    await expect(
      await within(document.body).findByRole('dialog', { name: 'Edit item' }),
    ).toBeVisible();
  },
};

export const Dark: Story = { ...Narrow, globals: { theme: 'dark' } };
