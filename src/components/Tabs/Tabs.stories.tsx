import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

const meta = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  subcomponents: { TabsList, TabsTrigger, TabsContent },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const demo = (size?: 's' | 'm' | 'l', label = 'Sections') => (
  <Tabs defaultValue="bills">
    <TabsList aria-label={label} size={size}>
      <TabsTrigger value="bills">Bills</TabsTrigger>
      <TabsTrigger value="income">Income</TabsTrigger>
      <TabsTrigger value="savings">Savings</TabsTrigger>
      <TabsTrigger value="archive" disabled>Archive</TabsTrigger>
    </TabsList>
    <TabsContent value="bills">Rent and electricity</TabsContent>
    <TabsContent value="income">Salary and side jobs</TabsContent>
    <TabsContent value="savings">Emergency fund</TabsContent>
  </Tabs>
);

export const Default: Story = {
  render: () => demo(),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tab', { name: 'Bills' })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Rent and electricity');
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
      within(canvas.getByRole('tablist', { name: list })).getAllByRole('tab')[0]!.getBoundingClientRect().height;
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
    await expect(canvas.getByRole('tab', { name: 'Income' })).toHaveAttribute('aria-selected', 'false');
  },
};

export const Keyboard: Story = {
  render: () => demo(),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('tab', { name: 'Bills' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Income' })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Salary and side jobs');
  },
};

export const Dark: Story = { ...Sizes, globals: { theme: 'dark' } };
