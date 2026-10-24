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
  subcomponents: { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell, TableCellButton },
  tags: ['autodocs'],
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
            <TableHeaderCell sticky scope="col">Item</TableHeaderCell>
            {weeks.map((w) => (
              <TableHeaderCell key={w} scope="col" className="text-right">{w}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow variant="group" tint="inflow">
            <TableHeaderCell sticky scope="row">Income</TableHeaderCell>
            <TableCell colSpan={4} />
          </TableRow>
          <TableRow tint="inflow">
            <TableHeaderCell sticky scope="row">Salary</TableHeaderCell>
            <TableCell numeric tone="done"><Money amount={25000} /></TableCell>
            <TableCell numeric><Money amount={0} /></TableCell>
            <TableCell numeric tone="done"><Money amount={25000} /></TableCell>
            <TableCell numeric><Money amount={0} /></TableCell>
          </TableRow>
          <TableRow variant="group" tint="exp">
            <TableHeaderCell sticky scope="row">Bills</TableHeaderCell>
            <TableCell colSpan={4} />
          </TableRow>
          <TableRow tint="exp">
            <TableHeaderCell sticky scope="row">Rent</TableHeaderCell>
            <TableCell numeric>
              <TableCellButton aria-label="Edit Rent, column 1: 12,000.00"><Money amount={12000} /></TableCellButton>
            </TableCell>
            <TableCell numeric>
              <TableCellButton aria-label="Edit Rent, column 2: 0.00" onClick={onEdit}><Money amount={0} /></TableCellButton>
            </TableCell>
            <TableCell numeric tone="partial"><Money amount={500} /></TableCell>
            <TableCell numeric><Money amount={0} /></TableCell>
          </TableRow>
          <TableRow tint="exp">
            <TableHeaderCell sticky scope="row">Electricity</TableHeaderCell>
            <TableCell numeric><Money amount={0} /></TableCell>
            <TableCell numeric><Money amount={2450} /></TableCell>
            <TableCell numeric><Money amount={0} /></TableCell>
            <TableCell numeric><Money amount={0} /></TableCell>
          </TableRow>
          <TableRow tint="exp">
            <TableHeaderCell sticky scope="row">Groceries</TableHeaderCell>
            <TableCell numeric><Money amount={1800} /></TableCell>
            <TableCell numeric><Money amount={1800} /></TableCell>
            <TableCell numeric><Money amount={1800} /></TableCell>
            <TableCell numeric><Money amount={1800} /></TableCell>
          </TableRow>
          <TableRow variant="summary">
            <TableHeaderCell sticky scope="row">Left over</TableHeaderCell>
            <TableCell numeric><Money amount={11200} /></TableCell>
            <TableCell numeric><Money amount={-4250} /></TableCell>
            <TableCell numeric><Money amount={22700} /></TableCell>
            <TableCell numeric><Money amount={-1800} /></TableCell>
          </TableRow>
          <TableRow variant="total">
            <TableHeaderCell sticky scope="row">Total</TableHeaderCell>
            <TableCell numeric><Money amount={27850} /></TableCell>
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
    await userEvent.click(canvas.getByRole('button', { name: /^Edit Rent, column 2/ }));
    await expect(onEdit).toHaveBeenCalled();
  },
};

export const Dark: Story = { ...MonthGrid, globals: { theme: 'dark' } };
