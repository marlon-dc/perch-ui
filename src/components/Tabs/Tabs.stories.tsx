import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

const meta = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  subcomponents: { TabsList, TabsTrigger, TabsContent },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Switches between panels of related content. Built on Radix Tabs: Tabs, TabsList (sized S, M or L), TabsTrigger and TabsContent.

**Keyboard:** Tab moves focus into the tab list and then to the active panel; Left and Right arrows move between tabs and activate them.

**Semantics:** \`tablist\`, \`tab\` and \`tabpanel\` roles with \`aria-selected\` and \`aria-controls\`. The active tab has a 2px accent bottom border that becomes Highlight in forced colors.

**Do** name the TabsList with \`aria-label\`. **Don't** use Tabs for a filter that keeps the same panel; use SegmentedControl.`,
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const demo = (size?: 's' | 'm' | 'l', label = 'Sections') => (
  <Tabs defaultValue="overview">
    <TabsList aria-label={label} size={size}>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="activity">Activity</TabsTrigger>
      <TabsTrigger value="settings">Settings</TabsTrigger>
      <TabsTrigger value="archive" disabled>
        Archive
      </TabsTrigger>
    </TabsList>
    <TabsContent value="overview">Project summary</TabsContent>
    <TabsContent value="activity">Recent changes</TabsContent>
    <TabsContent value="settings">Notifications and access</TabsContent>
  </Tabs>
);

export const Default: Story = {
  render: () => demo(),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Project summary');
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {demo('s', 'Small')}
      {demo('m', 'Medium')}
      {demo('l', 'Large')}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const h = (list: string) =>
      within(canvas.getByRole('tablist', { name: list }))
        .getAllByRole('tab')[0]!
        .getBoundingClientRect().height;
    await expect(h('Small')).toBe(28);
    await expect(h('Medium')).toBe(36);
    await expect(h('Large')).toBe(44);
  },
};

export const States: Story = {
  render: () => demo(),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tab', { name: 'Archive' })).toBeDisabled();
    await expect(canvas.getByRole('tab', { name: 'Activity' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  },
};

export const Keyboard: Story = {
  render: () => demo(),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('tab', { name: 'Overview' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Activity' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Recent changes');
  },
};

export const Dark: Story = { ...Sizes, globals: { theme: 'dark' } };

export const TouchTarget: Story = {
  render: () => demo('s'),
  play: async ({ canvasElement }) => {
    const tab = within(canvasElement).getByRole('tab', { name: 'Overview' });
    try {
      document.documentElement.dataset.pointer = 'coarse';
      await expect(getComputedStyle(tab, '::after').minHeight).toBe('44px');
    } finally {
      delete document.documentElement.dataset.pointer;
    }
  },
};
