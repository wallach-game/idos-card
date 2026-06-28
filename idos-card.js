function parseDelayMins(delays) {
  for (const d of delays) {
    const m = d.match(/(\d+)\s*min/);
    if (m) return parseInt(m[1]);
  }
  return 0;
}

function addMins(time, mins) {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

const TYPE_ICON = {
  'vlak': '🚆', 'train': '🚆',
  'autobus': '🚌', 'bus': '🚌',
  'metro': '🚇',
  'tramvaj': '🚋', 'tram': '🚋',
  'trolejbus': '🚎',
  'loď': '⛴️',
  'letadlo': '✈️',
};

function typeIcon(type) {
  const t = type.toLowerCase();
  for (const [key, icon] of Object.entries(TYPE_ICON)) {
    if (t.includes(key)) return icon;
  }
  return '🚌';
}

class IdosCard extends HTMLElement {
  setConfig(config) {
    if (!config.api_url) throw new Error('api_url is required');
    if (!config.from || !config.to) throw new Error('from and to are required');
    this.config = config;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this._fetch();
  }

  set hass(_) {}

  async _fetch() {
    const { api_url, from, to, n = 3, date = '', time = '' } = this.config;
    const params = new URLSearchParams({ from_stop: from, to_stop: to, n, date, time });
    try {
      const res = await fetch(`${api_url}/search?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this._render(await res.json());
    } catch (e) {
      this.shadowRoot.innerHTML = `
        <style>ha-card{display:block}</style>
        <ha-card><div style="padding:16px;color:var(--error-color,#f44)">IDOS API unavailable: ${e.message}</div></ha-card>`;
    }
  }

  _render(data) {
    const cards = data.connections.map(c => {
      const delay = parseDelayMins(c.delays);
      const realTime = delay > 0 ? addMins(c.dep_time, delay) : null;
      const delayBadge = delay > 0
        ? `<span class="badge late">+${delay} min</span>`
        : `<span class="badge ok">včas</span>`;

      const legs = (c.legs || []).map(l => `
        <span class="leg">${typeIcon(l.type)} ${l.name}</span>
      `).join('<span class="sep">→</span>');

      return `
        <div class="conn">
          <div class="times">
            <span class="planned ${delay > 0 ? 'struck' : ''}">${c.dep_time}</span>
            ${realTime ? `<span class="real">${realTime}</span>` : ''}
            ${delayBadge}
            <span class="dur">${c.duration}</span>
          </div>
          ${legs ? `<div class="legs">${legs}</div>` : ''}
        </div>`;
    }).join('');

    this.shadowRoot.innerHTML = `
      <style>
        ha-card { display: block; }
        .header { padding: 16px 16px 8px; font-weight: 500; font-size: 1em; color: var(--secondary-text-color); }
        .conn {
          margin: 8px 12px;
          padding: 12px 16px;
          border-radius: 12px;
          background: var(--card-background-color, #1e1e1e);
          border: 1px solid var(--divider-color, #333);
        }
        .times { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .planned { font-size: 1.6em; font-weight: bold; }
        .planned.struck { text-decoration: line-through; color: var(--secondary-text-color); font-size: 1.2em; }
        .real { font-size: 1.6em; font-weight: bold; color: var(--error-color, #f44); }
        .badge { font-size: 0.75em; padding: 2px 8px; border-radius: 99px; font-weight: 600; }
        .badge.ok { background: var(--success-color, #4caf50); color: #fff; }
        .badge.late { background: var(--error-color, #f44); color: #fff; }
        .dur { font-size: 0.85em; color: var(--secondary-text-color); margin-left: auto; }
        .legs { margin-top: 8px; display: flex; flex-wrap: wrap; align-items: center; gap: 4px; font-size: 0.8em; color: var(--secondary-text-color); }
        .leg { background: var(--secondary-background-color, #2a2a2a); padding: 2px 8px; border-radius: 99px; }
        .sep { opacity: 0.5; }
      </style>
      <ha-card>
        <div class="header">${data.from} → ${data.to}</div>
        ${cards}
        <div style="height:8px"></div>
      </ha-card>`;
  }

  getCardSize() { return (this.config?.n || 3) + 1; }
}

customElements.define('idos-card', IdosCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'idos-card', name: 'IDOS Card', description: 'Displays connections from the IDOS API' });
