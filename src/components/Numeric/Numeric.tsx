import type { ComponentPropsWithRef } from 'react';
import { cn } from '../../lib/cn';
import { formatNumber, roundHalfAway, type NumberFormat } from './formatNumber';

export type NumericSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export interface NumericProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  value: number;
  format?: NumberFormat;
  currency?: string;
  locale?: string;
  fractionDigits?: number;
  /** Tint positive values with `positive` and negative values with `negative`. */
  colored?: boolean;
  size?: NumericSize;
}

const sizeClass: Record<NumericSize, string> = {
  xs: 'text-[12px]',
  s: 'text-[13px]',
  m: 'text-[14px]',
  l: 'text-[16px]',
  xl: 'text-[22px]',
};

export function Numeric({
  value,
  format = 'decimal',
  currency,
  locale,
  fractionDigits,
  colored,
  size = 'm',
  className,
  ...rest
}: NumericProps) {
  const text = formatNumber(value, { format, currency, locale, fractionDigits });
  const digits = fractionDigits ?? (format === 'percent' ? 0 : 2);
  const rounded = roundHalfAway(format === 'percent' ? value * 100 : value, digits);
  return (
    <span
      {...rest}
      className={cn(
        'font-num tabular-nums',
        sizeClass[size],
        colored &&
          Number.isFinite(value) &&
          rounded !== 0 &&
          (rounded > 0 ? 'text-positive' : 'text-negative'),
        className,
      )}
    >
      {text}
    </span>
  );
}
