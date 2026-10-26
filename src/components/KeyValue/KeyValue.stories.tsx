import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Numeric } from '../Numeric';
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
      { label: 'Design', value: <Numeric value={12} /> },
      { label: 'Engineering', note: 'Estimated', value: <Numeric value={24.5} /> },
      { label: 'Research', value: <Numeric value={5} /> },
      { label: 'Total', emphasis: 'total', value: <Numeric value={41.5} size="xl" /> },
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
