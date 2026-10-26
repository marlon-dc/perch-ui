import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { useToast } from './useToast';

function Probe() {
  useToast();
  return null;
}

test('useToast outside a ToastProvider throws a clear error', async () => {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    await expect(render(<Probe />)).rejects.toThrow(/inside a <ToastProvider>/);
  } finally {
    spy.mockRestore();
  }
});
