import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Field } from './Field';

const meta = {
  title: 'Components/Inputs/Field',
  component: Field,
  tags: ['autodocs'],
  args: { label: 'Category', children: () => null },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

const render: Story['render'] = (args) => (
  <Field {...args}>
    {({ id, describedBy, invalid }) => (
      <input
        id={id}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        className="h-(--pu-ctl-h) rounded-(--pu-ctl-r) border border-line-strong bg-surface px-(--pu-ctl-px)"
      />
    )}
  </Field>
);

export const Default: Story = {
  render,
  args: { label: 'Category', hint: 'Pick something like Groceries' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Category');
    const hint = canvas.getByText('Pick something like Groceries');
    await expect(input).toHaveAttribute('aria-describedby', hint.id);
    await expect(input).not.toHaveAttribute('aria-invalid');
  },
};

export const States: Story = {
  render,
  args: { label: 'Category', hint: 'Pick something', error: 'Category is required', required: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/Category/);
    const hint = canvas.getByText('Pick something');
    const error = canvas.getByText('Category is required');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input.getAttribute('aria-describedby')).toBe(`${hint.id} ${error.id}`);
  },
};

export const Dark: Story = { ...States, globals: { theme: 'dark' } };
