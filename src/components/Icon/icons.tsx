import type { ReactNode, SVGProps } from 'react';

export type IconProps = { size?: number; title?: string } & Omit<SVGProps<SVGSVGElement>, 'title'>;

interface Spec {
  name: string;
  viewBox: number;
  defaultSize: number;
  strokeWidth: number;
  fill?: boolean;
  children: ReactNode;
}

function createIcon({ name, viewBox, defaultSize, strokeWidth, fill, children }: Spec) {
  function Icon({ size = defaultSize, title, ...rest }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={`0 0 ${viewBox} ${viewBox}`}
        fill={fill ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={fill ? 0 : strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...(title ? { role: 'img' } : { 'aria-hidden': true })}
        {...rest}
      >
        {title ? <title>{title}</title> : null}
        {children}
      </svg>
    );
  }
  Icon.displayName = name;
  return Icon;
}

export const ListIcon = createIcon({
  name: 'ListIcon',
  viewBox: 20,
  defaultSize: 20,
  strokeWidth: 1.8,
  children: (
    <>
      <path d="M8 5h9M8 10h9M8 15h9" />
      <circle cx="3.8" cy="5" r=".6" />
      <circle cx="3.8" cy="10" r=".6" />
      <circle cx="3.8" cy="15" r=".6" />
    </>
  ),
});

export const GridIcon = createIcon({
  name: 'GridIcon',
  viewBox: 20,
  defaultSize: 20,
  strokeWidth: 1.8,
  children: (
    <>
      <rect x="3" y="4" width="14" height="12" rx="2" />
      <path d="M3 9h14M9 4v12" />
    </>
  ),
});

export const SlidersIcon = createIcon({
  name: 'SlidersIcon',
  viewBox: 20,
  defaultSize: 20,
  strokeWidth: 1.8,
  children: (
    <>
      <path d="M3 6h7M16 6h1M3 14h1M10 14h7" />
      <circle cx="13" cy="6" r="2.2" />
      <circle cx="7" cy="14" r="2.2" />
    </>
  ),
});

export const MoonIcon = createIcon({
  name: 'MoonIcon',
  viewBox: 20,
  defaultSize: 20,
  strokeWidth: 1.8,
  children: <path d="M16.5 12.2A6.5 6.5 0 0 1 7.8 3.5a6.5 6.5 0 1 0 8.7 8.7z" />,
});

export const SunIcon = createIcon({
  name: 'SunIcon',
  viewBox: 20,
  defaultSize: 20,
  strokeWidth: 1.8,
  children: (
    <>
      <circle cx="10" cy="10" r="3.6" />
      <path d="M10 2.5v1.8M10 15.7v1.8M2.5 10h1.8M15.7 10h1.8M4.7 4.7 6 6M14 14l1.3 1.3M4.7 15.3 6 14M14 6l1.3-1.3" />
    </>
  ),
});

export const InfoIcon = createIcon({
  name: 'InfoIcon',
  viewBox: 16,
  defaultSize: 16,
  strokeWidth: 1.5,
  children: (
    <>
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 7.3v3.4" />
      <circle cx="8" cy="4.9" r=".55" fill="currentColor" />
    </>
  ),
});

export const ChevronDownIcon = createIcon({
  name: 'ChevronDownIcon',
  viewBox: 20,
  defaultSize: 20,
  strokeWidth: 2,
  children: <path d="M5 7.5 10 12.5 15 7.5" />,
});

export const SwapIcon = createIcon({
  name: 'SwapIcon',
  viewBox: 20,
  defaultSize: 20,
  strokeWidth: 1.8,
  children: <path d="M4 7h12M13 4l3 3-3 3M16 13H4M7 10l-3 3 3 3" />,
});

export const ChevronLeftIcon = createIcon({
  name: 'ChevronLeftIcon',
  viewBox: 20,
  defaultSize: 20,
  strokeWidth: 2,
  children: <path d="M12.5 4.5 7 10l5.5 5.5" />,
});

export const ChevronRightIcon = createIcon({
  name: 'ChevronRightIcon',
  viewBox: 20,
  defaultSize: 20,
  strokeWidth: 2,
  children: <path d="M7.5 4.5 13 10l-5.5 5.5" />,
});

export const DotsIcon = createIcon({
  name: 'DotsIcon',
  viewBox: 20,
  defaultSize: 20,
  strokeWidth: 0,
  fill: true,
  children: (
    <>
      <circle cx="4.5" cy="10" r="1.6" />
      <circle cx="10" cy="10" r="1.6" />
      <circle cx="15.5" cy="10" r="1.6" />
    </>
  ),
});

export const CheckIcon = createIcon({
  name: 'CheckIcon',
  viewBox: 14,
  defaultSize: 14,
  strokeWidth: 2.2,
  children: <path d="M2.5 7.4 5.6 10.4 11.5 3.8" />,
});

export const PlusIcon = createIcon({
  name: 'PlusIcon',
  viewBox: 18,
  defaultSize: 18,
  strokeWidth: 2.2,
  children: <path d="M9 3v12M3 9h12" />,
});

export const CloseIcon = createIcon({
  name: 'CloseIcon',
  viewBox: 20,
  defaultSize: 20,
  strokeWidth: 1.8,
  children: <path d="M5 5l10 10M15 5 5 15" />,
});
