export interface FormatMoneyOptions {
  currency?: string;
  locale?: string;
  /** Show the currency symbol (default true). */
  symbol?: boolean;
}

const MINUS = '−';

export function formatMoney(amount: number, opts: FormatMoneyOptions = {}): string {
  const { currency = 'PHP', locale = 'en-PH', symbol = true } = opts;
  if (!Number.isFinite(amount)) return '—';

  // Round half away from zero to cents; a rounded zero is never negative.
  const abs = Math.round((Math.abs(amount) + Number.EPSILON) * 100) / 100;
  const negative = amount < 0 && abs !== 0;

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
