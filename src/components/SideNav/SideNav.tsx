import type { MouseEventHandler, ReactNode, Ref } from 'react';
import { cn } from '../../lib/cn';

export type SideNavProps = {
  'aria-label': string;
  header?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function SideNav({ 'aria-label': ariaLabel, header, children, className }: SideNavProps) {
  return (
    <nav aria-label={ariaLabel} className={cn('flex flex-col gap-1 font-ui text-ink', className)}>
      {header ? <div className="px-3 pb-2">{header}</div> : null}
      {children}
    </nav>
  );
}

export type SideNavItemProps = {
  icon?: ReactNode;
  current?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  href?: string;
  children?: ReactNode;
  className?: string;
  /** Ref to the rendered element: an `<a>` with `href`, otherwise a `<button>` (a `<span>` when a link is disabled). */
  ref?: Ref<HTMLElement>;
};

export function SideNavItem({
  icon,
  current,
  disabled,
  onClick,
  href,
  children,
  className,
  ref,
}: SideNavItemProps) {
  const classes = cn(
    'box-border flex min-h-11 w-full items-center gap-3 rounded-(--pu-ctl-r) border-l-[3px] border-transparent px-3',
    'text-left text-[length:var(--pu-ctl-fs)] font-medium text-ink no-underline forced-colors:border-[Canvas]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-surface-2',
    // Inset accent bar is a left border so it survives forced-colors (box-shadow does not).
    current && 'border-accent bg-surface-2 forced-colors:border-[Highlight]',
    className,
  );
  const content = (
    <>
      {icon ? (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </>
  );
  const ariaCurrent = current ? ('page' as const) : undefined;
  if (href && disabled) {
    return (
      <span ref={ref} aria-disabled="true" aria-current={ariaCurrent} className={classes}>
        {content}
      </span>
    );
  }
  if (href) {
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        aria-current={ariaCurrent}
        className={classes}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-current={ariaCurrent}
      className={classes}
    >
      {content}
    </button>
  );
}

export function SideNavSeparator() {
  return <hr className="my-2 border-0 border-t border-line" />;
}
