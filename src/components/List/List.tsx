import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export type ListProps = HTMLAttributes<HTMLDivElement>;

/** Bordered container for ListRow / ListSectionHeader children. */
export function List({ className, ...rest }: ListProps) {
  return (
    <div
      role="list"
      {...rest}
      className={cn(
        'overflow-hidden rounded-(--pu-radius-container) border border-line bg-surface text-ink',
        '[&>*+*]:border-t [&>*+*]:border-line',
        className,
      )}
    />
  );
}
