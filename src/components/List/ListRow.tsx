import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { resolveSize } from '../../lib/size';
import { CheckIcon } from '../Icon';
import type { Responsive, Size } from '../../lib/size';

export type ListRowProps = {
  size?: Responsive<Size>;
  title: ReactNode;
  subtitle?: ReactNode;
  value?: ReactNode;
  valueSubtitle?: ReactNode;
  /**
   * Done state. Not colour-only: a visible check icon is shown at the end of the row, a visually
   * hidden `doneLabel` is added to the row's text, and in forced-colors mode a Highlight left
   * border replaces the tint. When a `trailing` element is given (typically a pressed
   * ConfirmToggle), the row's own check is omitted and the trailing control carries the visible cue.
   */
  done?: boolean;
  /** Visually hidden text announced when `done`. Defaults to "Done". */
  doneLabel?: string;
  onSelect?: () => void;
  /**
   * Accessible name of the select button. Must contain the row's visible text (WCAG 2.5.3 Label in
   * Name), e.g. "Edit Rent" for a row whose visible text is "Rent". When the row also shows a
   * value or subtitle, omit it and let the name come from the content.
   * When `done`, " (Done)" (the `doneLabel`) is appended so the state survives the override.
   * Without `selectLabel` the name comes from the row content.
   */
  selectLabel?: string;
  trailing?: ReactNode;
};

export function ListRow({
  size,
  title,
  subtitle,
  value,
  valueSubtitle,
  done,
  doneLabel = 'Done',
  onSelect,
  selectLabel,
  trailing,
}: ListRowProps) {
  const inkClass = done ? 'text-done-ink' : 'text-ink';
  const mutedClass = done ? 'text-done-ink' : 'text-muted';
  const content = (
    <>
      <span className="flex min-w-0 flex-1 flex-col">
        <span
          className={cn('text-(length:--pu-ctl-fs) font-medium [overflow-wrap:anywhere]', inkClass)}
        >
          {title}
          {done && doneLabel ? <span className="sr-only"> ({doneLabel})</span> : null}
        </span>
        {subtitle ? <span className={cn('text-xs', mutedClass)}>{subtitle}</span> : null}
      </span>
      {value !== undefined || valueSubtitle ? (
        <span data-slot="value" className="flex shrink-0 flex-col items-end whitespace-nowrap">
          {value !== undefined ? (
            <span
              className={cn(
                'font-num text-(length:--pu-ctl-fs) font-semibold tabular-nums',
                inkClass,
              )}
            >
              {value}
            </span>
          ) : null}
          {valueSubtitle ? (
            <span className={cn('font-num text-xs tabular-nums', mutedClass)}>{valueSubtitle}</span>
          ) : null}
        </span>
      ) : null}
      {done && !trailing ? (
        <CheckIcon data-slot="done-icon" className={cn('shrink-0', inkClass)} />
      ) : null}
    </>
  );
  const body = 'flex min-w-0 flex-1 items-center gap-3 px-4 py-2 text-left';
  return (
    <div
      role="listitem"
      className={cn(
        resolveSize(size),
        // Every row has the same 4px left border so the forced-colors done cue causes no layout shift.
        'flex min-h-(--pu-row-h) items-stretch border-l-4 border-l-transparent forced-colors:border-l-[Canvas]',
        done
          ? 'bg-done-bg text-done-ink forced-colors:border-l-[Highlight]'
          : 'bg-surface text-ink',
      )}
    >
      {onSelect ? (
        <button
          type="button"
          aria-label={
            selectLabel && done && doneLabel ? `${selectLabel} (${doneLabel})` : selectLabel
          }
          onClick={onSelect}
          className={cn(
            body,
            'cursor-pointer self-stretch',
            'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
          )}
        >
          {content}
        </button>
      ) : (
        <div className={body}>{content}</div>
      )}
      {trailing ? <div className="flex shrink-0 items-center pr-4">{trailing}</div> : null}
    </div>
  );
}
