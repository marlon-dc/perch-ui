import { describe, expect, it } from 'vitest';
import { resolveSize } from './size';

describe('resolveSize', () => {
  it('defaults to density-m', () => {
    expect(resolveSize(undefined)).toBe('density-m');
  });
  it('maps a plain size', () => {
    expect(resolveSize('l')).toBe('density-l');
  });
  it('maps base + m', () => {
    expect(resolveSize({ base: 'l', m: 'm' })).toBe('density-l m:density-m');
  });
  it('falls back for omitted base', () => {
    expect(resolveSize({ m: 's' })).toBe('density-m m:density-s');
    expect(resolveSize({ l: 's' }, 'l')).toBe('density-l l:density-s');
  });
  it('orders base, m, l', () => {
    expect(resolveSize({ base: 's', m: 'm', l: 'l' })).toBe('density-s m:density-m l:density-l');
    expect(resolveSize({ l: 'l', base: 's' })).toBe('density-s l:density-l');
  });
});
