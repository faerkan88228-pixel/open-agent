import {
  createContext,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  DEFAULT_FACTION,
  type Faction,
  FACTION_ORDER,
  FACTION_STORAGE_KEY,
  type FactionCode,
  factionToCssVars,
  getFaction,
  isFactionCode,
} from './factions';

export interface InfinityThemeContextValue {
  /** currently active faction */
  faction: Faction;
  /** active faction code */
  code: FactionCode;
  /** switch to another faction (persisted when `persist` is enabled) */
  setFaction: (code: FactionCode) => void;
  /** cycle to the next faction in display order — handy for demos */
  nextFaction: () => void;
  /** CSS custom properties of the active faction */
  cssVars: Record<string, string>;
}

const InfinityThemeContext = createContext<InfinityThemeContextValue | null>(
  null
);

const readStoredFaction = (): FactionCode | null => {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  try {
    const stored = localStorage.getItem(FACTION_STORAGE_KEY);
    return isFactionCode(stored) ? stored : null;
  } catch {
    return null;
  }
};

export interface InfinityThemeProviderProps {
  children: ReactNode;
  /** controlled faction; when omitted the provider keeps its own state */
  faction?: FactionCode;
  /** initial faction when uncontrolled */
  defaultFaction?: FactionCode;
  /** notify the host application about faction changes */
  onFactionChange?: (code: FactionCode) => void;
  /** persist the choice in `localStorage` (default: true) */
  persist?: boolean;
  /** element that receives the CSS variables — `<html>` by default */
  applyTo?: () => HTMLElement | null;
  /** write variables through a data attribute instead of inline styles */
  attributeMode?: boolean;
  /** extra class thrown on the target in attribute mode */
  className?: string;
}

/**
 * Applies the Infinity City faction tokens to the document and exposes the
 * current faction through context. Two modes:
 *
 * - `attributeMode` (default): sets `data-infinity-faction` on <html>, so the
 *   stylesheet in `@afk/theme-infinity/style.css` does all the work — no
 *   inline styles, no flash, and tokens stay inspectable in devtools.
 * - inline mode: writes every `--infinity-*` variable, useful when a host
 *   wants to override individual tokens or scope the theme to a subtree.
 */
export const InfinityThemeProvider = ({
  children,
  faction: controlledFaction,
  defaultFaction = DEFAULT_FACTION,
  onFactionChange,
  persist = true,
  applyTo,
  attributeMode = true,
  className,
}: InfinityThemeProviderProps) => {
  const [uncontrolledFaction, setUncontrolledFaction] = useState<FactionCode>(
    () => (persist ? readStoredFaction() : null) ?? defaultFaction
  );

  const code = controlledFaction ?? uncontrolledFaction;

  const setFaction = useCallback(
    (next: FactionCode) => {
      if (!isFactionCode(next)) {
        return;
      }
      setUncontrolledFaction(next);
      if (persist) {
        try {
          localStorage.setItem(FACTION_STORAGE_KEY, next);
        } catch {
          // storage can be unavailable (private mode, SSR) — theming still works
        }
      }
      onFactionChange?.(next);
    },
    [onFactionChange, persist]
  );

  const nextFaction = useCallback(() => {
    const index = FACTION_ORDER.indexOf(code);
    const next = FACTION_ORDER[(index + 1) % FACTION_ORDER.length];
    setFaction(next);
  }, [code, setFaction]);

  const cssVars = useMemo(() => factionToCssVars(code), [code]);
  const faction = getFaction(code);

  const value = useMemo<InfinityThemeContextValue>(
    () => ({ faction, code, setFaction, nextFaction, cssVars }),
    [faction, code, setFaction, nextFaction, cssVars]
  );

  const target =
    typeof document === 'undefined'
      ? null
      : applyTo
        ? applyTo()
        : document.documentElement;

  if (target) {
    if (attributeMode) {
      target.setAttribute('data-infinity-faction', code);
      if (className) {
        target.classList.add(className);
      }
    } else {
      for (const [name, raw] of Object.entries(cssVars)) {
        target.style.setProperty(name, raw);
      }
    }
  }

  return (
    <InfinityThemeContext.Provider value={value}>
      {children}
    </InfinityThemeContext.Provider>
  );
};

/** Read the active faction. Throws when used outside the provider. */
export const useInfinityTheme = (): InfinityThemeContextValue => {
  const context = useContext(InfinityThemeContext);
  if (!context) {
    throw new Error(
      'useInfinityTheme must be used within an <InfinityThemeProvider>'
    );
  }
  return context;
};

/** Non-throwing variant for optional theming (falls back to the default). */
export const useOptionalInfinityTheme = (): InfinityThemeContextValue | null =>
  useContext(InfinityThemeContext);

/** Inline style object for subtree-scoped theming without a provider. */
export const useInfinityCssVars = (code: FactionCode): CSSProperties =>
  useMemo(() => factionToCssVars(code) as CSSProperties, [code]);
