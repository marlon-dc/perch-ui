import { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { resolveSize } from '../../lib/size';
import { boxSize, type CheckboxProps } from '../Checkbox/Checkbox';

export type SwitchProps = CheckboxProps;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, size, className, ...rest },
  ref,
) {
  return (
    <label
      className={cn(
        'hit-area inline-flex min-h-(--pu-ctl-h) cursor-pointer items-center gap-2 font-ui text-ink',
        'text-(length:--pu-ctl-fs) has-disabled:cursor-not-allowed has-disabled:opacity-50',
        resolveSize(size),
        boxSize(size),
        className,
      )}
    >
      <span className="relative inline-flex shrink-0">
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          className={cn(
            'peer h-(--pu-box) w-[calc(var(--pu-box)*2)] shrink-0 appearance-none rounded-full border',
            'border-line-strong bg-surface-2 checked:border-accent checked:bg-accent cursor-[inherit]',
            'forced-colors:border-[CanvasText] forced-colors:checked:bg-[Highlight] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          )}
          {...rest}
        />
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute top-1/2 left-[3px] size-[calc(var(--pu-box)-8px)] -translate-y-1/2',
            // Off: muted thumb on the surface-2 track (surface would be ~1.1:1). On: surface on accent.
            'rounded-full bg-muted shadow-soft forced-colors:bg-[CanvasText] motion-safe:transition-transform',
            'peer-checked:translate-x-[calc(var(--pu-box)+2px)] peer-checked:bg-surface',
          )}
        />
      </span>
      <span>{label}</span>
    </label>
  );
});
