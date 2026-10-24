import type { ReactNode } from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '../../lib/cn';
import { resolveSize, type Responsive, type Size } from '../../lib/size';

export type SegmentedControlOption = { value: string; label: ReactNode };

export type SegmentedControlProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: SegmentedControlOption[];
  size?: Responsive<Size>;
  'aria-label': string;
  fullWidth?: boolean;
  className?: string;
};

/**
 * Tablist semantics without panels. Radix emits `aria-controls` on each trigger pointing at a
 * TabsContent id; with no panels that is a dangling idref (axe aria-valid-attr-value), so it is
 * stripped here (Ruling R5). tablist/tab/aria-selected remain.
 */
export function SegmentedControl({
  value,
  onValueChange,
  options,
  size,
  'aria-label': ariaLabel,
  fullWidth,
  className,
}: SegmentedControlProps) {
  return (
    <RadixTabs.Root
      value={value}
      onValueChange={onValueChange}
      className={cn(fullWidth ? 'block w-full' : 'inline-block', resolveSize(size), className)}
    >
      <RadixTabs.List
        aria-label={ariaLabel}
        className={cn(
          'box-border flex h-(--pu-ctl-h) items-center gap-[2px] rounded-(--pu-ctl-r) border border-line-strong',
          'bg-surface-2 p-[3px] font-ui',
          fullWidth ? 'w-full' : 'inline-flex',
        )}
      >
        {options.map((o) => (
          <RadixTabs.Trigger
            key={o.value}
            value={o.value}
            aria-controls={undefined}
            className={cn(
              'hit-area inline-flex h-[calc(var(--pu-ctl-h)-8px)] cursor-pointer items-center justify-center whitespace-nowrap',
              // Every segment has a 1px border (border-box, so heights are unchanged): transparent when idle,
              // line-strong (>=3:1) when selected, so the selection is not a fill-only cue.
              'border border-transparent forced-colors:border-[Canvas]',
              'rounded-[calc(var(--pu-ctl-r)-3px)] px-(--pu-ctl-px) text-(length:--pu-ctl-fs) font-medium text-muted',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              'data-[state=active]:border-line-strong data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-soft',
              'forced-colors:data-[state=active]:bg-[Highlight] forced-colors:data-[state=active]:text-[HighlightText]',
              'forced-colors:data-[state=active]:[forced-color-adjust:none]',
              fullWidth && 'flex-1',
            )}
          >
            {o.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
    </RadixTabs.Root>
  );
}
