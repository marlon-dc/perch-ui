export type NumberFormat = 'decimal' | 'currency' | 'percent';

export interface FormatNumberOptions {
  /** `decimal` (default), `currency` or `percent` (the value is a ratio: 0.25 → 25%). */
  format?: NumberFormat;
  /** ISO 4217 code used when `format` is `currency` (default `USD`). */
  currency?: string;
  locale?: string;
  /** Fixed fraction digits. Defaults: currency 2, percent 0, decimal up to 2. */
  fractionDigits?: number;
}

const MINUS = '−';

/** Round to `digits` decimals, half away from zero, using decimal-exponent shifting to avoid binary drift. */
export function roundHalfAway(value: number, digits = 0): number {
  const abs = Math.abs(value);
  if (!Number.isFinite(abs)) return NaN;
  if (abs < 0.5 * 10 ** -digits) return 0;
  // Beyond 1e15 there are no meaningful fractions, and String(abs) may be in exponent form.
  const rounded =
    abs >= 1e15 ? Math.round(abs) : Number(Math.round(Number(`${abs}e${digits}`)) + `e-${digits}`);
  return value < 0 && rounded !== 0 ? -rounded : rounded;
}

export function formatNumber(value: number, opts: FormatNumberOptions = {}): string {
  const { format = 'decimal', currency = 'USD', locale = 'en-US', fractionDigits } = opts;
  if (!Number.isFinite(value)) return '—';

  const minDigits = fractionDigits ?? (format === 'currency' ? 2 : 0);
  const maxDigits = fractionDigits ?? (format === 'percent' ? 0 : 2);

  // Round in display units (percent shows value × 100); a rounded zero is never negative.
  const scale = format === 'percent' ? 100 : 1;
  const rounded = roundHalfAway(value * scale, maxDigits);
  const negative = rounded < 0;
  const abs = Math.abs(rounded) / scale;

  const formatter = new Intl.NumberFormat(locale, {
    style: format,
    ...(format === 'currency' ? { currency } : {}),
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  });
  // Normalise ICU differences: no-break / narrow spaces become plain spaces.
  const body = formatter.format(abs).replace(/[\u00a0\u202f]/g, ' ');
  return negative ? MINUS + body : body;
}
