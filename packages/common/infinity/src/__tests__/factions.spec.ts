/**
 * @vitest-environment happy-dom
 */
import { describe, expect, test } from 'vitest';

import {
  DEFAULT_FACTION,
  FACTION_ORDER,
  FACTIONS,
  factionToCssVars,
  getFactionSummary,
  isFactionCode,
  withAlpha,
} from '..';

describe('infinity factions', () => {
  test('ships all six factions in display order', () => {
    expect(FACTION_ORDER).toHaveLength(6);
    expect(FACTION_ORDER).toEqual(['INF', 'PRM', 'DEF', 'UNT', 'EQB', 'PKB']);
    for (const code of FACTION_ORDER) {
      expect(FACTIONS[code].code).toBe(code);
    }
  });

  test('every faction is a complete identity, not just a palette', () => {
    for (const code of FACTION_ORDER) {
      const faction = FACTIONS[code];
      expect(faction.name.length).toBeGreaterThan(0);
      expect(faction.concept.length).toBeGreaterThan(0);
      expect(faction.claim.length).toBeGreaterThan(0);
      expect(faction.difference.length).toBeGreaterThan(0);
      expect(faction.colors.length).toBeGreaterThanOrEqual(5);
      expect(faction.effects.length).toBeGreaterThan(0);
      expect(faction.ui.length).toBeGreaterThan(0);
      // every swatch carries its meaning
      for (const color of faction.colors) {
        expect(color.hex).toMatch(/^#[0-9a-f]{6}$/i);
        expect(color.role.length).toBeGreaterThan(0);
      }
    }
  });

  test('atmosphere intensities stay within 0…1', () => {
    for (const code of FACTION_ORDER) {
      for (const [layer, value] of Object.entries(FACTIONS[code].atmosphere)) {
        expect(value, `${code}.${layer}`).toBeGreaterThanOrEqual(0);
        expect(value, `${code}.${layer}`).toBeLessThanOrEqual(1);
      }
    }
  });

  test('each faction has a distinct atmospheric signature', () => {
    const signatures = FACTION_ORDER.map(code => {
      const atmosphere = FACTIONS[code].atmosphere;
      return Object.entries(atmosphere)
        .filter(([, value]) => value > 0)
        .map(([layer]) => layer)
        .join('+');
    });
    expect(new Set(signatures).size).toBe(FACTION_ORDER.length);
  });

  test('accents are unique', () => {
    const accents = FACTION_ORDER.map(code => FACTIONS[code].accent);
    expect(new Set(accents).size).toBe(FACTION_ORDER.length);
  });

  test('default faction is valid', () => {
    expect(isFactionCode(DEFAULT_FACTION)).toBe(true);
    expect(isFactionCode('XXX')).toBe(false);
    expect(isFactionCode(null)).toBe(false);
  });

  test('css vars expose every token the stylesheet consumes', () => {
    const vars = factionToCssVars('DEF');
    expect(vars['--infinity-faction']).toBe('DEF');
    expect(vars['--infinity-accent']).toBe('#4fc3f7');
    expect(vars['--infinity-radius']).toBe('3px');
    expect(vars['--infinity-scan']).toBe('1');
    for (const name of [
      '--infinity-stars',
      '--infinity-grid',
      '--infinity-grain',
    ]) {
      expect(vars[name]).toBeDefined();
    }
  });

  test('withAlpha converts hex to rgba', () => {
    expect(withAlpha('#ff5a1f', 0.5)).toBe('rgba(255, 90, 31, 0.5)');
    expect(withAlpha('#fff', 1)).toBe('rgba(255, 255, 255, 1)');
  });

  test('summary keeps the picker contract', () => {
    const summary = getFactionSummary('PKB');
    expect(summary).toMatchObject({
      code: 'PKB',
      accent: '#d9a441',
      role: 'Независимая сила внутри города',
      feeling: 'Киберпанк-андеграунд',
    });
  });
});
