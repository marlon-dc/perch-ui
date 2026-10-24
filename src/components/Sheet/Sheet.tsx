import { useRef, type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { IconButton } from '../Button';
import { CloseIcon } from '../Icon';

export type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export function Sheet({ open, onOpenChange, title, description, children, footer }: SheetProps) {
  // Sheet is controlled and has no Dialog.Trigger, so remember the opener ourselves.
  const opener = useRef<HTMLElement | null>(null);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-scrim motion-safe:animate-[pu-fade_150ms_ease-out]" />
        <Dialog.Content
          onOpenAutoFocus={() => {
            opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
          }}
          onCloseAutoFocus={(event) => {
            const el = opener.current;
            opener.current = null;
            if (el?.isConnected) {
              event.preventDefault();
              el.focus();
            }
          }}
          {...(description ? {} : { 'aria-describedby': undefined })}
          className={[
            'fixed z-50 flex max-h-[90dvh] flex-col bg-surface font-ui text-ink shadow-soft',
            // Bottom sheet below 700px
            'inset-x-0 bottom-0 rounded-t-[18px] border-t border-line pb-[env(safe-area-inset-bottom)]',
            'motion-safe:animate-[pu-slide-up_200ms_ease-out]',
            // Centered dialog from 700px
            'min-[700px]:inset-x-auto min-[700px]:bottom-auto min-[700px]:top-1/2 min-[700px]:left-1/2',
            'min-[700px]:w-[min(32rem,calc(100vw-2rem))] min-[700px]:-translate-x-1/2 min-[700px]:-translate-y-1/2',
            'min-[700px]:rounded-(--pu-radius-container) min-[700px]:border min-[700px]:pb-0',
          ].join(' ')}
        >
          <div aria-hidden="true" className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-line-strong min-[700px]:hidden" />
          <div className="flex items-start gap-3 px-4 pt-3">
            <div className="min-w-0 flex-1">
              <Dialog.Title className="m-0 text-lg font-semibold">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description className="m-0 mt-1 text-sm text-muted">{description}</Dialog.Description>
              ) : null}
            </div>
            <div className="shrink-0">
              <Dialog.Close asChild>
                <IconButton label="Close" variant="ghost" size="s" icon={<CloseIcon />} />
              </Dialog.Close>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{children}</div>
          {footer ? <div className="flex justify-end gap-2 border-t border-line px-4 py-3">{footer}</div> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
