import type { ReactNode } from 'react';

export type ListSectionHeaderProps = {
  children: ReactNode;
  trailing?: ReactNode;
};

/**
 * Rendered as a listitem so the parent role="list" only ever contains listitems
 * (axe `list` / `aria-required-children`).
 */
export function ListSectionHeader({ children, trailing }: ListSectionHeaderProps) {
  return (
    <div
      role="listitem"
      className="flex items-center justify-between gap-3 bg-surface-2 px-4 py-2 text-[12px] font-semibold tracking-wider text-muted uppercase"
    >
      <span className="min-w-0 [overflow-wrap:anywhere]">{children}</span>
      {trailing ? <span className="shrink-0 normal-case tracking-normal">{trailing}</span> : null}
    </div>
  );
}
