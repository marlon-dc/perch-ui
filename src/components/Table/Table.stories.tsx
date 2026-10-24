import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Money } from '../Money';
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
        component: `A dense, horizontally scrollable grid for month-by-week figures. TableContainer is a focusable, named region; rows support group, summary and total variants and category tints; cells support sticky row headers, numeric alignment and done or partial tones. TableCellButton makes a cell editable.

**Keyboard:** Tab to the region and scroll it with the arrow keys; Tab again reaches cell buttons, which activate with Enter or Space.

**Semantics:** a native \`<table>\` with \`th scope\` headers. Done cells show a visible check plus hidden "(Paid)" text, and partial cells an accent bar plus hidden "(Partly paid)". A cell button's name keeps the visible amount and appends an \`actionLabel\` such as "edit Rent, Week 2".

**Do** give every row a row header. **Don't** rely on row tint to convey meaning; it is grouping only.`,
      },
    },
  },
  args: { 'aria-label': 'Month grid', children: null },
} satisfies Meta<typeof TableContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

const onEdit = fn();
const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

function Grid() {
  return (
    <TableContainer aria-label="Month grid">
      <Table className="min-w-[640px]">
        <TableHead>
          <TableRow>
            <TableHeaderCell sticky scope="col">
              Item
            </TableHeaderCell>
            {weeks.map((w) => (
              <TableHeaderCell key={w} scope="col" className="text-right">
                {w}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow variant="group" tint="inflow">
            <TableHeaderCell sticky scope="row">
              Income
            </TableHeaderCell>
            <TableCell colSpan={4} />
          </TableRow>
          <TableRow tint="inflow">
            <TableHeaderCell sticky scope="row">
              Salary
            </TableHeaderCell>
            <TableCell numeric tone="done">
              <Money amount={25000} />
            </TableCell>
            <TableCell numeric>
              <Money amount={0} />
            </TableCell>
            <TableCell numeric tone="done">
              <Money amount={25000} />
            </TableCell>
            <TableCell numeric>
              <Money amount={0} />
            </TableCell>
          </TableRow>
          <TableRow variant="group" tint="exp">
            <TableHeaderCell sticky scope="row">
              Bills
            </TableHeaderCell>
            <TableCell colSpan={4} />
          </TableRow>
          <TableRow tint="exp">
            <TableHeaderCell sticky scope="row">
              Rent
            </TableHeaderCell>
            <TableCell numeric>
              <TableCellButton actionLabel="edit Rent, Week 1">
                <Money amount={12000} />
              </TableCellButton>
            </TableCell>
            <TableCell numeric>
              <TableCellButton actionLabel="edit Rent, Week 2" onClick={onEdit}>
                <Money amount={0} />
              </TableCellButton>
            </TableCell>
            <TableCell numeric tone="partial">
              <Money amount={500} />
            </TableCell>
            <TableCell numeric>
              <Money amount={0} />
            </TableCell>
          </TableRow>
          <TableRow tint="exp">
            <TableHeaderCell sticky scope="row">
              Electricity
            </TableHeaderCell>
            <TableCell numeric>
              <Money amount={0} />
            </TableCell>
            <TableCell numeric>
              <Money amount={2450} />
            </TableCell>
            <TableCell numeric>
              <Money amount={0} />
            </TableCell>
            <TableCell numeric>
              <Money amount={0} />
            </TableCell>
          </TableRow>
          <TableRow tint="exp">
            <TableHeaderCell sticky scope="row">
              Groceries
            </TableHeaderCell>
            <TableCell numeric>
              <Money amount={1800} />
            </TableCell>
            <TableCell numeric>
              <Money amount={1800} />
            </TableCell>
            <TableCell numeric>
              <Money amount={1800} />
            </TableCell>
            <TableCell numeric>
              <Money amount={1800} />
            </TableCell>
          </TableRow>
          <TableRow variant="summary">
            <TableHeaderCell sticky scope="row">
              Left over
            </TableHeaderCell>
            <TableCell numeric>
              <Money amount={11200} />
            </TableCell>
            <TableCell numeric>
              <Money amount={-4250} />
            </TableCell>
            <TableCell numeric>
              <Money amount={22700} />
            </TableCell>
            <TableCell numeric>
              <Money amount={-1800} />
            </TableCell>
          </TableRow>
          <TableRow variant="total">
            <TableHeaderCell sticky scope="row">
              Total
            </TableHeaderCell>
            <TableCell numeric>
              <Money amount={27850} />
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
  render: () => <Grid />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('table')).toBeVisible();
  },
};

export const MonthGrid: Story = {
  render: () => <Grid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole('region', { name: 'Month grid' });
    region.focus();
    await expect(region).toHaveFocus();
    for (const name of ['Salary', 'Rent', 'Groceries']) {
      const cell = canvas.getByRole('rowheader', { name });
      await expect(getComputedStyle(cell).position).toBe('sticky');
      await expect(getComputedStyle(cell).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    }
    await expect(canvas.getByRole('cell', { name: /₱500\.00 \(Partly paid\)/ })).toBeVisible();
    // Done is not colour-only: every done cell shows a visible (aria-hidden) check.
    const doneCells = canvas.getAllByRole('cell', { name: /\(Paid\)$/ });
    await expect(doneCells).toHaveLength(2);
    for (const cell of doneCells) {
      const icon = cell.querySelector('[data-slot="done-icon"]');
      await expect(icon).not.toBeNull();
      await expect(icon).toBeVisible();
      await expect(icon).toHaveAttribute('aria-hidden', 'true');
    }
    await userEvent.click(canvas.getByRole('button', { name: /^₱0\.00, edit Rent, Week 2$/ }));
    await expect(onEdit).toHaveBeenCalled();
  },
};

export const Dark: Story = { ...MonthGrid, globals: { theme: 'dark' } };
