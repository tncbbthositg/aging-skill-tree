import type { ReactNode, SVGProps } from 'react';

import type { IconName } from '../types';

type IconProps = SVGProps<SVGSVGElement> & { name: IconName };

const paths: Record<IconName, ReactNode> = {
  bone: (
    <>
      <path d="m8 8 8 8M6 10a3 3 0 1 1 4-4l8 8a3 3 0 1 1-4 4Z" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  moon: <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z" />,
  stairs: (
    <>
      <path d="M3 20h6v-6h6V8h6M3 5l3 1M9 2l1 3M3 11h3" />
    </>
  ),
  bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7Z" />,
  sound: (
    <>
      <path d="m3 9 4 0 5-5v16l-5-5H3ZM16 8q5 4 0 8m3-11q8 7 0 14" />
    </>
  ),
  cloud: (
    <>
      <path d="M6 17a5 5 0 1 1 1-10 6 6 0 0 1 11 3 4 4 0 0 1 0 8H6" />
      <path d="m9 20-1 2m7-2-1 2" />
    </>
  ),
  shield: <path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6Z" />,
  thermometer: (
    <>
      <path d="M9 14V5a3 3 0 0 1 6 0v9a5 5 0 1 1-6 0ZM12 8v10m6-13h3m-3 4h2" />
    </>
  ),
  drop: <path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z" />,
  star: <path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" />,
};

export default function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1.5rem"
      height="1.5rem"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
