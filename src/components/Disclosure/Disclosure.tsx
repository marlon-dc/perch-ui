import { useId, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { ChevronDownIcon } from '../Icon';

export type DisclosureProps = {
  title: ReactNode;
  /** Secondary text beside the title (e.g. "3 items"). */
  meta?: ReactNode;
  /** Non-interactive content at the end of the header (e.g. a total). It is part of the button's name. */
  trailing?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  headingLevel?: 2 | 3 | 4;
  children: ReactNode;
};

export function Disclosure({
  title,
  meta,
  trailing,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  headingLevel = 2,
  children,
}: DisclosureProps) {
  const [inner, setInner] = useState(defaultOpen);
  const open = openProp ?? inner;
  const contentId = useId();
  const Heading = `h${headingLevel}` as const;

  const toggle = () => {
    if (openProp === undefined) setInner(!open);
    onOpenChange?.(!open);
  };

  return (
    <div className="rounded-(--pu-radius-container) border border-line bg-surface text-ink">
      <Heading className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={toggle}
          className={cn(
            'flex w-full cursor-pointer items-center gap-3 rounded-(--pu-radius-container) px-4 py-3 text-left',
            'min-h-(--pu-row-h) text-base font-semibold',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          )}
        >
          <ChevronDownIcon
            className={cn(
              'shrink-0 text-muted transition-transform motion-reduce:transition-none',
              !open && '-rotate-90',
            )}
          />
          <span className="min-w-0 flex-1">
            {title}
            {meta ? <span className="ml-2 text-xs font-normal text-muted">{meta}</span> : null}
          </span>
          {trailing ? <span className="shrink-0 font-num tabular-nums">{trailing}</span> : null}
        </button>
      </Heading>
      <div id={contentId} hidden={!open} className="px-4 pb-4">
        {children}
      </div>
    </div>
  );
}
