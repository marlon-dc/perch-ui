import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { SegmentedControl } from '../../components/SegmentedControl';
import { Select } from '../../components/Select';
import { TextField } from '../../components/TextField';
import type { Size } from '../../lib/size';

const SIZES: ReadonlyArray<{ size: Size; height: number }> = [
  { size: 's', height: 28 },
  { size: 'm', height: 36 },
  { size: 'l', height: 44 },
];

function SizeRow({ size }: { size: Size }) {
  const [view, setView] = useState('month');
  return (
    <div
      role="group"
      aria-label={`Size ${size.toUpperCase()}`}
      data-size-row={size}
      className="flex flex-wrap items-end gap-3"
    >
      <Button size={size}>Save</Button>
      <div className="w-40">
        <TextField label="Estimate" size={size} numeric placeholder="0" />
      </div>
      <div className="w-40">
        <Select
          label="Category"
          size={size}
          placeholder="Choose"
          options={[
            { value: 'design', label: 'Design' },
            { value: 'research', label: 'Research' },
          ]}
        />
      </div>
      <Chip size={size}>Research</Chip>
      <SegmentedControl
        aria-label={`View, size ${size.toUpperCase()}`}
        size={size}
        value={view}
        onValueChange={setView}
        options={[
          { value: 'month', label: 'Month' },
          { value: 'year', label: 'Year' },
        ]}
      />
    </div>
  );
}

const meta = {
  title: 'Foundations/SizeScale',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AlignedRow: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {SIZES.map(({ size }) => (
        <SizeRow key={size} size={size} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const { size, height } of SIZES) {
      const row = within(canvas.getByRole('group', { name: `Size ${size.toUpperCase()}` }));
      const outer: Record<string, HTMLElement> = {
        Button: row.getByRole('button', { name: 'Save' }),
        // TextField's visible box is the bordered wrapper around the input.
        TextField: row.getByRole('textbox', { name: 'Estimate' }).parentElement!,
        Select: row.getByRole('combobox', { name: 'Category' }),
        Chip: row.getByRole('button', { name: 'Research' }),
        SegmentedControl: row.getByRole('tablist'),
      };
      for (const [name, el] of Object.entries(outer)) {
        await expect({ name, size, height: el.getBoundingClientRect().height }).toEqual({
          name,
          size,
          height,
        });
      }
    }
  },
};

export const Dark: Story = { ...AlignedRow, globals: { theme: 'dark' } };
