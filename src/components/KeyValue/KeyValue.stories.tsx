import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Money } from '../Money';
import { KeyValue } from './KeyValue';

const meta = {
  title: 'Components/Display/KeyValue',
  component: KeyValue,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A list of label and value pairs, such as a monthly summary, with an optional note per row and a \`total\` emphasis for the last line. Values use the tabular number font.

**Keyboard:** none; the list is not interactive.

**Semantics:** a description list (\`<dl>\` with \`<dt>\` and \`<dd>\`), so screen readers announce each label with its value.

**Do** use it for read-only figures. **Don't** use it for editable values; use a form with TextField.`,
      },
    },
  },
  args: {
    items: [
      { label: 'Rent', value: <Money amount={12000} symbol /> },
      { label: 'Electricity', note: 'Estimated', value: <Money amount={2450.5} symbol /> },
      { label: 'Streaming', value: <Money amount={500} symbol /> },
      { label: 'Total', emphasis: 'total', value: <Money amount={14950.5} symbol size="xl" /> },
    ],
  },
} satisfies Meta<typeof KeyValue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('term')).toHaveLength(4);
    const total = canvas.getByText('Total');
    await expect(getComputedStyle(total.closest('dt')!.nextElementSibling!).fontSize).toBe('22px');
  },
};

export const Dark: Story = { ...Summary, globals: { theme: 'dark' } };
