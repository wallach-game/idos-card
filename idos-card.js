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
      this._render(await res.json());
    } catch (e) {
      this.shadowRoot.innerHTML = `<ha-card><div class="card-content">IDOS API unreachable: ${e.message}</div></ha-card>`;
    }
  }

  _render(data) {
    const rows = data.connections.map(c => `
      <tr>
        <td class="time">${c.departure}</td>
        <td class="dur">${c.duration}</td>
        <td class="delay">${c.delays.join(' · ') || '—'}</td>
      </tr>
    `).join('');

    this.shadowRoot.innerHTML = `
      <style>
        ha-card { padding: 0; }
        .header { padding: 16px 16px 8px; font-size: 1.1em; font-weight: 500; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 6px 16px; border-top: 1px solid var(--divider-color); font-size: 0.9em; }
        .time { font-weight: bold; white-space: nowrap; }
        .dur { color: var(--secondary-text-color); white-space: nowrap; }
        .delay { color: var(--secondary-text-color); font-size: 0.8em; }
      </style>
      <ha-card>
        <div class="header">${data.from} → ${data.to}</div>
        <table><tbody>${rows}</tbody></table>
      </ha-card>
    `;
  }

  getCardSize() { return (this.config?.n || 3) + 1; }
}

customElements.define('idos-card', IdosCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'idos-card', name: 'IDOS Card', description: 'Displays connections from the IDOS API' });
