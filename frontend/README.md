# VigilantGear Frontend (Phase 1)

AI-Powered PPE Compliance Monitoring: React + Vite + Tailwind CSS frontend.

Phase 1 runs entirely in the browser. There is no backend, database or AI model yet.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # unit, component and route tests
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@vigilantgear.com | Admin@123 |
| Safety Manager | manager@vigilantgear.com | Manager@123 |

Public signup always creates a `safety_manager`. Users added from Settings get the temporary password shown in the dialog.

## Images

Add these files (the UI shows a placeholder until they exist):

- `public/images/`: `hero-worker.jpg`, `login-worker.jpg`, `signup-worker.jpg`, `construction-site.jpg`, `live-frame.jpg`
- `public/images/snapshots/`: `snap-1.jpg` to `snap-6.jpg`
- `public/images/thumbs/`: `thumb-1.jpg` to `thumb-3.jpg`

## What is real and what is simulated

| Area | Phase 1 behavior |
|---|---|
| Authentication | Demo only. Users and sessions live in localStorage. |
| Webcam | Real `getUserMedia` feed. Tracks stop on Stop and on leaving the page. |
| Live detection boxes and counters | Simulated demo data drawn on a canvas. |
| Video upload | Real file selection, validation and preview. |
| Video analysis progress | Simulated. |
| Detection Results video | Simulated playback with demo annotations. |
| Charts, tables, filters, sorting, pagination | Real, driven by one shared demo dataset. |
| CSV export | Real. |
| PDF / Excel reports | Simulated. The download is a CSV of the same data. |
| Scheduled report emails, email notifications | Not connected. Preferences are stored locally. |
| Settings | Persisted in localStorage. |

## Structure

```text
app/         page components, one folder per route
components/  reusable UI (common, layout, landing, forms, charts, dashboard, detection, video, violations, reports, settings)
hooks/       shared hooks
lib/         api (mock services), constants, context, data, utils, validators
tests/       unit, components, integration
```

Imports use the `@/` alias, which points to this folder.

## Connecting a backend later

Set `VITE_API_BASE_URL` (see `.env.example`). The mock services in `lib/api/` are the single place to replace with real requests through `lib/api/httpClient.js`.