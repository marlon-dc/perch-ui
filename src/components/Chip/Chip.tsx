import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { resolveSize, type Responsive, type Size } from '../../lib/size';

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: Responsive<Size>;
  pressed?: boolean;
  icon?: ReactNode;
};

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { size, pressed, icon, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={pressed}
      className={cn(
        'hit-area inline-flex h-(--pu-ctl-h) cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap',
        'rounded-full border border-line-strong bg-surface px-(--pu-ctl-px) font-ui text-(length:--pu-ctl-fs) font-medium text-ink',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        pressed && 'border-ink bg-ink text-bg',
        pressed &&
          'forced-colors:border-[Highlight] forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-colors:[forced-color-adjust:none]',
        resolveSize(size),
        className,
      )}
      {...rest}
    >
      {icon ? (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
});
