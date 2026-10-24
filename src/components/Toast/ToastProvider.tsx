import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { ToastContext, type ToastApi } from './toastContext';

type Item = { id: number; message: string; durationMs: number };

export type ToastProviderProps = { children: ReactNode };

export function ToastProvider({ children }: ToastProviderProps) {
  const [items, setItems] = useState<Item[]>([]);
  const nextId = useRef(0);

  const show = useCallback<ToastApi['show']>((message, opts) => {
    const id = nextId.current++;
    setItems((prev) => [...prev, { id, message, durationMs: opts?.durationMs ?? 4000 }]);
  }, []);
  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      <Toast.Provider swipeDirection="down">
        {children}
        {items.map((item) => (
          <Toast.Root
            key={item.id}
            type="background"
            duration={item.durationMs}
            onOpenChange={(open) => {
              if (!open) setItems((prev) => prev.filter((i) => i.id !== item.id));
            }}
            className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent bg-ink px-4 py-3 font-ui text-sm text-bg shadow-soft data-[state=closed]:motion-safe:animate-[pu-fade-out_150ms_ease-in] data-[state=open]:motion-safe:animate-[pu-slide-up_200ms_ease-out]"
          >
            <Toast.Description>{item.message}</Toast.Description>
          </Toast.Root>
        ))}
        <Toast.Viewport className="fixed inset-x-0 bottom-0 z-60 m-0 flex list-none flex-col items-center gap-2 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent [&>li]:max-w-[min(24rem,100%)]" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
