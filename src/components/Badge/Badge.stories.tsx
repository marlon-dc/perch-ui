import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { List, ListRow } from '../List';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A small, non-interactive label for a status such as "Due soon" or "Over budget". Tones are neutral, accent, warning, positive and negative, and each pairs text and fill at 4.5:1 or better.

**Keyboard:** none; a Badge is not focusable.

**Semantics:** a plain \`<span>\`; the text is the meaning, so screen readers read it inline. In forced colors it keeps a CanvasText border.

**Do** write the status in words. **Don't** rely on tone alone (for example a red Badge with only an amount).`,
      },
    },
  },
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

/** Inside a ListRow value (which uses the number font) a Badge keeps the UI font. */
export const InListRowValue: Story = {
  render: () => (
    <List aria-label="Bills">
      <ListRow title="Rent" value={<Badge tone="warning">Due soon</Badge>} />
    </List>
  ),
  play: async ({ canvasElement }) => {
    const badge = within(canvasElement).getByText('Due soon');
    await expect(getComputedStyle(badge).fontFamily).toMatch(/^"?Plus Jakarta Sans/);
  },
};

export const Dark: Story = { ...AllTones, globals: { theme: 'dark' } };
