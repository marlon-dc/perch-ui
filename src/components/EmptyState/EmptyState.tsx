import type { ReactNode, Ref } from 'react';
import { cn } from '../../lib/cn';

export interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function EmptyState({ title, description, action, className, ref }: EmptyStateProps) {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col items-center gap-2 px-4 py-8 text-center', className)}
    >
      <p className="text-[16px] font-semibold text-ink">{title}</p>
      {description ? <div className="max-w-sm text-[14px] text-muted">{description}</div> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
