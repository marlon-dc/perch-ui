import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ConfirmToggle } from '../ConfirmToggle';
import { Money } from '../Money';
import { List } from './List';
import { ListRow } from './ListRow';
import { ListSectionHeader } from './ListSectionHeader';

const onSelectSpy = fn();

const meta = {
  title: 'Components/Display/List',
  component: List,
  subcomponents: { ListRow, ListSectionHeader },
  tags: ['autodocs'],
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <List aria-label="Bills">
      <ListSectionHeader trailing={<Money amount={14950} symbol />}>This month</ListSectionHeader>
      <ListRow title="Rent" subtitle="Due on the 1st" value={<Money amount={12000} symbol />} />
      <ListRow title="Electricity" subtitle="Estimated" value={<Money amount={2450} symbol />} />
      <ListRow title="Streaming" value={<Money amount={500} symbol />} />
    </List>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('list', { name: 'Bills' })).toBeVisible();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4);
  },
};

export const Sizes: Story = {
  render: () => (
    <List aria-label="Row sizes">
      <ListRow size="s" title="Size S" value={<Money amount={100} />} />
      <ListRow size="m" title="Size M" value={<Money amount={200} />} />
      <ListRow size="l" title="Size L" value={<Money amount={300} />} />
    </List>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const h = (name: string) =>
      canvas.getByText(name).closest('[role="listitem"]')!.getBoundingClientRect().height;
    await expect(h('Size S')).toBe(40);
    await expect(h('Size M')).toBe(48);
    await expect(h('Size L')).toBe(56);
  },
};

/**
 * Done state is never colour-only: `done` adds a visually hidden "(Done)" (override with
 * `doneLabel`) to the title, and in forced-colors mode a Highlight left border replaces the tint.
 * A trailing ConfirmToggle additionally exposes `aria-pressed`.
 */
export const States: Story = {
  render: () => (
    <List aria-label="States">
      <ListRow title="Rent" value={<Money amount={12000} symbol />} />
      <ListRow
        title="Electricity"
        done
        value={<Money amount={2450} symbol />}
        trailing={
          <ConfirmToggle pressed onPressedChange={() => {}} label="Mark Electricity paid" />
        }
      />
      <ListRow title="Streaming" done doneLabel="Paid" value={<Money amount={500} symbol />} />
    </List>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('(Done)')).toBeInTheDocument();
    await expect(canvas.getByText('(Paid)')).toBeInTheDocument();
    await expect(canvas.queryAllByText('(Done)')).toHaveLength(1);
  },
};

export const Selectable: Story = {
  render: function Render() {
    const [paid, setPaid] = useState(false);
    return (
      <List aria-label="Selectable">
        <ListRow
          title="Rent"
          selectLabel="Edit Rent"
          onSelect={onSelectSpy}
          done={paid}
          trailing={
            <ConfirmToggle pressed={paid} onPressedChange={setPaid} label="Mark Rent paid" />
          }
        />
      </List>
    );
  },
  play: async ({ canvasElement }) => {
    onSelectSpy.mockClear();
    const canvas = within(canvasElement);
    const edit = canvas.getByRole('button', { name: 'Edit Rent' });
    const toggle = canvas.getByRole('button', { name: 'Mark Rent paid' });
    await expect(edit.contains(toggle)).toBe(false);
    await userEvent.click(edit);
    await expect(onSelectSpy).toHaveBeenCalledTimes(1);
    await userEvent.click(toggle);
    await expect(onSelectSpy).toHaveBeenCalledTimes(1);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await userEvent.tab({ shift: true });
    await expect(edit).toHaveFocus();
    await expect(edit.getBoundingClientRect().height).toBeGreaterThanOrEqual(48);
  },
};

/** `done` + `selectLabel` without a toggle: the label gains "(Done)" so AT still gets the state. */
export const DoneSelectable: Story = {
  render: () => (
    <List aria-label="Done selectable">
      <ListRow title="Rent" selectLabel="Edit Rent" done onSelect={fn()} />
    </List>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Edit Rent (Done)' }),
    ).toBeVisible();
  },
};

export const SelectableWithValue: Story = {
  render: () => (
    <List aria-label="Selectable with value">
      <ListRow
        title="Rent"
        subtitle="Due on the 1st"
        value={<Money amount={12000} symbol />}
        onSelect={fn()}
      />
    </List>
  ),
  play: async ({ canvasElement }) => {
    const btn = within(canvasElement).getByRole('button');
    await expect(btn).toHaveAccessibleName(/Rent.*12,000/);
    await userEvent.tab();
    await expect(btn).toHaveFocus();
  },
};

export const LongContent: Story = {
  render: () => (
    <List aria-label="Long content">
      <ListRow
        title="Quarterly property association dues and community maintenance fee"
        subtitle="Includes the late fee"
        value={<Money amount={123456789} symbol />}
      />
    </List>
  ),
};

export const Dark: Story = { ...States, globals: { theme: 'dark' } };
