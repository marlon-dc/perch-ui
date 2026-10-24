import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Text } from './Text';
import { Heading } from './Heading';

const meta = {
  title: 'Components/Primitives/Text',
  component: Text,
  tags: ['autodocs'],
  args: { children: 'Groceries this week' },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Groceries this week').tagName).toBe('P');
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1">
      {(['xs', 's', 'm', 'l'] as const).map((s) => (
        <Text key={s} {...args} size={s}>
          Size {s}
        </Text>
      ))}
    </div>
  ),
};

export const Headings: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {([1, 2, 3, 4] as const).map((l) => (
        <Heading key={l} level={l}>
          Heading {l}
        </Heading>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'Heading 1' })).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 4, name: 'Heading 4' })).toBeVisible();
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      <Text variant="eyebrow">Eyebrow label</Text>
      <Text weight="bold">Bold</Text>
      <Text as="span" weight="semibold">
        Semibold span
      </Text>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Eyebrow label')).toHaveClass('uppercase');
  },
};

const tones = ['ink', 'muted', 'positive', 'negative'] as const;
export const AllTones: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {['bg-bg', 'bg-surface', 'bg-surface-2'].map((bg) => (
        <div key={bg} className={`${bg} flex gap-4 p-3`}>
          {tones.map((t) => (
            <Text key={t} tone={t}>
              {t} on {bg}
            </Text>
          ))}
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByText(/^ink on/)).toHaveLength(3);
  },
};

export const Dark: Story = { ...AllTones, globals: { theme: 'dark' } };
