/* ==========================================================================
   Infinity City — interaction layer
   - faction theming (whole page re-skins from a single data source)
   - architecture diagram inspector
   ========================================================================== */

(function () {
  const FACTIONS = window.FACTIONS;
  const ORDER = window.FACTION_ORDER;
  const STORAGE_KEY = 'infinity-city:faction';

  /* ------------------------------------------------------------------ *
   * Architecture inspector content
   * ------------------------------------------------------------------ */
  const ARCH = {
    'arch-root': {
      kicker: 'Project',
      title: 'Prometheus Project: Infinity',
      text: 'Экосистема, в которой скиллы образуют динамическую нервную систему: узлы добавляются, переиспользуются и собираются в цепочки под задачу.',
      points: [
        'не команды, а узлы возможностей',
        'цепочки вместо одиночных вызовов',
        'постоянное обновление знаний',
      ],
    },
    'arch-sil': {
      kicker: 'Layer 1',
      title: 'Skill Intelligence Layer',
      text: 'Верхний слой интеллекта: создаёт навыки, индексирует их и автоматически распознаёт момент применения.',
      points: [
        'Skill Creator — генерация новых скиллов',
        'Skill Knowledge Base — RAG-каталог',
        'Skill Trigger — автообнаружение',
      ],
    },
    'arch-creator': {
      kicker: 'System skill',
      title: 'Skill Builder',
      text: 'Создаёт новые скиллы под задачи Prometheus: от анализа требований до регистрации в базе.',
      points: [
        'анализ требований',
        'генерация структуры скилла',
        'описание входов / выходов',
        'интеграция в базу скиллов',
      ],
    },
    'arch-kb': {
      kicker: 'System skill',
      title: 'Skill RAG Analyzer',
      text: '«Мозг» поиска возможностей: сопоставляет запрос с каталогом и предлагает цепочку выполнения.',
      points: [
        'анализ текущего запроса',
        'поиск похожих скиллов',
        'определение компетенций',
        'предложение цепочки',
      ],
    },
    'arch-trigger': {
      kicker: 'System skill',
      title: 'Skill Trigger Detector',
      text: 'Автоматическая активация: определяет тип задачи, контекст проекта и необходимые инструменты.',
      points: ['тип задачи', 'контекст проекта', 'необходимые инструменты'],
    },
    'arch-router': {
      kicker: 'Dispatcher',
      title: 'Skill Router',
      text: 'Выбирает нужный навык, собирает цепочку из веток и передаёт её в runtime.',
      points: [
        'маршрутизация по типу задачи',
        'сборка execution chain',
        'переиспользование существующих узлов',
      ],
    },
    'arch-design': {
      kicker: 'Branch',
      title: 'UI / UX Skills',
      text: 'Design Intelligence: премиальный интерфейс, адаптивность и визуальные системы фракций.',
      points: [
        'Luxury UI Skill',
        'Mobile First · Adaptive Layout',
        'Faction Visual System',
        'Animation System · Design Tokens',
      ],
    },
    'arch-eng': {
      kicker: 'Branch',
      title: 'Engineering Skills',
      text: 'Engineering Intelligence: архитектура, данные, безопасность и развёртывание.',
      points: [
        'Frontend / Backend Architecture',
        'Database Design',
        'Security',
        'Deployment',
      ],
    },
    'arch-agent': {
      kicker: 'Branch',
      title: 'AI Agent Skills',
      text: 'Agent Intelligence: Agent City, роли, память и доступ к инструментам.',
      points: [
        'Agent Creation',
        'Personality Layer · Memory Layer',
        'Tool Access',
        'Multi-Agent Coordination',
      ],
    },
    'arch-core': {
      kicker: 'Runtime',
      title: 'Prometheus Core Runtime',
      text: 'Исполняет цепочку, валидирует результат и возвращает знание обратно в систему.',
      points: ['исполнение цепочек', 'валидация', 'knowledge update'],
    },
    'arch-request': {
      kicker: 'Input',
      title: 'User Request Analysis',
      text: 'Точка входа: намерение пользователя разбирается до задачи, пригодной для триггера.',
      points: ['намерение', 'ограничения', 'желаемый результат'],
    },
    'arch-context': {
      kicker: 'Awareness',
      title: 'Project Context Awareness',
      text: 'Понимание состояния проекта: стек, фракция, предыдущие решения и память сессий.',
      points: ['стек и архитектура', 'память проекта', 'история решений'],
    },
    'arch-tools': {
      kicker: 'External',
      title: 'External Tools',
      text: 'Внешний контур: APIs, репозитории, модели и хранилища как расширения нервной системы.',
      points: ['APIs', 'Repos', 'Models', 'Storage'],
    },
  };

  /* ------------------------------------------------------------------ *
   * Helpers
   * ------------------------------------------------------------------ */
  const el = (tag, className, html) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  };

  const escapeHtml = value =>
    String(value).replace(
      /[&<>"']/g,
      ch =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[ch]
    );

  /* ------------------------------------------------------------------ *
   * Faction cards
   * ------------------------------------------------------------------ */
  function renderFactionCards() {
    const host = document.getElementById('faction-cards');
    if (!host) return;

    ORDER.forEach(code => {
      const f = FACTIONS[code];
      const card = el('article', 'faction');
      card.dataset.factionCard = code;
      card.style.setProperty('--faction-accent', f.accent);
      card.style.setProperty('--faction-ink', '#08070a');
      card.style.setProperty(
        '--faction-wash',
        `radial-gradient(ellipse at 20% -20%, ${f.accent}33, transparent 70%)`
      );

      const swatches = f.colors
        .map(
          c =>
            `<span class="swatch" style="background:${c.hex}" data-role="${escapeHtml(
              c.role
            )}" title="${escapeHtml(c.role)}"></span>`
        )
        .join('');

      const tags = [...f.effects, ...f.ui]
        .slice(0, 6)
        .map(t => `<span class="tag">${escapeHtml(t)}</span>`)
        .join('');

      card.innerHTML = `
        <div class="faction__head">
          <span class="faction__code">${f.code}</span>
          <span class="faction__role">${escapeHtml(f.role)}</span>
        </div>
        <h3>${escapeHtml(f.name)}</h3>
        <p class="faction__concept">${escapeHtml(f.concept)}</p>
        <p class="faction__claim">${escapeHtml(f.claim)}</p>
        <div class="swatches">${swatches}</div>
        <div class="tags">${tags}</div>
        <div class="faction__foot">
          <p class="faction__diff">${escapeHtml(f.difference)}</p>
          <button class="faction__apply" type="button" data-apply="${f.code}">
            Примерить
          </button>
        </div>
      `;

      card.querySelector('[data-apply]').addEventListener('click', e => {
        e.stopPropagation();
        setFaction(code, true);
      });
      card.addEventListener('click', () => setFaction(code, true));

      host.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------ *
   * Faction switching
   * ------------------------------------------------------------------ */
  function setFaction(code, scrollToFactions) {
    if (!FACTIONS[code]) return;

    document.body.dataset.faction = code;
    localStorage.setItem(STORAGE_KEY, code);

    document.querySelectorAll('[data-set-faction]').forEach(btn => {
      const active = btn.dataset.setFaction === code;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    document.querySelectorAll('[data-faction-card]').forEach(card => {
      card.classList.toggle('is-active', card.dataset.factionCard === code);
    });

    document.querySelectorAll('[data-faction-row]').forEach(row => {
      row.style.background =
        row.dataset.factionRow === code ? 'var(--panel-2)' : '';
    });

    document.title = `Infinity City — ${FACTIONS[code].name} · Skill Intelligence Layer`;

    if (scrollToFactions) {
      const target = document.getElementById('faction-cards');
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }

  /* ------------------------------------------------------------------ *
   * Diagram inspector
   * ------------------------------------------------------------------ */
  function initDiagram() {
    const panel = document.getElementById('arch-panel');
    const nodes = Array.from(document.querySelectorAll('[data-info]'));
    if (!panel || !nodes.length) return;

    const show = id => {
      const info = ARCH[id];
      if (!info) return;
      nodes.forEach(n =>
        n.classList.toggle('is-selected', n.dataset.info === id)
      );
      panel.innerHTML = `
        <p class="diagram-panel__kicker">${escapeHtml(info.kicker)}</p>
        <h3 class="diagram-panel__title">${escapeHtml(info.title)}</h3>
        <p class="diagram-panel__text">${escapeHtml(info.text)}</p>
        <ul class="diagram-panel__list">
          ${info.points.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
        </ul>
      `;
    };

    nodes.forEach(node => {
      node.setAttribute('tabindex', '0');
      node.setAttribute('role', 'button');
      node.addEventListener('click', () => show(node.dataset.info));
      node.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          show(node.dataset.info);
        }
      });
    });

    show('arch-sil');
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  function boot() {
    renderFactionCards();
    initDiagram();

    document.querySelectorAll('[data-set-faction]').forEach(btn => {
      btn.addEventListener('click', () =>
        setFaction(btn.dataset.setFaction, false)
      );
    });

    document.querySelectorAll('[data-faction-row]').forEach(row => {
      row.addEventListener('click', () =>
        setFaction(row.dataset.factionRow, true)
      );
    });

    const stored = localStorage.getItem(STORAGE_KEY);
    setFaction(FACTIONS[stored] ? stored : 'INF', false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
