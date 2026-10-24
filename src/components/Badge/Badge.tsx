import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'accent' | 'warning' | 'positive' | 'negative';
}

const TONES = {
  neutral: 'border-transparent bg-surface-2 text-ink',
  accent: 'border-transparent bg-accent text-accent-ink',
  warning: 'border-transparent bg-warn-bg text-warn-ink',
  positive: 'border-transparent bg-done-bg text-done-ink',
  negative: 'border-line-strong bg-surface-2 text-negative',
} as const;

export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return (
    <span
      {...rest}
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[12px] leading-4 font-semibold whitespace-nowrap forced-colors:border-[CanvasText]',
        TONES[tone],
        className,
      )}
    />
  );
}
