# 💸 Kasboekje

Een persoonlijke webapp voor inkomsten, uitgaven en beleggingen — met maandoverzicht,
historie, analytics en een vermogensgroei-projectie. Werkt op desktop, iPad en iPhone,
met automatische dark-mode op basis van je apparaat.

## Tech
- React + Vite
- Plain CSS met design-tokens (auto light/dark via `prefers-color-scheme`)
- Data-opslag: nu localStorage, later Supabase (cross-device + magic-link login)

## Lokaal draaien
```bash
npm install
npm run dev      # http://localhost:5173
```

## Bouwen
```bash
npm run build    # output in dist/
```

## Deploy
Gehost op Netlify. Build-command `npm run build`, publish-map `dist`
(zie `netlify.toml`). Elke push naar GitHub triggert automatisch een nieuwe deploy.

## Structuur
- `src/data/seed.json` — startdata (uit het oorspronkelijke Excel-kasboekje)
- `src/lib/store.jsx` — data-laag (CRUD + opslag)
- `src/lib/analytics.js` — berekeningen voor de analyses
- `src/components/` — schermen: Overview, Historie, Analytics, Beleggen, EntryModal
