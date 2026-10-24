export interface FormatMoneyOptions {
  currency?: string;
  locale?: string;
  /** Show the currency symbol (default true). */
  symbol?: boolean;
}

const MINUS = '−';

/** Round a magnitude to cents, half away from zero, using decimal-exponent shifting to avoid binary drift. */
export function roundCents(amount: number): number {
  const abs = Math.abs(amount);
  if (!Number.isFinite(abs)) return NaN;
  if (abs < 0.005) return 0;
  // Beyond 1e15 there are no meaningful cents, and String(abs) may be in exponent form.
  const rounded =
    abs >= 1e15 ? Math.round(abs) : Number(Math.round(Number(abs + 'e2')) + 'e-2');
  return amount < 0 && rounded !== 0 ? -rounded : rounded;
}

export function formatMoney(amount: number, opts: FormatMoneyOptions = {}): string {
  const { currency = 'PHP', locale = 'en-PH', symbol = true } = opts;
  if (!Number.isFinite(amount)) return '—';

  // A rounded zero is never negative.
  const rounded = roundCents(amount);
  const abs = Math.abs(rounded);
  const negative = rounded < 0;

  const formatter = new Intl.NumberFormat(
    locale,
    symbol
      ? { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }
      : { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 },
  );
  // Normalise ICU differences: no-break / narrow spaces become plain spaces.
  const body = formatter.format(abs).replace(/[\u00a0\u202f]/g, ' ');
  return negative ? MINUS + body : body;
}
