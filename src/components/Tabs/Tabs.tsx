import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '../../lib/cn';
import { resolveSize, type Responsive, type Size } from '../../lib/size';

export type TabsProps = ComponentPropsWithoutRef<typeof RadixTabs.Root>;
export const Tabs = RadixTabs.Root;

export type TabsListProps = ComponentPropsWithoutRef<typeof RadixTabs.List> & {
  size?: Responsive<Size>;
};

export const TabsList = forwardRef<ElementRef<typeof RadixTabs.List>, TabsListProps>(function TabsList(
  { size, className, ...rest },
  ref,
) {
  return (
    <RadixTabs.List
      ref={ref}
      className={cn('flex gap-1 border-b border-line font-ui', resolveSize(size), className)}
      {...rest}
    />
  );
});

export type TabsTriggerProps = ComponentPropsWithoutRef<typeof RadixTabs.Trigger>;

/** Active indicator is a 2px bottom border (survives forced-colors, unlike a box-shadow). */
export const TabsTrigger = forwardRef<ElementRef<typeof RadixTabs.Trigger>, TabsTriggerProps>(
  function TabsTrigger({ className, ...rest }, ref) {
    return (
      <RadixTabs.Trigger
        ref={ref}
        className={cn(
          'box-border -mb-px inline-flex h-(--pu-ctl-h) cursor-pointer items-center whitespace-nowrap border-b-2 border-transparent',
          'px-(--pu-ctl-px) text-(length:--pu-ctl-fs) font-medium text-muted',
          'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=active]:border-accent data-[state=active]:text-ink',
          'forced-colors:data-[state=active]:border-[Highlight]',
          className,
        )}
        {...rest}
      />
    );
  },
);

export type TabsContentProps = ComponentPropsWithoutRef<typeof RadixTabs.Content>;

export const TabsContent = forwardRef<ElementRef<typeof RadixTabs.Content>, TabsContentProps>(
  function TabsContent({ className, ...rest }, ref) {
    return (
      <RadixTabs.Content
        ref={ref}
        className={cn(
          'pt-4 font-ui text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          className,
        )}
        {...rest}
      />
    );
  },
);
