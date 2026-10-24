import { describe, expect, it } from 'vitest';
import { formatMoney, roundCents } from './formatMoney';

describe('formatMoney', () => {
  it('formats positive amounts', () => {
    expect(formatMoney(1234.5)).toBe('₱1,234.50');
  });
  it('uses U+2212 for negatives', () => {
    expect(formatMoney(-1234.5)).toBe('−₱1,234.50');
    expect(formatMoney(-1234.5, { symbol: false })).toBe('−1,234.50');
  });
  it('never shows negative zero', () => {
    expect(formatMoney(-0)).toBe('₱0.00');
    expect(formatMoney(-0.004)).toBe('₱0.00');
  });
  it('rounds half away from zero', () => {
    expect(formatMoney(0.005)).toBe('₱0.01');
  });
  it('rounds half away from zero despite binary representation', () => {
    expect(formatMoney(8.345)).toBe('₱8.35');
    expect(formatMoney(-8.345)).toBe('−₱8.35');
    expect(formatMoney(1.005)).toBe('₱1.01');
    expect(formatMoney(123456.785)).toBe('₱123,456.79');
  });
  it('handles values printed in exponent notation', () => {
    expect(formatMoney(1e-7)).toBe('₱0.00');
    expect(formatMoney(-1e-7)).toBe('₱0.00');
    expect(formatMoney(5e-7)).toBe('₱0.00');
    expect(formatMoney(1e21)).toBe('₱1,000,000,000,000,000,000,000.00');
    for (const x of [1e-7, -1e-7, 5e-7, 1e21, -1e21]) {
      expect(Number.isFinite(roundCents(x))).toBe(true);
    }
    expect(Object.is(roundCents(-1e-7), 0)).toBe(true);
  });
  it('handles large values', () => {
    expect(formatMoney(1e9)).toBe('₱1,000,000,000.00');
  });
  it('returns an em dash for non-finite input', () => {
    expect(formatMoney(NaN)).toBe('—');
    expect(formatMoney(Infinity)).toBe('—');
  });
  it('supports other currencies and locales', () => {
    expect(formatMoney(12, { currency: 'USD', locale: 'en-US' })).toBe('$12.00');
  });
});
