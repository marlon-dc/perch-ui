import { CONTRAST_PAIRS, contrastRatio, parseThemeBlocks } from '../../tokens/contrast';
import tokensCss from '../../tokens/tokens.css?raw';

type Theme = 'light' | 'dark';
const THEMES = parseThemeBlocks(tokensCss);
const THEME_NAMES: Theme[] = ['light', 'dark'];
const isHex = (v: string | undefined): v is string => !!v && /^#[0-9a-f]{6}$/i.test(v);

const GROUPS: ReadonlyArray<{ title: string; tokens: string[] }> = [
  { title: 'Surfaces', tokens: ['bg', 'surface', 'surface-2', 'line', 'line-strong'] },
  { title: 'Text', tokens: ['ink', 'muted'] },
  {
    title: 'Accent and state',
    tokens: [
      'accent',
      'accent-ink',
      'positive',
      'negative',
      'done-bg',
      'done-ink',
      'warn-bg',
      'warn-ink',
    ],
  },
  {
    title: 'Categories',
    tokens: [
      'cat-green',
      'cat-amber',
      'cat-teal',
      'cat-rose',
      'tint-green',
      'tint-amber',
      'tint-teal',
      'tint-rose',
    ],
  },
];

/**
 * One swatch grid per theme. Each panel is painted from that theme's own token values (not the
 * page theme), and labels sit on the theme's `surface`, never on the swatch itself, so the
 * labels always have readable contrast.
 */
export function ColorSwatches() {
  return (
    <div className="grid gap-6 m:grid-cols-2">
      {THEME_NAMES.map((theme) => {
        const t = THEMES[theme];
        return (
          <section
            key={theme}
            aria-label={`${theme} theme colors`}
            className="rounded-2xl p-4"
            style={{ background: t['bg'], color: t['ink'] }}
          >
            <h3 className="m-0 mb-3 text-[15px] font-bold capitalize" style={{ color: t['ink'] }}>
              {theme}
            </h3>
            {GROUPS.map((group) => (
              <div key={group.title} className="mb-4">
                <p
                  className="m-0 mb-2 text-[11px] font-semibold uppercase tracking-[0.06em]"
                  style={{ color: t['muted'] }}
                >
                  {group.title}
                </p>
                <ul
                  className="m-0 grid list-none grid-cols-2 gap-2 p-0"
                  style={{ padding: 0, margin: 0 }}
                >
                  {group.tokens.map((token) => (
                    <li
                      key={token}
                      className="m-0 flex items-center gap-2 rounded-xl p-2"
                      style={{
                        margin: 0,
                        background: t['surface'],
                        border: `1px solid ${t['line']}`,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="size-8 shrink-0 rounded-lg"
                        style={{ background: t[token], border: `1px solid ${t['line-strong']}` }}
                      />
                      <span className="min-w-0 text-[12px] leading-tight">
                        <span className="block font-num font-semibold" style={{ color: t['ink'] }}>
                          {token}
                        </span>
                        <span className="block font-num" style={{ color: t['muted'] }}>
                          {t[token]}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}

function ratioFor(theme: Theme, fg: string, bg: string): number | null {
  const f = THEMES[theme][fg];
  const b = THEMES[theme][bg];
  return isHex(f) && isHex(b) ? contrastRatio(f, b) : null;
}

/** Every `CONTRAST_PAIRS` entry with its live ratio in both themes. */
export function ContrastTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-ui text-[13px] text-ink">
        <caption className="pb-2 text-left text-muted">
          Foreground and background token pairs, measured from tokens.css. Text needs 4.5:1; control
          borders and meaningful icons need 3:1.
        </caption>
        <thead>
          <tr className="border-b border-line-strong text-left">
            <th scope="col" className="py-2 pr-3">
              Foreground on background
            </th>
            <th scope="col" className="py-2 pr-3">
              Needs
            </th>
            <th scope="col" className="py-2 pr-3">
              Light
            </th>
            <th scope="col" className="py-2 pr-3">
              Dark
            </th>
          </tr>
        </thead>
        <tbody>
          {CONTRAST_PAIRS.map((pair) => (
            <tr key={`${pair.fg}-${pair.bg}`} className="border-b border-line">
              <th scope="row" className="py-2 pr-3 text-left font-medium">
                <span className="font-num">{pair.fg}</span> on{' '}
                <span className="font-num">{pair.bg}</span>
              </th>
              <td className="py-2 pr-3 font-num tabular-nums">{pair.min}:1</td>
              {THEME_NAMES.map((theme) => {
                const ratio = ratioFor(theme, pair.fg, pair.bg);
                const pass = ratio !== null && ratio >= pair.min;
                return (
                  <td key={theme} className="py-2 pr-3 font-num tabular-nums">
                    {ratio === null ? 'n/a' : `${ratio.toFixed(2)}:1`}{' '}
                    <span
                      className={
                        pass ? 'font-semibold text-positive' : 'font-semibold text-negative'
                      }
                    >
                      {pass ? '✓ Pass' : '✗ Fail'}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
