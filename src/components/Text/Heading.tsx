import type { ComponentPropsWithRef } from 'react';
import { cn } from '../../lib/cn';

export interface HeadingProps extends ComponentPropsWithRef<'h1'> {
  level: 1 | 2 | 3 | 4;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const sizes = { 1: 'text-[28px]', 2: 'text-[22px]', 3: 'text-[18px]', 4: 'text-[15px]' };

export function Heading({ level, as, className, ...rest }: HeadingProps) {
  const Tag = as ?? (`h${level}` as 'h1' | 'h2' | 'h3' | 'h4');
  return (
    <Tag
      {...rest}
      className={cn('font-bold leading-[1.2] tracking-[-0.01em] text-ink', sizes[level], className)}
    />
  );
}
