import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ConfirmToggle } from '../ConfirmToggle';
import { Numeric } from '../Numeric';
import { List } from './List';
import { ListRow } from './ListRow';
import { ListSectionHeader } from './ListSectionHeader';

const onSelectSpy = fn();

const meta = {
  title: 'Components/Display/List',
  component: List,
  subcomponents: { ListRow, ListSectionHeader },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A bordered list of rows. ListRow shows a title, subtitle, value and an optional trailing control; it can be selectable (\`onSelect\`), \`disabled\` and \`done\`. ListSectionHeader groups rows under a label.

**Keyboard:** a selectable row is a single button (Tab, Enter or Space). A trailing control is a separate tab stop, never nested inside the row button.

**Semantics:** \`role="list"\` with \`role="listitem"\` rows (section headers are list items too). Done rows show a visible check, add hidden "(Done)" text and, in forced colors, a Highlight left border; with a trailing ConfirmToggle the toggle carries the visible check.

**Do** let the row content name a selectable row, or give a \`selectLabel\` that contains the visible title ("Edit Design review"). **Don't** put a button inside \`value\`; use \`trailing\`.`,
      },
    },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <List aria-label="Tasks">
      <ListSectionHeader trailing={<Numeric value={21} />}>This sprint</ListSectionHeader>
      <ListRow title="Design review" subtitle="Due Friday" value={<Numeric value={12} />} />
      <ListRow title="Release notes" subtitle="Draft" value={<Numeric value={6} />} />
      <ListRow title="Bug fixes" value={<Numeric value={3} />} />
    </List>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('list', { name: 'Tasks' })).toBeVisible();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4);
    // Section header text lines up with row titles (both have the 4px left border).
    const left = (text: string) => canvas.getByText(text).getBoundingClientRect().left;
    await expect(left('This sprint')).toBe(left('Design review'));
  },
};

export const Sizes: Story = {
  render: () => (
    <List aria-label="Row sizes">
      <ListRow size="s" title="Size S" value={<Numeric value={100} />} />
      <ListRow size="m" title="Size M" value={<Numeric value={200} />} />
      <ListRow size="l" title="Size L" value={<Numeric value={300} />} />
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
 * Done state is never colour-only: `done` shows a visible check at the end of the row, adds a
 * visually hidden "(Done)" (override with `doneLabel`) to the title, and in forced-colors mode a
 * Highlight left border replaces the tint. When the row has a `trailing` ConfirmToggle, the
 * pressed toggle carries the visible check instead (and exposes `aria-pressed`).
 */
export const States: Story = {
  render: () => (
    <List aria-label="States">
      <ListRow title="Design review" value={<Numeric value={12} />} />
      <ListRow
        title="Release notes"
        done
        value={<Numeric value={6} />}
        trailing={
          <ConfirmToggle pressed onPressedChange={() => {}} label="Mark Release notes done" />
        }
      />
      <ListRow title="Bug fixes" done doneLabel="Complete" value={<Numeric value={3} />} />
    </List>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('(Done)')).toBeInTheDocument();
    await expect(canvas.getByText('(Complete)')).toBeInTheDocument();
    await expect(canvas.queryAllByText('(Done)')).toHaveLength(1);
    const row = (name: string) => canvas.getByText(name).closest('[role="listitem"]')!;
    const doneIcon = (name: string) => row(name).querySelector('[data-slot="done-icon"]');
    // A done row without a trailing control shows a visible check.
    await expect(doneIcon('Bug fixes')).toBeVisible();
    await expect(doneIcon('Bug fixes')).toHaveAttribute('aria-hidden', 'true');
    // With a trailing ConfirmToggle, the pressed toggle carries the visible check instead.
    await expect(doneIcon('Release notes')).toBeNull();
    await expect(doneIcon('Design review')).toBeNull();
  },
};

export const Selectable: Story = {
  render: function Render() {
    const [done, setDone] = useState(false);
    return (
      <List aria-label="Selectable">
        <ListRow
          title="Design review"
          selectLabel="Edit Design review"
          onSelect={onSelectSpy}
          done={done}
          trailing={
            <ConfirmToggle
              pressed={done}
              onPressedChange={setDone}
              label="Mark Design review done"
            />
          }
        />
      </List>
    );
  },
  play: async ({ canvasElement }) => {
    onSelectSpy.mockClear();
    const canvas = within(canvasElement);
    const edit = canvas.getByRole('button', { name: 'Edit Design review' });
    const toggle = canvas.getByRole('button', { name: 'Mark Design review done' });
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
      <ListRow title="Design review" selectLabel="Edit Design review" done onSelect={fn()} />
    </List>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Edit Design review (Done)' }),
    ).toBeVisible();
  },
};

export const SelectableWithValue: Story = {
  render: () => (
    <List aria-label="Selectable with value">
      <ListRow
        title="Design review"
        subtitle="Due Friday"
        value={<Numeric value={12} />}
        onSelect={fn()}
      />
    </List>
  ),
  play: async ({ canvasElement }) => {
    const btn = within(canvasElement).getByRole('button');
    await expect(btn).toHaveAccessibleName(/Design review.*12/);
    await userEvent.tab();
    await expect(btn).toHaveFocus();
  },
};

export const LongContent: Story = {
  render: () => (
    <List aria-label="Long content">
      <ListRow
        title="Migrate the reporting pipeline to the new event schema and backfill history"
        subtitle="Blocked on data access"
        value={<Numeric value={123456789} />}
      />
    </List>
  ),
};

/** On coarse pointers the select button of an S row (40px) gets a hit area of at least 44px. */
export const HitArea: Story = {
  render: () => (
    <List aria-label="Hit area">
      <ListRow size="s" title="Design review" selectLabel="Edit Design review" onSelect={fn()} />
    </List>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const target = canvas.getByRole('button', { name: 'Edit Design review' });
    try {
      document.documentElement.dataset.pointer = 'coarse';
      const after = getComputedStyle(target, '::after');
      await expect(after.minWidth).toBe('44px');
      await expect(after.minHeight).toBe('44px');
    } finally {
      delete document.documentElement.dataset.pointer;
    }
  },
};

/** `disabled` disables the row's select button. */
export const Disabled: Story = {
  render: () => (
    <List aria-label="Disabled">
      <ListRow
        title="Design review"
        selectLabel="Edit Design review"
        onSelect={onSelectSpy}
        disabled
      />
    </List>
  ),
  play: async ({ canvasElement }) => {
    onSelectSpy.mockClear();
    const edit = within(canvasElement).getByRole('button', { name: 'Edit Design review' });
    await expect(edit).toBeDisabled();
    await userEvent.click(edit);
    await expect(onSelectSpy).not.toHaveBeenCalled();
  },
};

export const Dark: Story = { ...States, globals: { theme: 'dark' } };
