import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  DotsIcon,
  GridIcon,
  InfoIcon,
  ListIcon,
  MoonIcon,
  PlusIcon,
  SlidersIcon,
  SunIcon,
  SwapIcon,
} from './icons';

const all = {
  List: ListIcon,
  Grid: GridIcon,
  Sliders: SlidersIcon,
  Moon: MoonIcon,
  Sun: SunIcon,
  Info: InfoIcon,
  ChevronDown: ChevronDownIcon,
  Swap: SwapIcon,
  ChevronLeft: ChevronLeftIcon,
  ChevronRight: ChevronRightIcon,
  Dots: DotsIcon,
  Check: CheckIcon,
  Plus: PlusIcon,
};

const meta = {
  title: 'Components/Primitives/Icon',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      {Object.entries(all).map(([name, Cmp]) => (
        <div key={name} className="flex items-center gap-2 text-ink">
          <Cmp />
          <span className="text-muted text-[13px]">{name}</span>
        </div>
      ))}
      <div className="flex items-center gap-2 text-ink">
        <InfoIcon title="Info" />
        <span className="text-muted text-[13px]">Titled</span>
      </div>
    </div>
  ),
  play: async ({ canvasElement, canvas }) => {
    await expect(canvasElement.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(13);
    await expect(canvas.getByRole('img', { name: 'Info' })).toBeVisible();
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-ink">
      <SunIcon size={16} />
      <SunIcon />
      <SunIcon size={32} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svgs = canvasElement.querySelectorAll('svg');
    await expect(svgs[1]).toHaveAttribute('width', '20');
    await expect(svgs[2]).toHaveAttribute('width', '32');
  },
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <CheckIcon className="text-positive" />
      <InfoIcon className="text-muted" />
      <PlusIcon className="text-accent" />
    </div>
  ),
};

export const Dark: Story = { ...Gallery, globals: { theme: 'dark' } };
