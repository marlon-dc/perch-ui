import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export type LinkButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const LinkButton = forwardRef<HTMLButtonElement, LinkButtonProps>(function LinkButton(
  { className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'font-ui text-accent inline cursor-pointer font-semibold underline underline-offset-2',
        'focus-visible:outline-accent rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
    />
  );
});
