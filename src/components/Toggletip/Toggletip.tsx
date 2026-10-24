import type { ReactNode } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { IconButton } from '../Button';
import { InfoIcon } from '../Icon';

export type ToggletipProps = {
  /** Accessible name of the trigger button, e.g. "What does Forecast mean?". */
  label: string;
  /** Tip text. */
  children: ReactNode;
};

export function Toggletip({ label, children }: ToggletipProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton label={label} variant="ghost" size="s" icon={<InfoIcon />} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          collisionPadding={8}
          className="z-50 max-w-[min(18rem,calc(100vw-1rem))] rounded-lg bg-ink px-3 py-2 font-ui text-[13px] leading-snug text-bg shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
