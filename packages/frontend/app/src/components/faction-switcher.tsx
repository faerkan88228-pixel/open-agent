import {
  FACTION_ORDER,
  type FactionCode,
  FACTIONS,
  InfinityThemeProvider,
  useInfinityTheme,
} from '@afk/theme-infinity';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import * as styles from './faction-switcher.css';

/**
 * Compact Infinity City faction picker for the app shell.
 * Colours and labels come from `@afk/theme-infinity`, so adding a faction to the
 * package is enough for it to appear here.
 */
export const FactionSwitcher = () => {
  const { code, setFaction } = useInfinityTheme();

  return (
    <div
      className={styles.container}
      role="group"
      aria-label="Infinity City faction"
    >
      {FACTION_ORDER.map(item => {
        const active = item === code;
        return (
          <button
            key={item}
            type="button"
            className={cn(styles.chip, active && styles.chipActive)}
            aria-pressed={active}
            title={`${FACTIONS[item].name} — ${FACTIONS[item].feeling}`}
            onClick={() => setFaction(item)}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
};

/** Reads the persisted faction and applies it to the document root. */
export const InfinityThemeRoot = ({ children }: { children: ReactNode }) => (
  <InfinityThemeProvider>{children}</InfinityThemeProvider>
);

export type { FactionCode };
