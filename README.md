# IDOS Card

Lovelace card for Home Assistant that displays public transport connections from the [IDOS API](https://github.com/wallach-game/idos-api).

[![Add to HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=wallach-game&repository=idos-card&category=dashboard)

## Installation

1. Add this repo to HACS as a custom repository:
   - HACS → three dots → Custom repositories
   - URL: `wallach-game/idos-card`, category: **Dashboard**
   - Click Add, then Install

2. Add the resource manually (HACS v2 does not do this automatically):
   - Settings → Dashboards → three dots → Resources → Add resource
   - URL: `/hacsfiles/idos-card/idos-card.js`
   - Type: **JavaScript module**

3. Reload the browser.

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

Next trains from Prague to Brno:
```yaml
type: custom:idos-card
api_url: http://192.168.1.10:8001
from: Praha hl.n.
to: Brno hl.n.
n: 3
```

Morning commute from a specific time:
```yaml
type: custom:idos-card
api_url: http://192.168.1.10:8001
from: Brno hl.n.
to: Praha hl.n.
n: 5
time: "07:00"
```
