import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ChevronRightIcon, PlusIcon } from '../Icon';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { LinkButton } from './LinkButton';

const meta = {
  title: 'Components/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  args: { onClick: fn(), children: 'Add expense' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    const button = canvas.getByRole('button', { name: 'Add expense' });
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(['s', 'm', 'l'] as const).map((size) => (
        <span key={size} className="flex items-center gap-3">
          <Button {...args} size={size} variant="primary">
            {`Primary ${size.toUpperCase()}`}
          </Button>
          <Button {...args} size={size} variant="secondary">
            {`Secondary ${size.toUpperCase()}`}
          </Button>
        </span>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const height = (name: string) =>
      canvas.getByRole('button', { name }).getBoundingClientRect().height;
    await expect(height('Primary S')).toBe(28);
    await expect(height('Primary M')).toBe(36);
    await expect(height('Primary L')).toBe(44);
    await expect(height('Secondary S')).toBe(28);
    await expect(height('Secondary M')).toBe(36);
    await expect(height('Secondary L')).toBe(44);
  },
};

// Viewport-dependent heights are asserted in Button.viewport.test.tsx (project `browser`).
export const ResponsiveSize: Story = {
  args: { size: { base: 'l', m: 's' }, children: 'Responsive' },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="danger">
        Delete
      </Button>
      <Button {...args} variant="primary" icon={<PlusIcon size={16} />}>
        With icon
      </Button>
      <Button {...args} disabled>
        Disabled
      </Button>
      <Button {...args} fullWidth>
        Full width
      </Button>
      <LinkButton onClick={args.onClick}>Link button</LinkButton>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Disabled' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Link button' })).toBeVisible();
  },
};

export const Loading: Story = {
  args: { loading: true, variant: 'primary', children: 'Saving' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Saving' });
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toHaveAttribute('aria-disabled', 'true');
  },
};

export const DangerConfirm: Story = {
  args: {
    variant: 'danger',
    children: 'Delete Rent',
    confirm: { label: 'Tap again to delete' },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
    await expect(button).toHaveTextContent('Tap again to delete');
    await expect(button).toHaveAttribute('data-armed');
    await expect(canvas.getByRole('status')).toHaveTextContent('Tap again to delete');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await expect(button).not.toHaveAttribute('data-armed');
    await expect(canvas.getByRole('status')).toBeEmptyDOMElement();
  },
};

export const IconButtons: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <IconButton
        label="Previous month"
        icon={<ChevronRightIcon className="rotate-180" />}
        onClick={args.onClick}
      />
      <IconButton
        label="Next month"
        icon={<ChevronRightIcon />}
        onClick={args.onClick}
        variant="ghost"
      />
      <IconButton label="Syncing" icon={<PlusIcon />} loading onClick={args.onClick} />
      <IconButton
        label="Add"
        icon={<PlusIcon />}
        variant="primary"
        size="s"
        onClick={args.onClick}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const next = canvas.getByRole('button', { name: 'Next month' });
    await expect(next).toBeInTheDocument();
    const rect = next.getBoundingClientRect();
    await expect(rect.width).toBe(rect.height);
    const loading = canvas.getByRole('button', { name: 'Syncing' });
    await expect(loading).toHaveAttribute('aria-busy', 'true');
    await expect(loading.querySelector('svg')).toBeNull();
  },
};

export const Dark: Story = { ...Variants, globals: { theme: 'dark' } };
