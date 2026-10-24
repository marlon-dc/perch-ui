import type { HTMLAttributes, Ref } from 'react';
import { cn } from '../../lib/cn';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div' | 'label';
  size?: 'xs' | 's' | 'm' | 'l';
  tone?: 'ink' | 'muted' | 'positive' | 'negative';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  variant?: 'body' | 'eyebrow';
  htmlFor?: string;
  ref?: Ref<HTMLElement>;
}

const sizes = { xs: 'text-[12px]', s: 'text-[13px]', m: 'text-[14px]', l: 'text-[16px]' };
const tones = {
  ink: 'text-ink',
  muted: 'text-muted',
  positive: 'text-positive',
  negative: 'text-negative',
};
const weights = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export function Text({
  as: Tag = 'p',
  size = 'm',
  tone = 'ink',
  weight = 'regular',
  variant = 'body',
  className,
  ref,
  ...rest
}: TextProps) {
  return (
    <Tag
      {...rest}
      // Tag is a union of elements; every one of them is an HTMLElement.
      ref={ref as Ref<HTMLParagraphElement & HTMLSpanElement & HTMLDivElement & HTMLLabelElement>}
      className={cn(
        variant === 'eyebrow'
          ? 'text-[11px] font-semibold uppercase tracking-[0.06em] text-muted'
          : [sizes[size], tones[tone], weights[weight]],
        className,
      )}
    />
  );
}
