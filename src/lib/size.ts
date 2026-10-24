export type Size = 's' | 'm' | 'l';
export type Breakpoint = 'base' | 'm' | 'l';
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

// Written out literally so Tailwind's scanner sees every class.
const DENSITY_CLASSES: Record<Breakpoint, Record<Size, string>> = {
  base: { s: 'density-s', m: 'density-m', l: 'density-l' },
  m: { s: 'm:density-s', m: 'm:density-m', l: 'm:density-l' },
  l: { s: 'l:density-s', m: 'l:density-m', l: 'l:density-l' },
};

const ORDER: Breakpoint[] = ['base', 'm', 'l'];

export function resolveSize(size: Responsive<Size> | undefined, fallback: Size = 'm'): string {
  const map: Partial<Record<Breakpoint, Size>> =
    size === undefined ? {} : typeof size === 'string' ? { base: size } : size;
  const out: string[] = [];
  for (const bp of ORDER) {
    const value = map[bp] ?? (bp === 'base' ? fallback : undefined);
    if (value) out.push(DENSITY_CLASSES[bp][value]);
  }
  return out.join(' ');
}
