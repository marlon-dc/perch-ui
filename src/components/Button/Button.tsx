import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { resolveSize, type Responsive, type Size } from '../../lib/size';

export const buttonStyles = cva(
  [
    // hit-area sets position: relative; a consumer's `fixed`/`absolute` class is emitted later and wins.
    'hit-area inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap select-none',
    'h-(--pu-ctl-h) px-(--pu-ctl-px) text-(length:--pu-ctl-fs) rounded-(--pu-ctl-r)',
    'font-ui font-semibold border transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'aria-disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-accent text-accent-ink border-transparent hover:opacity-90',
        secondary: 'bg-surface border-line-strong text-ink hover:bg-surface-2',
        ghost: 'bg-transparent border-transparent text-ink hover:bg-surface-2',
        danger: 'bg-surface text-negative border-line-strong hover:bg-surface-2',
      },
      fullWidth: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'secondary', fullWidth: false },
  },
);

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children?: ReactNode;
  size?: Responsive<Size>;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  confirm?: { label: string; timeoutMs?: number };
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    size,
    variant = 'secondary',
    icon,
    fullWidth = false,
    loading = false,
    confirm,
    className,
    children,
    onClick,
    onBlur,
    type = 'button',
    ...rest
  },
  ref,
) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const timeoutMs = confirm?.timeoutMs ?? 3000;

  const clearTimer = useCallback(() => {
    if (timer.current !== undefined) {
      clearTimeout(timer.current);
      timer.current = undefined;
    }
  }, []);

  useEffect(() => {
    if (!armed) return;
    timer.current = setTimeout(() => setArmed(false), timeoutMs);
    return clearTimer;
  }, [armed, timeoutMs, clearTimer]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    if (confirm && !armed) {
      event.preventDefault();
      setArmed(true);
      return;
    }
    setArmed(false);
    onClick?.(event);
  };

  const isArmed = armed && !!confirm;

  return (
    <>
      <button
        ref={ref}
        type={type}
        className={cn(
          resolveSize(size),
          buttonStyles({ variant, fullWidth }),
          isArmed && 'bg-negative text-surface border-transparent hover:bg-negative',
          className,
        )}
        data-armed={isArmed ? '' : undefined}
        aria-busy={loading ? 'true' : undefined}
        aria-disabled={loading ? 'true' : undefined}
        onClick={handleClick}
        onBlur={(event) => {
          setArmed(false);
          onBlur?.(event);
        }}
        {...rest}
      >
        {loading ? (
          <span
            aria-hidden="true"
            className="size-[1em] shrink-0 rounded-full border-2 border-current border-t-transparent motion-safe:animate-spin"
          />
        ) : icon ? (
          <span aria-hidden="true" className="inline-flex shrink-0">
            {icon}
          </span>
        ) : null}
        {isArmed ? confirm.label : children}
      </button>
      {confirm ? (
        <span role="status" className="sr-only">
          {isArmed ? confirm.label : ''}
        </span>
      ) : null}
    </>
  );
});
