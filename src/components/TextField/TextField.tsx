import { forwardRef, useLayoutEffect, useRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { resolveSize, type Responsive, type Size } from '../../lib/size';
import { Field } from '../Field';

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> & {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  size?: Responsive<Size>;
  numeric?: boolean;
  prefix?: ReactNode;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, size, numeric = false, prefix, className, required, ...rest },
  ref,
) {
  const prefixRef = useRef<HTMLSpanElement>(null);
  const [prefixWidth, setPrefixWidth] = useState(0);
  useLayoutEffect(() => {
    setPrefixWidth(prefixRef.current?.getBoundingClientRect().width ?? 0);
  }, [prefix, size, numeric]);

  return (
    <div className={resolveSize(size)}>
      <Field label={label} hint={hint} error={error} required={required}>
        {({ id, describedBy, invalid }) => (
          <div className="relative flex items-center">
            {prefix ? (
              <span
                ref={prefixRef}
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute start-(--pu-ctl-px) text-muted ctl-text-input',
                  numeric && 'font-num',
                )}
              >
                {prefix}
              </span>
            ) : null}
            <input
              ref={ref}
              id={id}
              required={required}
              aria-invalid={invalid ? 'true' : undefined}
              aria-describedby={describedBy}
              inputMode={numeric ? 'decimal' : rest.inputMode}
              style={
                prefix
                  ? { paddingInlineStart: `calc(var(--pu-ctl-px) + ${prefixWidth}px + 0.5rem)` }
                  : undefined
              }
              className={cn(
                'ctl-text-input h-(--pu-ctl-h) w-full min-w-0 rounded-(--pu-ctl-r) border bg-surface px-(--pu-ctl-px) font-ui text-ink placeholder:text-muted',
                invalid ? 'border-negative' : 'border-line-strong',
                'focus:outline-2 focus:outline-offset-2 focus:outline-accent',
                'disabled:cursor-not-allowed disabled:opacity-50',
                numeric && 'font-num tabular-nums text-right',
                className,
              )}
              {...rest}
            />
          </div>
        )}
      </Field>
    </div>
  );
});
