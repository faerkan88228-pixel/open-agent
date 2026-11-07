/**
 * @vitest-environment happy-dom
 */
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import {
  FACTION_ORDER,
  FACTION_STORAGE_KEY,
  FACTIONS,
  FactionSwitcher,
  InfinityAtmosphere,
  InfinityThemeProvider,
  useInfinityTheme,
} from '..';

const Probe = () => {
  const { code, faction, setFaction, nextFaction } = useInfinityTheme();
  return (
    <div>
      <span data-testid="code">{code}</span>
      <span data-testid="name">{faction.name}</span>
      <button type="button" onClick={() => setFaction('UNT')}>
        unity
      </button>
      <button type="button" onClick={nextFaction}>
        next
      </button>
    </div>
  );
};

describe('InfinityThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-infinity-faction');
  });

  afterEach(() => {
    cleanup();
  });

  test('defaults to INF and marks the document root', () => {
    render(
      <InfinityThemeProvider>
        <Probe />
      </InfinityThemeProvider>
    );

    expect(screen.getByTestId('code').textContent).toBe('INF');
    expect(document.documentElement.dataset.infinityFaction).toBe('INF');
  });

  test('switches faction, persists it and notifies the host', () => {
    const onFactionChange = vi.fn();
    render(
      <InfinityThemeProvider onFactionChange={onFactionChange}>
        <Probe />
      </InfinityThemeProvider>
    );

    act(() => {
      screen.getByText('unity').click();
    });

    expect(screen.getByTestId('code').textContent).toBe('UNT');
    expect(screen.getByTestId('name').textContent).toBe(FACTIONS.UNT.name);
    expect(document.documentElement.dataset.infinityFaction).toBe('UNT');
    expect(localStorage.getItem(FACTION_STORAGE_KEY)).toBe('UNT');
    expect(onFactionChange).toHaveBeenCalledWith('UNT');
  });

  test('restores the stored faction on mount', () => {
    localStorage.setItem(FACTION_STORAGE_KEY, 'EQB');
    render(
      <InfinityThemeProvider>
        <Probe />
      </InfinityThemeProvider>
    );
    expect(screen.getByTestId('code').textContent).toBe('EQB');
  });

  test('ignores a corrupted stored value', () => {
    localStorage.setItem(FACTION_STORAGE_KEY, 'nope');
    render(
      <InfinityThemeProvider>
        <Probe />
      </InfinityThemeProvider>
    );
    expect(screen.getByTestId('code').textContent).toBe('INF');
  });

  test('nextFaction cycles through the display order', () => {
    render(
      <InfinityThemeProvider>
        <Probe />
      </InfinityThemeProvider>
    );

    const seen: string[] = [];
    for (let i = 0; i < 6; i++) {
      seen.push(screen.getByTestId('code').textContent ?? '');
      act(() => {
        screen.getByText('next').click();
      });
    }

    expect(seen).toEqual(FACTION_ORDER);
    // wrapped back to the first faction
    expect(screen.getByTestId('code').textContent).toBe('INF');
  });

  test('respects a controlled faction', () => {
    render(
      <InfinityThemeProvider faction="PRM">
        <Probe />
      </InfinityThemeProvider>
    );
    expect(screen.getByTestId('code').textContent).toBe('PRM');
    expect(document.documentElement.dataset.infinityFaction).toBe('PRM');
  });

  test('useInfinityTheme fails loudly outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(
      /must be used within an <InfinityThemeProvider>/
    );
    spy.mockRestore();
  });
});

describe('FactionSwitcher', () => {
  afterEach(() => cleanup());

  test('exposes the active faction through aria-pressed', () => {
    const onChange = vi.fn();
    render(
      <FactionSwitcher
        value="DEF"
        onChange={onChange}
        factions={FACTION_ORDER.map(code => ({
          code,
          name: FACTIONS[code].name,
          accent: FACTIONS[code].accent,
          accentInk: FACTIONS[code].accentInk,
        }))}
      />
    );

    const pressed = screen
      .getAllByRole('button')
      .filter(button => button.getAttribute('aria-pressed') === 'true');
    expect(pressed).toHaveLength(1);
    expect(pressed[0].textContent).toBe('DEF');

    act(() => {
      screen.getByLabelText(FACTIONS.PKB.name).click();
    });
    expect(onChange).toHaveBeenCalledWith('PKB');
  });
});

describe('InfinityAtmosphere', () => {
  afterEach(() => cleanup());

  test('renders only the requested layers and stays decorative', () => {
    const { container } = render(
      <InfinityAtmosphere layers={['stars', 'scan']} />
    );
    const root = container.firstElementChild as HTMLElement;

    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root.className).toContain('infinity-fx');
    expect(root.querySelector('.infinity-fx__scan')).not.toBeNull();
    expect(root.querySelector('.infinity-fx__sparks')).toBeNull();
    expect(root.querySelector('.infinity-fx__rings')).toBeNull();
  });

  test('renders every layer by default', () => {
    const { container } = render(<InfinityAtmosphere />);
    const root = container.firstElementChild as HTMLElement;
    for (const layer of ['sparks', 'scan', 'particles', 'rings', 'scratches']) {
      expect(
        root.querySelector(`.infinity-fx__${layer}`),
        layer
      ).not.toBeNull();
    }
  });
});
