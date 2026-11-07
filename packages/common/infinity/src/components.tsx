import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import type { FactionCode } from './factions';

export type InfinityAtmosphereLayer =
  | 'stars'
  | 'grid'
  | 'sparks'
  | 'scan'
  | 'particles'
  | 'rings'
  | 'scratches';

export interface InfinityAtmosphereProps
  extends HTMLAttributes<HTMLDivElement> {
  /** render only some layers; all faction-appropriate layers by default */
  layers?: InfinityAtmosphereLayer[];
  children?: ReactNode;
}

/**
 * Decorative atmosphere for a surface. Every layer is driven by the active
 * faction's intensity tokens, so one component produces stardust for INF,
 * reactor sparks for PRM or scanning beams for DEF without conditional code.
 *
 * The container is `pointer-events: none` and `aria-hidden`, safe to drop into
 * any layout as the first child of a positioned element.
 */
export const InfinityAtmosphere = ({
  layers,
  className,
  children,
  ...props
}: InfinityAtmosphereProps) => {
  const enabled = layers ?? [
    'stars',
    'grid',
    'sparks',
    'scan',
    'particles',
    'rings',
    'scratches',
  ];

  const has = (layer: InfinityAtmosphereLayer) => enabled.includes(layer);

  return (
    <div
      aria-hidden="true"
      className={['infinity-fx', className].filter(Boolean).join(' ')}
      {...props}
    >
      {has('sparks') ? <span className="infinity-fx__sparks" /> : null}
      {has('scan') ? <span className="infinity-fx__scan" /> : null}
      {has('particles') ? <span className="infinity-fx__particles" /> : null}
      {has('rings') ? <span className="infinity-fx__rings" /> : null}
      {has('scratches') ? <span className="infinity-fx__scratches" /> : null}
      {children}
    </div>
  );
};

const hexToRgb = (hex: string): string => {
  const value = Number.parseInt(hex.replace('#', ''), 16);
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
};

export interface FactionSwatchProps {
  hex: string;
  /** semantic meaning of the colour, shown in the tooltip */
  role?: string;
  size?: number;
  active?: boolean;
}

/** Palette chip with the semantic role attached. */
export const FactionSwatch = ({
  hex,
  role,
  size = 18,
  active = false,
}: FactionSwatchProps) => {
  const style: CSSProperties = {
    width: size,
    height: size,
    borderRadius: '4px',
    background: hex,
    border: `1px solid rgba(${hexToRgb('#ffffff')}, ${active ? 0.5 : 0.12})`,
    boxShadow: active ? `0 0 0 2px rgba(${hexToRgb(hex)}, 0.35)` : undefined,
  };
  return <span style={style} title={role} data-color={hex} data-role={role} />;
};

export interface FactionSwitcherProps {
  value: FactionCode;
  onChange: (code: FactionCode) => void;
  /** compact renders only the three-letter codes */
  variant?: 'compact' | 'full';
  /** colours come from the faction data, labels from `FACTIONS` */
  factions: ReadonlyArray<{
    code: FactionCode;
    name: string;
    accent: string;
    accentInk: string;
  }>;
  className?: string;
}

/**
 * Headless-ish faction picker: renders buttons with correct aria-pressed state
 * and inline accent colours, leaving layout/styling to the host application.
 */
export const FactionSwitcher = ({
  value,
  onChange,
  variant = 'compact',
  factions,
  className,
}: FactionSwitcherProps) => (
  <div
    className={className}
    role="group"
    aria-label="Infinity City faction"
    data-infinity-switcher=""
  >
    {factions.map(faction => {
      const active = faction.code === value;
      return (
        <button
          key={faction.code}
          type="button"
          aria-pressed={active}
          aria-label={faction.name}
          title={variant === 'compact' ? faction.name : undefined}
          onClick={() => onChange(faction.code)}
          style={{
            background: active ? faction.accent : 'transparent',
            color: active ? faction.accentInk : undefined,
            borderColor: active ? faction.accent : undefined,
          }}
        >
          {variant === 'compact' ? faction.code : faction.name}
        </button>
      );
    })}
  </div>
);
