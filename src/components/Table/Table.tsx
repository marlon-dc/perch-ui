import {
  createContext,
  useContext,
  type ComponentPropsWithRef,
  type ReactNode,
  type Ref,
} from 'react';
import { cn } from '../../lib/cn';
import { CheckIcon } from '../Icon';

type Variant = 'default' | 'group' | 'summary' | 'total';
type Tint = 'earn' | 'ded' | 'inflow' | 'exp';

const TINT_BG: Record<Tint, string> = {
  earn: 'bg-tint-earn',
  ded: 'bg-tint-ded',
  inflow: 'bg-tint-inflow',
  exp: 'bg-tint-exp',
};

/** Opaque row background; sticky cells reuse it so scrolled cells never show through. */
function rowBg(variant: Variant, tint?: Tint): string {
  if (tint) return TINT_BG[tint];
  return variant === 'default' ? 'bg-surface' : 'bg-surface-2';
}

const RowContext = createContext<string>('bg-surface');

export type TableContainerProps = {
  'aria-label': string;
  children: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
};

/** Scrollable region: focusable so keyboard users can scroll it. */
export function TableContainer({
  'aria-label': ariaLabel,
  children,
  className,
  ref,
}: TableContainerProps) {
  return (
    // tabIndex is required (axe scrollable-region-focusable): keyboard users must be able to scroll.
    <div
      ref={ref}
      role="region"
      aria-label={ariaLabel}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      className={cn(
        'overflow-x-auto rounded-(--pu-radius-container) border border-line bg-surface',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Table({ className, ...rest }: ComponentPropsWithRef<'table'>) {
  return (
    <table
      {...rest}
      className={cn('w-full border-separate border-spacing-0 text-sm text-ink', className)}
    />
  );
}

export function TableHead(props: ComponentPropsWithRef<'thead'>) {
  return <thead {...props} />;
}

export function TableBody(props: ComponentPropsWithRef<'tbody'>) {
  return <tbody {...props} />;
}

export type TableRowProps = ComponentPropsWithRef<'tr'> & {
  variant?: Variant;
  tint?: Tint;
};

export function TableRow({ variant = 'default', tint, className, ...rest }: TableRowProps) {
  const bg = rowBg(variant, tint);
  return (
    <RowContext.Provider value={bg}>
      <tr
        {...rest}
        className={cn(
          bg,
          variant === 'group' && 'font-semibold',
          variant === 'summary' && 'font-semibold',
          variant === 'total' && 'font-bold',
          className,
        )}
      />
    </RowContext.Provider>
  );
}

const STICKY = 'sticky left-0 z-1 border-r border-r-line';
const BORDER_B = 'border-b border-b-line';

export type TableHeaderCellProps = ComponentPropsWithRef<'th'> & {
  sticky?: boolean;
};

export function TableHeaderCell({ sticky, scope, className, ...rest }: TableHeaderCellProps) {
  const bg = useContext(RowContext);
  return (
    <th
      scope={scope}
      {...rest}
      className={cn(
        'px-3 py-2 text-left text-xs font-semibold whitespace-nowrap text-muted',
        BORDER_B,
        bg,
        sticky && STICKY,
        scope === 'row' && 'text-sm text-ink',
        className,
      )}
    />
  );
}

export type TableCellProps = ComponentPropsWithRef<'td'> & {
  sticky?: boolean;
  numeric?: boolean;
  tone?: 'done' | 'partial';
  /** Visually hidden text added to `done` cells; with the visible check icon the state is not colour-only. */
  doneLabel?: string;
  /** Visually hidden text added to `partial` cells so the state is not colour/bar-only. */
  partialLabel?: string;
};

export function TableCell({
  sticky,
  numeric,
  tone,
  doneLabel = 'Paid',
  partialLabel = 'Partly paid',
  className,
  children,
  ...rest
}: TableCellProps) {
  const bg = useContext(RowContext);
  return (
    <td
      {...rest}
      className={cn(
        // Same 3px left border on every cell: `partial` shows an accent bar without layout shift.
        // Forced colors turns `transparent` into CanvasText, so the idle border is set to Canvas there.
        'border-l-[3px] border-l-transparent forced-colors:border-l-[Canvas] px-3 py-2 whitespace-nowrap',
        BORDER_B,
        bg,
        sticky && STICKY,
        numeric && 'font-num text-right tabular-nums',
        tone === 'done' &&
          'bg-done-bg text-done-ink forced-colors:border-b-[3px] forced-colors:border-b-[Highlight]',
        tone === 'partial' && 'border-l-accent forced-colors:border-l-[Highlight]',
        className,
      )}
    >
      {tone === 'done' ? (
        // Visible, non-colour cue for sighted users; the sr-only label below carries it for AT.
        <CheckIcon data-slot="done-icon" size={12} className="mr-1 inline-block align-[-1px]" />
      ) : null}
      {children}
      {tone === 'done' && doneLabel ? <span className="sr-only"> ({doneLabel})</span> : null}
      {tone === 'partial' && partialLabel ? (
        <span className="sr-only"> ({partialLabel})</span>
      ) : null}
    </td>
  );
}

export type TableCellButtonProps = ComponentPropsWithRef<'button'> & {
  /**
   * Action text appended (visually hidden) to the visible content to form the accessible name,
   * e.g. "edit Rent, Week 2" gives "12,000.00, edit Rent, Week 2". Keeps the visible text in the name (WCAG 2.5.3).
   */
  actionLabel?: string;
};

export function TableCellButton({
  className,
  type = 'button',
  actionLabel,
  children,
  ...rest
}: TableCellButtonProps) {
  return (
    <button
      type={type}
      {...rest}
      className={cn(
        'hit-area -mx-3 -my-2 block w-[calc(100%+1.5rem)] cursor-pointer px-3 py-2 text-right',
        'hover:outline-2 hover:-outline-offset-2 hover:outline-accent',
        'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent',
        className,
      )}
    >
      {children}
      {actionLabel ? <span className="sr-only">, {actionLabel}</span> : null}
    </button>
  );
}
