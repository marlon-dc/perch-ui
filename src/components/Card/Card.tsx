import type { ComponentPropsWithRef } from 'react';
import { cn } from '../../lib/cn';

export interface CardProps extends ComponentPropsWithRef<'div'> {
  as?: 'div' | 'section' | 'article';
  /** Inner padding: none, s (12px) or m (16px). */
  padding?: 'none' | 's' | 'm';
}

const PAD = { none: 'p-0', s: 'p-3', m: 'p-4' } as const;

export function Card({ as: Tag = 'div', padding = 'm', className, ...rest }: CardProps) {
  return (
    <Tag
      {...rest}
      className={cn(
        'rounded-(--pu-radius-container) border border-line bg-surface text-ink shadow-soft',
        PAD[padding],
        className,
      )}
    />
  );
}
