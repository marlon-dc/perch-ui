import { cn } from '../../lib/cn';
import type { Breakpoint, Responsive, Size } from '../../lib/size';
import { CheckIcon } from '../Icon';

// Ring edge per size. Written out literally for Tailwind's scanner.
const RING: Record<Breakpoint, Record<Size, string>> = {
  base: { s: 'size-[18px]', m: 'size-[22px]', l: 'size-[26px]' },
  m: { s: 'm:size-[18px]', m: 'm:size-[22px]', l: 'm:size-[26px]' },
  l: { s: 'l:size-[18px]', m: 'l:size-[22px]', l: 'l:size-[26px]' },
};

function ringSize(size: Responsive<Size> | undefined): string {
  const map: Partial<Record<Breakpoint, Size>> =
    size === undefined ? {} : typeof size === 'string' ? { base: size } : size;
  const out: string[] = [];
  for (const bp of ['base', 'm', 'l'] as const) {
    const v = map[bp] ?? (bp === 'base' ? 'm' : undefined);
    if (v) out.push(RING[bp][v]);
  }
  return out.join(' ');
}

export type ConfirmToggleProps = {
  pressed: boolean;
  onPressedChange: (next: boolean) => void;
  label: string;
  size?: Responsive<Size>;
};

export function ConfirmToggle({ pressed, onPressedChange, label, size }: ConfirmToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        'hit-area inline-flex shrink-0 items-center justify-center rounded-full border-[1.6px] transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        ringSize(size),
        pressed
          ? 'border-done-ink bg-done-ink forced-colors:border-[Highlight] forced-colors:bg-[Highlight]'
          : 'border-muted bg-transparent forced-colors:border-[CanvasText]',
      )}
    >
      <CheckIcon
        className={cn(
          'size-[65%]',
          pressed ? 'text-done-bg opacity-100 forced-colors:text-[HighlightText]' : 'opacity-0',
        )}
      />
    </button>
  );
}
