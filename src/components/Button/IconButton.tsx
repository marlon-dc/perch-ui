import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Button, type ButtonProps } from './Button';

export type IconButtonProps = Omit<ButtonProps, 'icon' | 'children' | 'fullWidth' | 'confirm'> & {
  icon: ReactNode;
  label: string;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, className, ...rest },
  ref,
) {
  return (
    <Button
      ref={ref}
      aria-label={label}
      className={cn('hit-area w-(--pu-ctl-h) px-0', className)}
      icon={icon}
      {...rest}
    />
  );
});
