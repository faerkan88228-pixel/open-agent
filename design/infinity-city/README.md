# Prometheus Project: Infinity — Skill Intelligence Layer

Статический визуальный слой проекта: архитектура системы скиллов и визуальная карта
шести фракций Infinity City. Никаких зависимостей, сборки и фреймворков — чистые
HTML / CSS / JS, чтобы файл можно было открыть где угодно и встроить в любое приложение.

```sh
# локальный предпросмотр
cd design/infinity-city
python3 -m http.server 4173 --bind 0.0.0.0
# → http://localhost:4173
```

## Продуктовый пакет

Данные фракций живут в монорепо как `@afk/theme-infinity`
(`packages/common/infinity`): токены `--infinity-*`, CSS-атмосфера,
`InfinityThemeProvider` (React, `data-infinity-faction` + persist),
`InfinityAtmosphere`, `FactionSwitcher`, `FactionSwatch`.

```tsx
import '@afk/theme-infinity/style.css';
import { InfinityThemeProvider, useInfinityTheme } from '@afk/theme-infinity';

<InfinityThemeProvider>…</InfinityThemeProvider>;

const { code, setFaction, faction } = useInfinityTheme();
```

Страница-витрина ниже импортировать TypeScript не может, поэтому её данные
генерируются из того же источника:

```sh
node --experimental-strip-types design/infinity-city/generate-tokens.mjs
```

## Что внутри

| Файл          | Роль                                                                                    |
| ------------- | --------------------------------------------------------------------------------------- |
| `index.html`  | Разметка: hero, схема Skill Intelligence Layer, системные скиллы, ветки, поток, фракции |
| `styles.css`  | Дизайн-токены и шесть фракционных тем (переключение через `body[data-faction]`)         |
| `factions.js` | Данные фракций — единственный источник правды (идеология, палитра, эффекты, UI)         |
| `app.js`      | Интерактив: переключение фракции, инспектор узлов схемы                                 |
| `tokens.json` | Экспорт фракционных токенов для других приложений / генераторов тем                     |

## Архитектура скиллов

```
Prometheus Project: Infinity
        │
Skill Intelligence Layer
        ├── Skill Creator          (создание новых скиллов)
        ├── Skill Knowledge Base   (RAG / каталог возможностей)
        └── Skill Trigger          (автообнаружение)
        │
Skill Router / Dispatcher      (выбор навыка, сборка цепочки)
        ├── UI/UX Skills
        ├── Engineering Skills
        └── AI Agent Skills
        │
Prometheus Core Runtime
        ├── User Request Analysis
        ├── Project Context Awareness
        └── External Tools (APIs / Repos / Models / Storage)
```

Системные скиллы, на которых держится среда:

1. **Skill Builder** — анализ требований, генерация структуры скилла, описание
   входов/выходов, интеграция в базу.
2. **Skill RAG Analyzer** — «мозг» поиска возможностей: сопоставляет запрос с
   каталогом и предлагает цепочку.
3. **Skill Trigger Detector** — определяет тип задачи, контекст проекта и
   необходимые инструменты.

Поток выполнения: `User Request → Context Analyzer → Skill Trigger → RAG Skill Search
→ Skill Router → Execution Chain → Validation → Result → Knowledge Update`.

Ключевой принцип: скиллы — не отдельные команды, а динамическая нервная система.
Новые возможности добавляются как узлы, старые переиспользуются, сложные задачи
собираются из цепочек.

## Фракции

| Код   | Фракция                       | Идея          | Ощущение             | Роль в системе            |
| ----- | ----------------------------- | ------------- | -------------------- | ------------------------- |
| `INF` | Нация «Инфинити»              | Бесконечность | Космическая роскошь  | Центр вселенной           |
| `PRM` | Корпорация «Прометей»         | Создание      | Корпоративный огонь  | Двигатель развития        |
| `DEF` | Корпус «Стражи Бесконечности» | Защита        | Военный sci-fi       | Защитный контур           |
| `UNT` | Академия «Юнити»              | Знания        | Научная технология   | Интеллект цивилизации     |
| `EQB` | Орден «Эквилибриум»           | Баланс        | Мистический космос   | Баланс системы            |
| `PKB` | Клан «Острые Козырьки»        | Свобода       | Киберпанк-андеграунд | Независимая сила в городе |

Каждая фракция — не тема, а идеология: собственная палитра с семантикой цвета,
типографика, геометрия (радиусы, сетка), атмосферные эффекты и правила UI.
Применение темы меняет весь интерфейс: фон, акценты, шрифт заголовков, форму
карточек и слой эффектов (звёздная пыль, искры реактора, сканирующая линия,
цифровые частицы, энергетические кольца, металлические царапины).

### Токены

Фракция задаёт CSS-переменные на `body[data-faction]`:

```
--bg --bg-2 --bg-3 --panel --panel-2 --panel-solid
--line --line-soft --ink --ink-dim --ink-faint
--accent --accent-2 --accent-3 --accent-ink --glow
--radius --radius-sm --font-display
--stars --grid --sparks --scan --particles --rings --scratches --grain
```

Плотностные переменные (`--stars`, `--grid`, `--sparks`, `--scan`, …) — это
интенсивности атмосферных слоёв от 0 до 1: одна и та же вёрстка, разная физика
пространства. Для интерфейса приложения те же значения можно брать из
`tokens.json`.

## Доступность и адаптивность

- Схема и карточки доступны с клавиатуры (`tabindex`, `Enter` / `Space`).
- Семантика: `table` для матрицы фракций, `ol` для потока, `dl` для метрик.
- Мобильная вёрстка: 1–3 колонки, схема перестраивается в линейную цепочку.
- `prefers-reduced-motion` отключает анимации и гладкий скролл.
