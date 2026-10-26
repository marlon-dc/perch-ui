# Perch UI

> Live Storybook: _coming soon_

Perch UI is a small React design system for dense, calm, data-rich screens. It is written in
TypeScript with Tailwind CSS v4, ships a warm light theme and a matching dark theme, and targets
WCAG 2.1 AA in both. The Storybook is the documentation and the test suite at once: every story is also
an automated check, with axe running on every story in the light theme and on one representative Dark
story per component.

The idea is density control. Height, padding, font size and radius move together on a 4px grid, so
compact desktop versus thumb-friendly mobile is one `size` prop rather than a restyle.

## The size system

Sized controls come in three sizes, **S**, **M** (the default) and **L**. At a given size, every sized
control has exactly the same height, so a Button, TextField, Select, Chip and SegmentedControl in one
row line up without hand-tuning.

| Size        | Control height | Horizontal padding | Font size | Radius | List row min-height |
| ----------- | -------------- | ------------------ | --------- | ------ | ------------------- |
| S           | 28px           | 10px               | 12px      | 8px    | 40px                |
| M (default) | 36px           | 14px               | 14px      | 10px   | 48px                |
| L           | 44px           | 18px               | 15px      | 12px   | 56px                |

Any sized component takes a single size or an object keyed by breakpoint (`base`, `m` from 768px,
`l` from 1024px):

```tsx
<Button size="m" />
<Button size={{ base: 'l', m: 'm' }} /> // large on phones, medium from tablet width up
```

Touch rules, on coarse pointers (`@media (pointer: coarse)`):

- Interactive controls smaller than 44 by 44px get an invisible 44px hit area, without changing how they look.
  Two documented exceptions: TextField, whose bordered box is the visible target (28px tall at S) and which relies instead on the 16px touch font and its usual full-width layout; and LinkButton, an inline text link sized by the surrounding line.
- Text-entry controls render their text at `max(var(--pu-ctl-fs), 16px)`. This is the one exception to
  "values scale together": iOS Safari zooms the page when a focused input's font is under 16px.
  Height, padding and radius still follow S, M and L.

See Foundations, Size scale in Storybook for the aligned-row demo.

## Accessibility

Every component targets **WCAG 2.1 level AA in both themes**: text contrast of at least 4.5:1, control
borders and focus rings of at least 3:1, full keyboard operation with a visible focus ring, correct roles
and states, and color never the only signal.

What is checked automatically:

- **axe on every story in light, and on one representative Dark story per component.** The Storybook
  a11y addon runs axe on each story and the tests fail on any violation. Every component has one `Dark`
  story (usually its States or Variants story), so the dark theme is checked on each component, not on
  every story.
- **Contrast unit tests** for every documented foreground and background token pair, in both themes.
- **Play functions** for keyboard interaction, roles and states.
- **Browser viewport tests** for responsive `size` on Button and a Sheet that changes layout by width,
  a 320px overflow check on ListRow, and forced-colors (Windows High Contrast) state visibility for
  Switch, ConfirmToggle, SegmentedControl, Tabs and SideNav.

Automated checks catch only a fraction of problems, and the prose docs pages are not axe-tested; see
Foundations, Accessibility in Storybook for the exact scope.

Radix UI is used only where correct accessible behavior is genuinely hard: Dialog (Sheet), Popover
(Toggletip), Toast, Select, and Tabs (Tabs and SegmentedControl). It handles focus management,
typeahead, dismissal and ARIA wiring. Everything else is hand-built on native elements.

## Theming

Tokens are CSS custom properties on `:root`. Dark mode follows `prefers-color-scheme` unless you set a
`data-theme` attribute on `<html>`:

```ts
document.documentElement.dataset.theme = 'dark'; // or 'light'
delete document.documentElement.dataset.theme; // back to the system preference
```

Both themes declare identical token names, so components never branch on the theme. Override any
`--pu-*` variable to rebrand, then re-run the contrast tests.

## Tech stack

- Storybook 10 (`@storybook/react-vite`) with the a11y and docs addons
- React 19 and TypeScript 6 (strict)
- Tailwind CSS v4 via `@tailwindcss/vite`, Vite 8
- Vitest 5 with Playwright (Chromium) for story and browser tests
- Radix UI primitives for Dialog, Popover, Toast, Select and Tabs
- Plus Jakarta Sans and JetBrains Mono, self-hosted with Fontsource
- pnpm

## Running locally

Requires Node 22 or newer and pnpm.

```sh
pnpm i
pnpm exec playwright install chromium   # once, for the browser tests
pnpm dev                                # Storybook at http://localhost:6006
pnpm test                               # unit, story (with axe) and browser tests
```

Other scripts: `pnpm lint`, `pnpm typecheck`, `pnpm build-storybook` (outputs to `storybook-static`).

## Project structure

```
src/
  components/   one folder per component: Name.tsx, Name.stories.tsx, index.ts
  docs/         Introduction and foundations pages
  lib/          size resolution (resolveSize), cn helper
  styles/       Tailwind entry and utilities (hit-area, density classes)
  tokens/       color and density tokens, contrast checks
  index.ts      public exports
.storybook/     Storybook config and test setup
```

## Status

Perch UI is not published to npm.
All example data in the stories and docs is made up.

## License

MIT. See [LICENSE](./LICENSE).
