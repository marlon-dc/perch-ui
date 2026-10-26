import { describe, expect, it } from 'vitest';
import { formatNumber, roundHalfAway } from './formatNumber';

describe('formatNumber', () => {
  it('formats decimals with up to two fraction digits', () => {
    expect(formatNumber(1234)).toBe('1,234');
    expect(formatNumber(1234.5)).toBe('1,234.5');
    expect(formatNumber(1234.567)).toBe('1,234.57');
  });
  it('formats currency with two fraction digits', () => {
    expect(formatNumber(1234.5, { format: 'currency' })).toBe('$1,234.50');
    expect(formatNumber(12, { format: 'currency', currency: 'EUR', locale: 'en-IE' })).toBe(
      '€12.00',
    );
  });
  it('formats percentages from ratios', () => {
    expect(formatNumber(0.25, { format: 'percent' })).toBe('25%');
    expect(formatNumber(0.125, { format: 'percent' })).toBe('13%');
    expect(formatNumber(0.1234, { format: 'percent', fractionDigits: 1 })).toBe('12.3%');
  });
  it('honours fixed fraction digits', () => {
    expect(formatNumber(3, { fractionDigits: 2 })).toBe('3.00');
  });
  it('uses U+2212 for negatives', () => {
    expect(formatNumber(-1234.5)).toBe('−1,234.5');
    expect(formatNumber(-1234.5, { format: 'currency' })).toBe('−$1,234.50');
  });
  it('never shows negative zero', () => {
    expect(formatNumber(-0)).toBe('0');
    expect(formatNumber(-0.004, { format: 'currency' })).toBe('$0.00');
  });
  it('rounds half away from zero despite binary representation', () => {
    expect(formatNumber(0.005, { format: 'currency' })).toBe('$0.01');
    expect(formatNumber(8.345)).toBe('8.35');
    expect(formatNumber(-8.345)).toBe('−8.35');
    expect(formatNumber(1.005)).toBe('1.01');
    expect(formatNumber(123456.785)).toBe('123,456.79');
  });
  it('handles values printed in exponent notation', () => {
    expect(formatNumber(1e-7)).toBe('0');
    expect(formatNumber(-1e-7)).toBe('0');
    expect(formatNumber(1e21)).toBe('1,000,000,000,000,000,000,000');
    for (const x of [1e-7, -1e-7, 5e-7, 1e21, -1e21]) {
      expect(Number.isFinite(roundHalfAway(x, 2))).toBe(true);
    }
    expect(Object.is(roundHalfAway(-1e-7, 2), 0)).toBe(true);
  });
  it('returns an em dash for non-finite input', () => {
    expect(formatNumber(NaN)).toBe('—');
    expect(formatNumber(Infinity)).toBe('—');
  });
});
