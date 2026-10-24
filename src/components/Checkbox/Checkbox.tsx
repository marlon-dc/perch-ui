import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { resolveSize, type Breakpoint, type Responsive, type Size } from '../../lib/size';
import { CheckIcon } from '../Icon';

// Box edge per size (component-specific, not a density var). Written out literally for Tailwind's scanner.
const BOX: Record<Breakpoint, Record<Size, string>> = {
  base: { s: '[--pu-box:16px]', m: '[--pu-box:18px]', l: '[--pu-box:20px]' },
  m: { s: 'm:[--pu-box:16px]', m: 'm:[--pu-box:18px]', l: 'm:[--pu-box:20px]' },
  l: { s: 'l:[--pu-box:16px]', m: 'l:[--pu-box:18px]', l: 'l:[--pu-box:20px]' },
};

/** Box-edge classes (sets `--pu-box`) for a responsive size. Shared with Switch. */
export function boxSize(size: Responsive<Size> | undefined, fallback: Size = 'm'): string {
  const map: Partial<Record<Breakpoint, Size>> =
    size === undefined ? {} : typeof size === 'string' ? { base: size } : size;
  const out: string[] = [];
  for (const bp of ['base', 'm', 'l'] as const) {
    const v = map[bp] ?? (bp === 'base' ? fallback : undefined);
    if (v) out.push(BOX[bp][v]);
  }
  return out.join(' ');
}

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  label: ReactNode;
  size?: Responsive<Size>;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, size, className, ...rest },
  ref,
) {
  return (
    <label
      className={cn(
        'inline-flex min-h-(--pu-ctl-h) cursor-pointer items-center gap-2 font-ui text-ink',
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
          className={cn(
            'peer size-(--pu-box) shrink-0 appearance-none rounded-[4px] border border-line-strong bg-surface',
            'checked:border-accent checked:bg-accent cursor-[inherit] transition-colors',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          )}
          {...rest}
        />
        <CheckIcon
          className="pointer-events-none absolute inset-0 m-auto size-[70%] text-accent-ink opacity-0 peer-checked:opacity-100"
        />
      </span>
      <span>{label}</span>
    </label>
  );
});
