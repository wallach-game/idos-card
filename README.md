# IDOS Card

Lovelace card for Home Assistant that displays public transport connections from the [IDOS API](https://github.com/wallach-game/idos-api).

[![Add to HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=wallach-game&repository=idos-card&category=dashboard)

## Installation

1. Add this repo to HACS as a custom repository:
   - HACS → three dots → Custom repositories
   - URL: `wallach-game/idos-card`, category: **Dashboard**
   - Click Add, then Install

2. Trigger HACS to pick up the new repo:
   - HACS → three dots → **Dismiss new repositories**

3. Find **IDOS Card** in HACS and click **Download**

4. Add the resource manually (HACS v2 does not do this automatically):
   - Settings → Dashboards → three dots → Resources → Add resource
   - URL: `/hacsfiles/idos-card/idos-card.js`
   - Type: **JavaScript module**

5. Reload the browser.

## Public API

A public instance of the IDOS API is available at `https://idos.numerlab.org/api` — no self-hosting required.

**Rate limiting:** 10 requests per 60 seconds per IP. Self-hosted instances have no limit.

**API docs:** `http://YOUR_HOST:8001/docs` — or `https://idos.numerlab.org/docs` on the public instance

## Configuration

```yaml
type: custom:idos-card
api_url: http://YOUR_HOST:8001
from: Praha hl.n.
to: Brno hl.n.
n: 5
```

| Option | Required | Default | Description |
|--------|----------|---------|-------------|
| `api_url` | yes | — | Base URL of the IDOS API container |
| `from` | yes | — | Departure stop name |
| `to` | yes | — | Arrival stop name |
| `n` | no | 3 | Number of connections to show |
| `date` | no | today | Date in IDOS format (e.g. `28.6.2026`) |
| `time` | no | now | Time in `HH:MM` format |

## Examples

Next trains from Prague to Brno (using public API):
```yaml
type: custom:idos-card
api_url: https://idos.numerlab.org/api
from: Praha hl.n.
to: Brno hl.n.
n: 3
```

Morning commute from a specific time (self-hosted):
```yaml
type: custom:idos-card
api_url: http://192.168.1.10:8001
from: Brno hl.n.
to: Praha hl.n.
n: 5
time: "07:00"
```
