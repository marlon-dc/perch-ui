import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { ConfirmToggle } from '../../components/ConfirmToggle';
import { Disclosure } from '../../components/Disclosure';
import { PlusIcon } from '../../components/Icon';
import { KeyValue } from '../../components/KeyValue';
import { List, ListRow } from '../../components/List';
import { Money } from '../../components/Money';
import { ProgressBar } from '../../components/ProgressBar';

type Item = { id: string; title: string; subtitle?: string; amount: number | null };

const ITEMS: Item[] = [
  { id: 'rent', title: 'Rent', subtitle: 'Due on the 1st', amount: 12000 },
  { id: 'electricity', title: 'Electricity', subtitle: 'Estimated', amount: 2500 },
  { id: 'groceries', title: 'Groceries', amount: 5000 },
  { id: 'phone', title: 'Phone plan', amount: 1000 },
  { id: 'salary', title: 'Salary', subtitle: 'Needs an amount', amount: null },
];

function PaydayList() {
  const [paid, setPaid] = useState<Record<string, boolean>>({ rent: true });
  const total = ITEMS.reduce((sum, i) => sum + (i.amount ?? 0), 0);
  const paidTotal = ITEMS.reduce((sum, i) => sum + (paid[i.id] ? (i.amount ?? 0) : 0), 0);
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <Disclosure
        title="Payday, 15 March"
        meta={`${Object.values(paid).filter(Boolean).length} of ${ITEMS.length} done`}
        trailing={<Money amount={total} symbol />}
        headingLevel={2}
      >
        <div className="flex flex-col gap-4">
          <ProgressBar label="Paid so far" value={paidTotal} max={total} />
          <List aria-label="Payday items">
            {ITEMS.map((item) => (
              <ListRow
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                done={!!paid[item.id]}
                value={
                  item.amount === null ? (
                    <Badge tone="warning">Add amount</Badge>
                  ) : (
                    <Money amount={item.amount} symbol />
                  )
                }
                trailing={
                  <ConfirmToggle
                    label={`Mark ${item.title} done`}
                    pressed={!!paid[item.id]}
                    onPressedChange={(next) => setPaid((p) => ({ ...p, [item.id]: next }))}
                  />
                }
              />
            ))}
          </List>
          <KeyValue
            items={[
              { label: 'Paid', value: <Money amount={paidTotal} symbol /> },
              { label: 'Remaining', value: <Money amount={total - paidTotal} symbol /> },
              { label: 'Total', value: <Money amount={total} symbol />, emphasis: 'total' },
            ]}
          />
        </div>
      </Disclosure>
      <Button size="l" icon={<PlusIcon />} fullWidth>
        Add
      </Button>
    </div>
  );
}

const meta = {
  title: 'Patterns/PaydayList',
  component: PaydayList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A Disclosure holding a ProgressBar, a List of ListRows with ConfirmToggle trailing, a KeyValue footer, and a large Add button. Sample data is made up.',
      },
    },
  },
} satisfies Meta<typeof PaydayList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Add amount')).toBeVisible();
    const toggle = canvas.getByRole('button', { name: 'Mark Groceries done' });
    const row = toggle.closest('[role="listitem"]') as HTMLElement;
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(within(row).queryByText('(Done)')).toBeNull();
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(within(row).getByText('(Done)')).toBeInTheDocument();
    await expect(canvas.getByRole('progressbar', { name: 'Paid so far' })).toHaveAttribute(
      'aria-valuenow',
      '17000',
    );
  },
};

export const Dark: Story = { ...Default, globals: { theme: 'dark' } };
