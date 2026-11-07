/**
 * Infinity City — faction visual systems
 *
 * Single source of truth for the six Infinity City factions. A faction is not a
 * colour theme: it carries an ideology, a palette with meaning attached to every
 * swatch, a typographic voice, a geometry (radii, grid) and a set of atmosphere
 * intensities that the CSS layer turns into effects.
 *
 * The same data drives:
 *   - `style.css` token blocks (`body[data-infinity-faction="…"]`)
 *   - the `InfinityThemeProvider` runtime switcher
 *   - `design/infinity-city/tokens.json` (design showcase export)
 */

export type FactionCode = 'INF' | 'PRM' | 'DEF' | 'UNT' | 'EQB' | 'PKB';

export interface FactionColor {
  /** hex colour, e.g. `#d4af5f` */
  hex: string;
  /** what the colour means inside the faction */
  role: string;
}

/**
 * Atmosphere intensities, all `0 … 1`. They let one layout host six different
 * "physics of space": the same card can sit in stardust, reactor sparks or a
 * scanning beam curtain.
 */
export interface FactionAtmosphere {
  /** star dust density (INF, EQB) */
  stars: number;
  /** technical grid density (PRM, DEF, UNT) */
  grid: number;
  /** rising reactor sparks (PRM) */
  sparks: number;
  /** scanning line sweep (DEF) */
  scan: number;
  /** floating digital particles (UNT) */
  particles: number;
  /** energy rings (EQB) */
  rings: number;
  /** scratched metal texture (PKB) */
  scratches: number;
  /** film grain */
  grain: number;
}

export interface FactionTypography {
  /** display font stack for headings */
  display: string;
  /** body copy stack */
  body: string;
  /** technical / numeric stack */
  mono: string;
}

export interface FactionGeometry {
  /** large surface radius, px */
  radius: number;
  /** small surface radius, px */
  radiusSm: number;
  /** base layout grid step, px */
  gridStep: number;
  /** how much the surfaces lift on hover, px */
  lift: number;
}

export interface Faction {
  code: FactionCode;
  /** full faction name */
  name: string;
  /** one-line ideology */
  concept: string;
  /** role inside the Infinity City system */
  role: string;
  /** what the faction feels like */
  feeling: string;
  /** faction motto */
  claim: string;
  /** what makes this faction different from the other five */
  difference: string;
  /** background description */
  background: string[];
  /** palette; index 0 is the base surface, 1 the brand accent */
  colors: FactionColor[];
  /** accent used for interactive elements and focus rings */
  accent: string;
  /** text colour placed on top of `accent` */
  accentInk: string;
  /** atmosphere */
  atmosphere: FactionAtmosphere;
  /** typography */
  typography: FactionTypography;
  /** geometry */
  geometry: FactionGeometry;
  /** atmospheric effects list (for menus, docs, previews) */
  effects: string[];
  /** UI rules list */
  ui: string[];
  /** optional symbol description */
  symbol?: string;
}

const SANS = "'Inter', system-ui, -apple-system, sans-serif";
const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
const MONO = "'IBM Plex Mono', ui-monospace, monospace";

export const FACTIONS: Record<FactionCode, Faction> = {
  INF: {
    code: 'INF',
    name: 'Нация «Инфинити»',
    concept: 'Космос · бесконечность · высшая цивилизация · масштаб',
    role: 'Центр вселенной',
    feeling: 'Космическая роскошь',
    claim: '«Я являюсь частью огромной вселенной, но имею своё место в ней»',
    difference:
      'Самый нейтральный и статусный стиль. Не агрессивный, не военный, не корпоративный — это центр всей системы.',
    background: [
      'глубокий чёрный космос',
      'звёздная пыль',
      'мягкие тёмные градиенты',
      'ощущение безграничного пространства',
    ],
    colors: [
      { hex: '#050508', role: 'бесконечность, неизвестность' },
      { hex: '#d4af5f', role: 'ценность, статус, элитарность' },
      { hex: '#f2f0ea', role: 'чистота информации' },
      { hex: '#e07a2f', role: 'энергия' },
      { hex: '#9aa3ad', role: 'технологии' },
    ],
    accent: '#d4af5f',
    accentInk: '#100c04',
    atmosphere: {
      stars: 0.55,
      grid: 0.16,
      sparks: 0,
      scan: 0,
      particles: 0,
      rings: 0,
      scratches: 0,
      grain: 0.05,
    },
    typography: { display: SERIF, body: SANS, mono: MONO },
    geometry: { radius: 18, radiusSm: 12, gridStep: 92, lift: 3 },
    effects: [
      'тонкие золотые линии',
      'стеклянные панели',
      'светящиеся контуры',
      'звёздная пыль',
    ],
    ui: [
      'минималистичные премиальные карточки',
      'glassmorphism',
      'воздух и тишина',
    ],
  },

  PRM: {
    code: 'PRM',
    name: 'Корпорация «Прометей»',
    concept: 'Технологическая империя · энергия · производство · власть',
    role: 'Двигатель развития',
    feeling: 'Корпоративный огонь',
    claim: '«Мы создаём будущее своими руками»',
    difference:
      'Самый «тяжёлый» и энергетический стиль. Если INF — космос, то PRM — двигатель, который этот космос покоряет.',
    background: [
      'тёмный бордовый',
      'плавный переход в чёрный',
      'глубокие угольные оттенки',
    ],
    colors: [
      { hex: '#2a0a10', role: 'власть, корпоративность' },
      { hex: '#ff5a1f', role: 'энергия, реактор, инновации' },
      { hex: '#b87333', role: 'инженерное наследие' },
      { hex: '#fff5ef', role: 'белый текст' },
      { hex: '#8c1d2a', role: 'тёмное бордо' },
    ],
    accent: '#ff5a1f',
    accentInk: '#170402',
    atmosphere: {
      stars: 0.12,
      grid: 0.3,
      sparks: 1,
      scan: 0,
      particles: 0,
      rings: 0,
      scratches: 0,
      grain: 0.07,
    },
    typography: { display: SANS, body: SANS, mono: MONO },
    geometry: { radius: 8, radiusSm: 6, gridStep: 76, lift: 2 },
    effects: [
      'искры огня снизу экрана',
      'движение вверх',
      'свечение реактора',
      'металлические поверхности',
    ],
    ui: [
      'строгая корпоративная сетка',
      'технические панели',
      'HUD-элементы',
      'индустриальные акценты',
    ],
  },

  DEF: {
    code: 'DEF',
    name: 'Корпус «Стражи Бесконечности»',
    concept: 'Защита · порядок · безопасность · сила',
    role: 'Защитный контур',
    feeling: 'Военный sci-fi',
    claim: '«Мы стоим между цивилизацией и хаосом»',
    difference:
      'Самый функциональный и защищённый стиль. Меньше роскоши, больше надёжности.',
    background: ['графитовый', 'тёмно-синий', 'металлические оттенки'],
    colors: [
      { hex: '#0d1420', role: 'сила' },
      { hex: '#4fc3f7', role: 'технологии' },
      { hex: '#c3ccd6', role: 'сталь, дисциплина' },
      { hex: '#2f6ea8', role: 'контроль' },
      { hex: '#101820', role: 'графит' },
    ],
    accent: '#4fc3f7',
    accentInk: '#03121c',
    atmosphere: {
      stars: 0.18,
      grid: 0.42,
      sparks: 0,
      scan: 1,
      particles: 0,
      rings: 0,
      scratches: 0,
      grain: 0.04,
    },
    typography: { display: MONO, body: SANS, mono: MONO },
    geometry: { radius: 3, radiusSm: 2, gridStep: 64, lift: 0 },
    effects: [
      'броня',
      'энергетические щиты',
      'голографические интерфейсы',
      'сканирование объектов',
    ],
    ui: ['военная точность', 'симметрия', 'чёткие границы', 'защитные рамки'],
  },

  UNT: {
    code: 'UNT',
    name: 'Академия «Юнити»',
    concept: 'Знания · обучение · исследования · развитие сознания',
    role: 'Интеллект цивилизации',
    feeling: 'Научная технология',
    claim: '«Знание — это главный ресурс цивилизации»',
    difference:
      'Самый интеллектуальный и «живой» стиль. В отличие от PRM, который создаёт технологии, UNT изучает их.',
    background: ['чёрный', 'тёмно-зелёные градиенты'],
    colors: [
      { hex: '#04120f', role: 'глубина' },
      { hex: '#1de9b6', role: 'неоновый бирюзовый' },
      { hex: '#38b6ff', role: 'голубой' },
      { hex: '#eefaf6', role: 'белый' },
      { hex: '#0b3d33', role: 'тёмно-зелёный' },
    ],
    accent: '#1de9b6',
    accentInk: '#02110d',
    atmosphere: {
      stars: 0.22,
      grid: 0.34,
      sparks: 0,
      scan: 0,
      particles: 1,
      rings: 0,
      scratches: 0,
      grain: 0.05,
    },
    typography: { display: SANS, body: SANS, mono: MONO },
    geometry: { radius: 16, radiusSm: 10, gridStep: 88, lift: 3 },
    effects: [
      'цифровые частицы',
      'энергетические схемы',
      'голограммы',
      'нейронные структуры',
    ],
    ui: [
      'чистые научные интерфейсы',
      'лабораторная эстетика',
      'прозрачные панели',
      'интерактивные диаграммы',
    ],
  },

  EQB: {
    code: 'EQB',
    name: 'Орден «Эквилибриум»',
    concept: 'Баланс · гармония · философия · управление силами',
    role: 'Баланс системы',
    feeling: 'Мистический космос',
    claim: '«Сила существует только в равновесии»',
    difference: 'Самый философский и загадочный стиль.',
    background: ['тёмно-звёздный синий', 'космическая глубина'],
    colors: [
      { hex: '#050b1e', role: 'космическая глубина' },
      { hex: '#39ff88', role: 'жизнь, баланс' },
      { hex: '#a25bff', role: 'сознание, энергия' },
      { hex: '#f4f6ff', role: 'белый' },
      { hex: '#122346', role: 'тёмно-звёздный синий' },
    ],
    accent: '#39ff88',
    accentInk: '#04120a',
    atmosphere: {
      stars: 0.75,
      grid: 0.1,
      sparks: 0,
      scan: 0,
      particles: 0,
      rings: 1,
      scratches: 0,
      grain: 0.05,
    },
    typography: { display: SERIF, body: SANS, mono: MONO },
    geometry: { radius: 26, radiusSm: 16, gridStep: 120, lift: 3 },
    effects: ['мягкое свечение', 'энергетические кольца', 'симметрия'],
    ui: ['мистический sci-fi', 'плавные формы', 'баланс света и тени'],
    symbol: 'Щит, разделённый на 3 части: разум · энергия · материя',
  },

  PKB: {
    code: 'PKB',
    name: 'Клан «Острые Козырьки»',
    concept: 'Свобода · улица · репутация · характер',
    role: 'Независимая сила внутри города',
    feeling: 'Киберпанк-андеграунд',
    claim: '«Мы не принадлежим системе — мы создаём свои правила»',
    difference:
      'Самый индивидуалистичный стиль. Если остальные фракции строят цивилизацию, PKB живёт внутри неё по своим законам.',
    background: ['глубокий чёрный', 'угольные текстуры'],
    colors: [
      { hex: '#0a0908', role: 'глубокий чёрный' },
      { hex: '#d9a441', role: 'золото' },
      { hex: '#7c1120', role: 'тёмный crimson' },
      { hex: '#8a5a34', role: 'ржавый металл' },
      { hex: '#f0ece4', role: 'белый' },
    ],
    accent: '#d9a441',
    accentInk: '#120d05',
    atmosphere: {
      stars: 0.05,
      grid: 0.08,
      sparks: 0,
      scan: 0,
      particles: 0,
      rings: 0,
      scratches: 1,
      grain: 0.11,
    },
    typography: { display: SERIF, body: SANS, mono: MONO },
    geometry: { radius: 4, radiusSm: 3, gridStep: 72, lift: 2 },
    effects: ['металл', 'царапины', 'дым', 'городская атмосфера'],
    ui: [
      'грубые текстуры',
      'контрастные элементы',
      'премиальный street style',
      'винтаж + киберпанк',
    ],
  },
};

/** Display order — INF first, as the centre of the system. */
export const FACTION_ORDER: FactionCode[] = [
  'INF',
  'PRM',
  'DEF',
  'UNT',
  'EQB',
  'PKB',
];

export const DEFAULT_FACTION: FactionCode = 'INF';

export const FACTION_STORAGE_KEY = 'affinity:infinity-faction';

export const isFactionCode = (value: unknown): value is FactionCode =>
  typeof value === 'string' && FACTION_ORDER.includes(value as FactionCode);

export const getFaction = (code: FactionCode): Faction => FACTIONS[code];

/** Short summary used by pickers and menus. */
export const getFactionSummary = (
  code: FactionCode
): Pick<
  Faction,
  'code' | 'name' | 'concept' | 'role' | 'feeling' | 'accent'
> => {
  const { name, concept, role, feeling, accent } = FACTIONS[code];
  return { code, name, concept, role, feeling, accent };
};

const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.replace('#', '');
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map(ch => ch + ch)
          .join('')
      : normalized;
  const int = Number.parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

/** `rgba` string from a faction palette colour — handy for glows and overlays. */
export const withAlpha = (hex: string, alpha: number): string => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * CSS custom properties applied for a faction. The CSS file declares the same
 * values, so the theme works without JS; the provider only needs to write these
 * when the faction is switched at runtime or when a caller overrides a token.
 *
 * Plain string map — no DOM dependency, safe to use in tests and on the server.
 */
export const factionToCssVars = (code: FactionCode): Record<string, string> => {
  const faction = FACTIONS[code];
  const [base] = faction.colors;

  return {
    '--infinity-faction': faction.code,
    '--infinity-accent': faction.accent,
    '--infinity-accent-ink': faction.accentInk,
    '--infinity-accent-soft': withAlpha(faction.accent, 0.12),
    '--infinity-accent-glow': withAlpha(faction.accent, 0.3),
    '--infinity-surface': base.hex,
    '--infinity-font-display': faction.typography.display,
    '--infinity-font-body': faction.typography.body,
    '--infinity-font-mono': faction.typography.mono,
    '--infinity-radius': `${faction.geometry.radius}px`,
    '--infinity-radius-sm': `${faction.geometry.radiusSm}px`,
    '--infinity-grid-step': `${faction.geometry.gridStep}px`,
    '--infinity-lift': `${faction.geometry.lift}px`,
    '--infinity-stars': String(faction.atmosphere.stars),
    '--infinity-grid': String(faction.atmosphere.grid),
    '--infinity-sparks': String(faction.atmosphere.sparks),
    '--infinity-scan': String(faction.atmosphere.scan),
    '--infinity-particles': String(faction.atmosphere.particles),
    '--infinity-rings': String(faction.atmosphere.rings),
    '--infinity-scratches': String(faction.atmosphere.scratches),
    '--infinity-grain': String(faction.atmosphere.grain),
  };
};
