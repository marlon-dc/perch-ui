import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface KeyValueItem {
  label: ReactNode;
  value: ReactNode;
  note?: ReactNode;
  emphasis?: 'total';
}

export interface KeyValueProps extends Omit<ComponentPropsWithRef<'dl'>, 'children'> {
  items: KeyValueItem[];
}

export function KeyValue({ items, className, ...rest }: KeyValueProps) {
  return (
    <dl {...rest} className={cn('m-0 flex flex-col', className)}>
      {items.map((item, i) => {
        const total = item.emphasis === 'total';
        return (
          <div
            key={i}
            className={cn(
              'flex items-baseline justify-between gap-4 py-2',
              total && 'mt-1 border-t border-line-strong pt-3',
            )}
          >
            <dt
              className={cn(
                'min-w-0 [overflow-wrap:anywhere]',
                total ? 'font-bold text-ink' : 'text-[14px] text-muted',
              )}
            >
              {item.label}
              {item.note ? (
                <span className="block text-[12px] font-normal text-muted">{item.note}</span>
              ) : null}
            </dt>
            <dd
              className={cn(
                'm-0 shrink-0 text-right font-num tabular-nums whitespace-nowrap',
                total ? 'text-[22px] font-bold text-ink' : 'text-[14px] font-semibold text-ink',
              )}
            >
              {item.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
