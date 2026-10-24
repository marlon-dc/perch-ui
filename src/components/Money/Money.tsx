import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { formatMoney, roundCents } from './formatMoney';

export type MoneySize = 'xs' | 's' | 'm' | 'l' | 'xl';

export interface MoneyProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  amount: number;
  symbol?: boolean;
  /** Tint positive amounts green and negative amounts red. */
  colored?: boolean;
  currency?: string;
  locale?: string;
  size?: MoneySize;
}

const sizeClass: Record<MoneySize, string> = {
  xs: 'text-[12px]',
  s: 'text-[13px]',
  m: 'text-[14px]',
  l: 'text-[16px]',
  xl: 'text-[22px]',
};

export function Money({
  amount,
  symbol,
  colored,
  currency,
  locale,
  size = 'm',
  className,
  ...rest
}: MoneyProps) {
  const text = formatMoney(amount, { symbol, currency, locale });
  const rounded = roundCents(amount);
  return (
    <span
      {...rest}
      className={cn(
        'font-num tabular-nums',
        sizeClass[size],
        colored &&
          Number.isFinite(amount) &&
          rounded !== 0 &&
          (rounded > 0 ? 'text-positive' : 'text-negative'),
        className,
      )}
    >
      {text}
    </span>
  );
}
