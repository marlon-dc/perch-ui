import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Numeric } from '../Numeric';
import {
  Table,
  TableBody,
  TableCell,
  TableCellButton,
  TableContainer,
  TableHead,
  TableHeaderCell,
  TableRow,
} from './Table';

const meta = {
  title: 'Components/Display/Table',
  component: TableContainer,
  subcomponents: {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableHeaderCell,
    TableCell,
    TableCellButton,
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A dense, horizontally scrollable grid for figures across columns, such as weeks. TableContainer is a focusable, named region; rows support group, summary and total variants and category tints; cells support sticky row headers, numeric alignment and done or partial tones. TableCellButton makes a cell editable.

**Keyboard:** Tab to the region and scroll it with the arrow keys; Tab again reaches cell buttons, which activate with Enter or Space.

**Semantics:** a native \`<table>\` with \`th scope\` headers. Done cells show a visible check plus hidden "(Done)" text, and partial cells an accent bar plus hidden "(Partial)"; both labels are configurable. A cell button's name keeps the visible value and appends an \`actionLabel\` such as "edit API work, Week 2".

**Do** give every row a row header. **Don't** rely on row tint to convey meaning; it is grouping only.`,
      },
    },
  },
  args: { 'aria-label': 'Weekly progress', children: null },
} satisfies Meta<typeof TableContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

const onEdit = fn();
const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

function WeeklyGrid() {
  return (
    <TableContainer aria-label="Weekly progress">
      <Table className="min-w-[640px]">
        <TableHead>
          <TableRow>
            <TableHeaderCell sticky scope="col">
              Task
            </TableHeaderCell>
            {weeks.map((w) => (
              <TableHeaderCell key={w} scope="col" className="text-right">
                {w}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow variant="group" tint="teal">
            <TableHeaderCell sticky scope="row">
              Design
            </TableHeaderCell>
            <TableCell colSpan={4} />
          </TableRow>
          <TableRow tint="teal">
            <TableHeaderCell sticky scope="row">
              Wireframes
            </TableHeaderCell>
            <TableCell numeric tone="done">
              <Numeric value={8} />
            </TableCell>
            <TableCell numeric>
              <Numeric value={0} />
            </TableCell>
            <TableCell numeric tone="done">
              <Numeric value={6} />
            </TableCell>
            <TableCell numeric>
              <Numeric value={0} />
            </TableCell>
          </TableRow>
          <TableRow variant="group" tint="rose">
            <TableHeaderCell sticky scope="row">
              Engineering
            </TableHeaderCell>
            <TableCell colSpan={4} />
          </TableRow>
          <TableRow tint="rose">
            <TableHeaderCell sticky scope="row">
              API work
            </TableHeaderCell>
            <TableCell numeric>
              <TableCellButton actionLabel="edit API work, Week 1">
                <Numeric value={12} />
              </TableCellButton>
            </TableCell>
            <TableCell numeric>
              <TableCellButton actionLabel="edit API work, Week 2" onClick={onEdit}>
                <Numeric value={0} />
              </TableCellButton>
            </TableCell>
            <TableCell numeric tone="partial">
              <Numeric value={5} />
            </TableCell>
            <TableCell numeric>
              <Numeric value={0} />
            </TableCell>
          </TableRow>
          <TableRow tint="rose">
            <TableHeaderCell sticky scope="row">
              Testing
            </TableHeaderCell>
            <TableCell numeric>
              <Numeric value={0} />
            </TableCell>
            <TableCell numeric>
              <Numeric value={4} />
            </TableCell>
            <TableCell numeric>
              <Numeric value={0} />
            </TableCell>
            <TableCell numeric>
              <Numeric value={0} />
            </TableCell>
          </TableRow>
          <TableRow tint="rose">
            <TableHeaderCell sticky scope="row">
              Code review
            </TableHeaderCell>
            <TableCell numeric>
              <Numeric value={3} />
            </TableCell>
            <TableCell numeric>
              <Numeric value={3} />
            </TableCell>
            <TableCell numeric>
              <Numeric value={3} />
            </TableCell>
            <TableCell numeric>
              <Numeric value={3} />
            </TableCell>
          </TableRow>
          <TableRow variant="summary">
            <TableHeaderCell sticky scope="row">
              Change vs plan
            </TableHeaderCell>
            <TableCell numeric>
              <Numeric value={4} />
            </TableCell>
            <TableCell numeric>
              <Numeric value={-2} />
            </TableCell>
            <TableCell numeric>
              <Numeric value={3} />
            </TableCell>
            <TableCell numeric>
              <Numeric value={-1} />
            </TableCell>
          </TableRow>
          <TableRow variant="total">
            <TableHeaderCell sticky scope="row">
              Total
            </TableHeaderCell>
            <TableCell numeric>
              <Numeric value={44} />
            </TableCell>
            <TableCell numeric />
            <TableCell numeric />
            <TableCell numeric />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export const Default: Story = {
  render: () => <WeeklyGrid />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('table')).toBeVisible();
  },
};

export const Grid: Story = {
  render: () => <WeeklyGrid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole('region', { name: 'Weekly progress' });
    region.focus();
    await expect(region).toHaveFocus();
    for (const name of ['Wireframes', 'API work', 'Code review']) {
      const cell = canvas.getByRole('rowheader', { name });
      await expect(getComputedStyle(cell).position).toBe('sticky');
      await expect(getComputedStyle(cell).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    }
    await expect(canvas.getByRole('cell', { name: /^5 \(Partial\)$/ })).toBeVisible();
    // Done is not colour-only: every done cell shows a visible (aria-hidden) check.
    const doneCells = canvas.getAllByRole('cell', { name: /\(Done\)$/ });
    await expect(doneCells).toHaveLength(2);
    for (const cell of doneCells) {
      const icon = cell.querySelector('[data-slot="done-icon"]');
      await expect(icon).not.toBeNull();
      await expect(icon).toBeVisible();
      await expect(icon).toHaveAttribute('aria-hidden', 'true');
    }
    await userEvent.click(canvas.getByRole('button', { name: /^0, edit API work, Week 2$/ }));
    await expect(onEdit).toHaveBeenCalled();
  },
};

export const Dark: Story = { ...Grid, globals: { theme: 'dark' } };
