import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SegmentedControl } from './SegmentedControl';

const options = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

const spy = fn();

const meta = {
  title: 'Components/Navigation/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  args: { value: 'month', onValueChange: () => {}, options, 'aria-label': 'Period' },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled(props: Partial<React.ComponentProps<typeof SegmentedControl>>) {
  const [value, setValue] = useState('month');
  return (
    <SegmentedControl
      aria-label="Period"
      options={options}
      {...props}
      value={value}
      onValueChange={(v) => {
        setValue(v);
        props.onValueChange?.(v);
      }}
    />
  );
}

export const Default: Story = {
  render: () => <Controlled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tablist', { name: 'Period' })).toBeVisible();
    await expect(canvas.getByRole('tab', { name: 'Month' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    // The selected segment has a >=3:1 line-strong border (not just a 1.1:1 fill); the track too.
    const active = getComputedStyle(canvas.getByRole('tab', { name: 'Month' }));
    const idle = getComputedStyle(canvas.getByRole('tab', { name: 'Week' }));
    const track = getComputedStyle(canvas.getByRole('tablist', { name: 'Period' }));
    await expect(active.borderTopWidth).toBe('1px');
    await expect(active.borderTopColor).toBe(track.borderTopColor);
    await expect(idle.borderTopColor).toBe('rgba(0, 0, 0, 0)');
    const probe = document.createElement('div');
    probe.className = 'border-line-strong';
    canvasElement.append(probe);
    const lineStrong = getComputedStyle(probe).borderTopColor;
    probe.remove();
    await expect(track.borderTopColor).toBe(lineStrong);
    await userEvent.click(canvas.getByRole('tab', { name: 'Year' }));
    await expect(canvas.getByRole('tab', { name: 'Year' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Controlled size="s" aria-label="Small" />
      <Controlled size="m" aria-label="Medium" />
      <Controlled size="l" aria-label="Large" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const h = (name: string) =>
      canvas.getByRole('tablist', { name }).getBoundingClientRect().height;
    await expect(h('Small')).toBe(28);
    await expect(h('Medium')).toBe(36);
    await expect(h('Large')).toBe(44);
  },
};

export const States: Story = {
  render: () => <Controlled fullWidth />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('tablist');
    await expect(list.parentElement!.getBoundingClientRect().width).toBeGreaterThan(200);
    // R5: no dangling aria-controls without panels.
    for (const tab of canvas.getAllByRole('tab')) {
      await expect(tab).not.toHaveAttribute('aria-controls');
    }
  },
};

export const Keyboard: Story = {
  args: { value: 'month', onValueChange: spy },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('tab', { name: 'Month' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onValueChange).toHaveBeenCalledWith('year');
  },
};

export const Dark: Story = { ...Sizes, globals: { theme: 'dark' } };

export const TouchTarget: Story = {
  render: () => <Controlled size="s" />,
  play: async ({ canvasElement }) => {
    const tab = within(canvasElement).getByRole('tab', { name: 'Week' });
    try {
      document.documentElement.dataset.pointer = 'coarse';
      await expect(getComputedStyle(tab, '::after').minHeight).toBe('44px');
    } finally {
      delete document.documentElement.dataset.pointer;
    }
  },
};
