import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
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
  return (
    <div className={resolveSize(size)}>
      <Field label={label} hint={hint} error={error} required={required}>
        {({ id, describedBy, invalid }) => (
          <div
            className={cn(
              'flex h-(--pu-ctl-h) items-center gap-2 rounded-(--pu-ctl-r) border bg-surface px-(--pu-ctl-px)',
              invalid ? 'border-negative' : 'border-line-strong',
              'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent',
              'has-disabled:cursor-not-allowed has-disabled:opacity-50',
            )}
          >
            {prefix ? (
              <span
                aria-hidden="true"
                className={cn('shrink-0 text-muted ctl-text-input', numeric && 'font-num')}
              >
                {prefix}
              </span>
            ) : null}
            <input
              ref={ref}
              required={required}
              inputMode={numeric ? 'decimal' : undefined}
              {...rest}
              id={id}
              aria-invalid={invalid ? 'true' : undefined}
              aria-describedby={describedBy}
              className={cn(
                // -my-px lets the input span the wrapper's full border box, so its height is exactly --pu-ctl-h.
                'ctl-text-input -my-px h-(--pu-ctl-h) min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 font-ui text-ink outline-none placeholder:text-muted disabled:cursor-not-allowed',
                numeric && 'font-num tabular-nums text-right',
                className,
              )}
            />
          </div>
        )}
      </Field>
    </div>
  );
});
