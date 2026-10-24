import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Card } from './Card';

const meta = {
  title: 'Components/Display/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A bordered surface that groups related content, with 16px container radius and a soft shadow. \`padding\` is none, s (12px) or m (16px); \`as\` renders a div, section or article.

**Keyboard:** none; a Card is not focusable. Interactive content inside it keeps its own focus order.

**Semantics:** a plain container. Use \`as="section"\` with a heading inside (and \`aria-labelledby\`) when it should be a landmark-like region.

**Do** put a heading at the top of a Card that stands alone. **Don't** make the whole Card clickable; put a Button or link inside it.`,
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Monthly overview' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Monthly overview')).toBeVisible();
  },
};

export const Paddings: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(['none', 's', 'm'] as const).map((p) => (
        <Card key={p} padding={p} aria-label={`padding ${p}`} role="group">
          Padding {p}
        </Card>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pad = (n: string) =>
      getComputedStyle(canvas.getByRole('group', { name: `padding ${n}` })).paddingLeft;
    await expect(pad('none')).toBe('0px');
    await expect(pad('s')).toBe('12px');
    await expect(pad('m')).toBe('16px');
  },
};

export const AsSection: Story = {
  render: () => (
    <Card as="section" aria-label="Savings goals">
      Savings goals
    </Card>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Savings goals' }),
    ).toBeVisible();
  },
};

export const Dark: Story = { ...Default, globals: { theme: 'dark' } };
