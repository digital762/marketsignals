# Market Signals — Agent Dashboard

Live UAE buyer-demand intelligence for bhomes agents. Pulls keyword search-volume
and 12-month trend data from Semrush (Google.ae) and presents it in a scannable
agent-facing layout with auto-generated talking points.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Lucide icons, custom SVG sparklines

## Local dev

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Refreshing data

The dashboard reads from `lib/data/keywords.ts` — a committed snapshot of
Semrush data. To refresh:

```bash
SEMRUSH_API_KEY=xxxx npm run refresh-data
```

This calls Semrush's `phrase_these` report for all seeds defined in
`scripts/refresh-data.ts` and rewrites the data file. Add or remove keywords
in `SEEDS` to grow the dataset.

Until the Semrush API key is wired up, the included snapshot is from 2026-05-21
and can be updated by editing `lib/data/keywords.ts` directly with new CSV
exports from the Semrush UI.

## Project layout

```
app/
  layout.tsx          Root layout + fonts
  page.tsx            Single-page dashboard
  components/         Section components (server unless marked client)
  globals.css         Tailwind layer + tokens
lib/
  types.ts            Shared types
  categories.ts       Section metadata + agent lens copy
  analytics.ts        Pure functions: MoM, QoQ, peak, trend shape
  data/keywords.ts    Semrush snapshot
scripts/
  refresh-data.ts     Pull from Semrush API, rewrite snapshot
tailwind.config.ts    Brand tokens
```

## Brand tokens

Defined in `tailwind.config.ts`. Cream/ink/gold/signal palettes match the
presentation deck aesthetic. Swap the tokens to align with the formal brand
guidelines once provided.
