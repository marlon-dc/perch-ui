import type { Ref } from 'react';
import { cn } from '../../lib/cn';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label: string;
  size?: 's' | 'm';
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  size = 'm',
  className,
  ref,
}: ProgressBarProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const now = Number.isFinite(value) ? Math.min(Math.max(value, 0), safeMax) : 0;
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={now}
      className={cn(
        'box-content w-full overflow-hidden rounded-full border border-line-strong bg-surface-2 forced-colors:border-[CanvasText]',
        size === 's' ? 'h-1.5' : 'h-2',
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-accent forced-colors:bg-[Highlight]"
        style={{ width: `${(now / safeMax) * 100}%` }}
      />
    </div>
  );
}
