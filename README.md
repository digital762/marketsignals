# Market Signals — Broker Dashboard

Live UAE buyer-demand intelligence for betterhomes brokers. Pulls Google
search-demand from Semrush across five customer profiles and presents
year-on-year comparisons in broker-language.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind
- Lucide icons
- Semrush MCP / Semrush API (Google.ae database)

## Local dev

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Tabs deep-link via URL hash:
`/#renter`, `/#landlord`, `/#seller`, `/#buyer`, `/#investor`.

## Refreshing data

```bash
SEMRUSH_API_KEY=xxxx npm run refresh-data
```

The script makes **two** `phrase_these` calls per seed (display_date
`20260515` and `20250515`) to assemble a 24-month series — that's what
powers the Jan-Feb 2025 vs 2026 / Mar-Apr 25 vs 26 / May this-year
comparisons. It also runs `phrase_all` on four buyer/investor anchor
keywords to compute the foreign-buyer country breakdown.

Edit `SEEDS` in `scripts/refresh-data.ts` to add or retag keywords.

## How the YoY math works

Semrush returns `Nq` (average monthly searches) plus a 12-value
normalized trend (`Td`) ending at `display_date`. We convert each
snapshot's normalized values to absolute monthly volumes via
`Nq × Td[i] / mean(Td)`, then concatenate the two snapshots into a
24-month array (Jun 2024 → May 2026). Period averages are derived from
fixed index slices — see `lib/analytics.ts`.

## Project layout

```
app/
  layout.tsx                Root layout
  page.tsx                  Client tab router (URL hash → view)
  components/               UI primitives + section components
  views/
    OverviewTab.tsx         Default tab — cross-profile view
    ProfileTab.tsx          Generic per-profile renderer
  globals.css               Tailwind + brand layer
lib/
  types.ts                  Keyword, snapshots, period comparisons
  categories.ts             Profile metadata + broker-language copy
  analytics.ts              YoY math, period averaging, formatters
  data/
    keywords.ts             Two-snapshot Semrush dataset
    countries.ts            Foreign-buyer country breakdown
scripts/
  refresh-data.ts           Live refresh from Semrush
tailwind.config.ts          betterhomes brand tokens
```

## Brand

Tokens in `tailwind.config.ts` follow betterhomes 2025 brand guidelines
— Slate blue / Denim / Powder / Sand / Mist palette, with Salmon pink
reserved for urgency call-outs only. Type stack uses Georgia + Segoe UI
(the brand-approved alternatives for internal tools where Ivy Mode/Epic
aren't licensed).
