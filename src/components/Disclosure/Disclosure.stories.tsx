import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Money } from '../Money';
import { Disclosure } from './Disclosure';

const meta = {
  title: 'Components/Display/Disclosure',
  component: Disclosure,
  tags: ['autodocs'],
  args: { title: 'Fixed bills', children: null },
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

const body = <p>Rent, Electricity and Streaming are paid from this group.</p>;

export const Default: Story = {
  args: {
    meta: '3 items',
    trailing: <Money amount={14950} symbol />,
    children: body,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 2, name: /Fixed bills/ })).toBeVisible();
    await expect(canvas.getByRole('button', { name: /Fixed bills/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  },
};

export const Toggle: Story = {
  args: { children: body },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /Fixed bills/ });
    await expect(canvas.getByText(/paid from this group/)).toBeVisible();
    await expect(button).toHaveAttribute('aria-controls');
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText(/paid from this group/)).not.toBeVisible();
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText(/paid from this group/)).toBeVisible();
    const region = document.getElementById(button.getAttribute('aria-controls')!);
    await expect(region).toContainElement(canvas.getByText(/paid from this group/));
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Disclosure title="Open by default">{body}</Disclosure>
      <Disclosure title="Closed by default" defaultOpen={false}>
        {body}
      </Disclosure>
      <Disclosure title="Third-level heading" headingLevel={3}>
        {body}
      </Disclosure>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Closed by default' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(
      canvas.getByRole('heading', { level: 3, name: 'Third-level heading' }),
    ).toBeVisible();
  },
};

export const Dark: Story = { ...Default, globals: { theme: 'dark' } };
