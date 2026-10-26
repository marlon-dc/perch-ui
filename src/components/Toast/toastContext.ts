import { createContext } from 'react';

export type ToastApi = {
  show: (message: string, opts?: { durationMs?: number }) => void;
};

export const ToastContext = createContext<ToastApi | null>(null);
