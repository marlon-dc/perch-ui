import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { GridIcon, ListIcon, SlidersIcon } from '../Icon';
import { SideNav, SideNavItem, SideNavSeparator } from './SideNav';

const spy = fn();

const meta = {
  title: 'Components/Navigation/SideNav',
  component: SideNav,
  subcomponents: { SideNavItem, SideNavSeparator },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Vertical app navigation: a \`nav\` landmark of SideNavItems (links with \`href\`, otherwise buttons), with optional header and separators.

**Keyboard:** Tab through the items; Enter activates (Space too for button items). Disabled link items are skipped.

**Semantics:** a \`<nav>\` named by \`aria-label\`. The current item has \`aria-current="page"\` and an accent left border that becomes Highlight in forced colors. Items are at least 44px tall.

**Do** mark exactly one item \`current\`. **Don't** use SideNav for in-page actions; use Buttons.`,
      },
    },
  },
  args: { 'aria-label': 'Main', children: null },
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const nav = (
  <div className="w-64">
    <SideNav aria-label="Main" header={<strong>Perch</strong>}>
      <SideNavItem icon={<GridIcon />} onClick={spy}>
        Overview
      </SideNavItem>
      <SideNavItem icon={<ListIcon />} current>
        Projects
      </SideNavItem>
      <SideNavSeparator />
      <SideNavItem icon={<SlidersIcon />} href="#settings">
        Settings
      </SideNavItem>
      <SideNavItem disabled>Reports</SideNavItem>
      <SideNavItem href="#help" disabled>
        Help
      </SideNavItem>
    </SideNav>
  </div>
);

export const Default: Story = {
  render: () => nav,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation', { name: 'Main' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Overview' }));
    await expect(spy).toHaveBeenCalled();
    await expect(canvas.getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '#settings',
    );
  },
};

export const Current: Story = {
  render: () => nav,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Projects' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(canvas.getByRole('button', { name: 'Reports' })).toBeDisabled();
    const help = canvas.getByText('Help').closest('[aria-disabled]')!;
    await expect(help).toHaveAttribute('aria-disabled', 'true');
    await expect(help.tagName).not.toBe('A');
    await expect(
      canvas.getByRole('button', { name: 'Projects' }).getBoundingClientRect().height,
    ).toBeGreaterThanOrEqual(44);
  },
};

export const Dark: Story = { ...Current, globals: { theme: 'dark' } };
