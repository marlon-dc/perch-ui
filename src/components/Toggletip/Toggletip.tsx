import type { ReactNode } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { cn } from '../../lib/cn';
import { IconButton } from '../Button';
import { InfoIcon } from '../Icon';

export type ToggletipProps = {
  /** Accessible name of the trigger button, e.g. "What does Forecast mean?". */
  label: string;
  /** Tip text. */
  children: ReactNode;
  /** Class names for the tip bubble (Popover content). */
  className?: string;
};

export function Toggletip({ label, children, className }: ToggletipProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton label={label} variant="ghost" size="s" icon={<InfoIcon />} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          aria-label={label}
          sideOffset={6}
          collisionPadding={8}
          className={cn(
            'z-50 max-w-[min(18rem,calc(100vw-1rem))] rounded-lg bg-ink px-3 py-2 font-ui text-[13px] leading-snug text-bg shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
            className,
          )}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
