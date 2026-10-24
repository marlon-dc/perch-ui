import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Card } from '../../components/Card';
import { Heading, Text } from '../../components/Text';
import { KeyValue } from '../../components/KeyValue';
import { Money } from '../../components/Money';
import { ProgressBar } from '../../components/ProgressBar';
import { Toggletip } from '../../components/Toggletip';

function MonthSummary() {
  return (
    <Card as="section" aria-labelledby="month-summary-title" className="mx-auto max-w-md">
      <div className="flex flex-col gap-4">
        <div>
          <Text variant="eyebrow">March</Text>
          <Heading level={3} id="month-summary-title">
            Month summary
          </Heading>
        </div>
        <KeyValue
          items={[
            {
              label: (
                <span className="inline-flex items-center gap-1">
                  Actual
                  <Toggletip label="What does Actual mean?">
                    What has really been paid so far this month.
                  </Toggletip>
                </span>
              ),
              value: <Money amount={18500} symbol />,
            },
            {
              label: (
                <span className="inline-flex items-center gap-1">
                  Forecast
                  <Toggletip label="What does Forecast mean?">
                    Actual plus everything still planned before the month ends.
                  </Toggletip>
                </span>
              ),
              value: <Money amount={24000} symbol />,
            },
            {
              label: 'Left to spend',
              value: <Money amount={6000} symbol colored />,
              emphasis: 'total',
            },
          ]}
        />
        <ProgressBar label="Spent against forecast" value={18500} max={24000} />
      </div>
    </Card>
  );
}

const meta = {
  title: 'Patterns/MonthSummary',
  component: MonthSummary,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A Card with a KeyValue grid whose labels are explained by Toggletips, plus a ProgressBar. Sample data is made up.',
      },
    },
  },
} satisfies Meta<typeof MonthSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('region', { name: 'Month summary' })).toBeVisible();
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '18500');
    await userEvent.click(canvas.getByRole('button', { name: 'What does Forecast mean?' }));
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() =>
      expect(body.getByText(/Actual plus everything still planned/)).toBeVisible(),
    );
  },
};

export const Dark: Story = { ...Default, globals: { theme: 'dark' } };
