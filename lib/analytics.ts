import type { Keyword, KeywordSnapshot, PeriodComparison, PeriodId, SignalProfile } from "./types";

/**
 * The 24-month array convention used throughout this module:
 *   index 0  = June 2024   (oldest)
 *   index 11 = May 2025    (end of s2025 snapshot)
 *   index 12 = June 2025   (start of s2026 snapshot)
 *   index 23 = May 2026    (newest)
 */
export const MONTH_LABELS_24 = [
  "Jun '24","Jul '24","Aug '24","Sep '24","Oct '24","Nov '24",
  "Dec '24","Jan '25","Feb '25","Mar '25","Apr '25","May '25",
  "Jun '25","Jul '25","Aug '25","Sep '25","Oct '25","Nov '25",
  "Dec '25","Jan '26","Feb '26","Mar '26","Apr '26","May '26",
] as const;

const avg = (xs: number[]) => xs.reduce((s, v) => s + v, 0) / Math.max(xs.length, 1);

/**
 * Convert one Semrush snapshot (12 normalized monthly values + average Nq) into
 * 12 absolute monthly volume estimates. We anchor on Nq, which Semrush defines
 * as the average monthly search volume for the keyword over the window — so:
 *   monthVolume[i] = Nq * Td[i] / mean(Td)
 * After this transform, the array's own mean equals Nq.
 */
function snapshotToMonthly(snap: KeywordSnapshot): number[] {
  const mean = avg(snap.td);
  if (mean === 0) return new Array(12).fill(0);
  return snap.td.map((v) => Math.round((snap.nq * v) / mean));
}

/** 24-month absolute volume series (oldest → newest), Jun 2024 → May 2026. */
export function monthlyVolumes24(k: Keyword): number[] {
  return [...snapshotToMonthly(k.s2025), ...snapshotToMonthly(k.s2026)];
}

interface ComparisonConfig {
  prior: number[];
  current: number[];
  /** Short label used in tight contexts (chip text, column header). */
  label: string;
  /** Full label used in headlines and the calendar card eyebrow. */
  longLabel: string;
  /** Plain-English caption naming exactly what's compared. */
  caption: string;
  /** Whether this is a YoY (vs prior year) or MoM (vs prior month) comparison. */
  kind: "yoy" | "mom";
}

const PERIOD_INDICES: Record<PeriodId, ComparisonConfig> = {
  "jan-feb": {
    prior: [7, 8], current: [19, 20],
    label: "Jan-Feb YoY", longLabel: "Bi-monthly YoY · Jan-Feb",
    caption: "Comparing Jan-Feb 2026 to Jan-Feb 2025",
    kind: "yoy",
  },
  "mar-apr": {
    prior: [9, 10], current: [21, 22],
    label: "Mar-Apr YoY", longLabel: "Bi-monthly YoY · Mar-Apr",
    caption: "Comparing Mar-Apr 2026 to Mar-Apr 2025",
    kind: "yoy",
  },
  "may": {
    prior: [11], current: [23],
    label: "May YoY", longLabel: "Single-month YoY · May",
    caption: "Comparing May 2026 to May 2025",
    kind: "yoy",
  },
  "mom": {
    prior: [22], current: [23],
    label: "Month-on-month", longLabel: "Month-on-month",
    caption: "Comparing May 2026 to April 2026",
    kind: "mom",
  },
};

export const PERIOD_IDS: PeriodId[] = ["jan-feb", "mar-apr", "may", "mom"];

export function comparisonConfig(id: PeriodId): ComparisonConfig {
  return PERIOD_INDICES[id];
}

export function periodComparison(k: Keyword, id: PeriodId): PeriodComparison {
  const series = monthlyVolumes24(k);
  const cfg = PERIOD_INDICES[id];
  const priorAvg = Math.round(avg(cfg.prior.map((i) => series[i])));
  const currentAvg = Math.round(avg(cfg.current.map((i) => series[i])));
  const changePct = priorAvg === 0 ? (currentAvg > 0 ? 1 : 0) : (currentAvg - priorAvg) / priorAvg;
  const sentence = `${cfg.caption}: ${priorAvg.toLocaleString()} → ${currentAvg.toLocaleString()} (${formatPct(changePct, { signed: true })})`;
  return { id, label: cfg.label, priorAvg, currentAvg, changePct, sentence };
}

export function allPeriodComparisons(k: Keyword): PeriodComparison[] {
  return PERIOD_IDS.map((id) => periodComparison(k, id));
}

/**
 * Aggregate a basket of keywords by summing their monthly volumes, then return
 * the same period comparison shape as a single keyword.
 */
export function basketPeriodComparison(ks: Keyword[], id: PeriodId): PeriodComparison {
  const cfg = PERIOD_INDICES[id];
  let priorSum = 0, currentSum = 0;
  for (const k of ks) {
    const series = monthlyVolumes24(k);
    priorSum += avg(cfg.prior.map((i) => series[i]));
    currentSum += avg(cfg.current.map((i) => series[i]));
  }
  const priorAvg = Math.round(priorSum);
  const currentAvg = Math.round(currentSum);
  const changePct = priorAvg === 0 ? (currentAvg > 0 ? 1 : 0) : (currentAvg - priorAvg) / priorAvg;
  const sentence = `${cfg.caption}: ${priorAvg.toLocaleString()} → ${currentAvg.toLocaleString()} (${formatPct(changePct, { signed: true })})`;
  return { id, label: cfg.label, priorAvg, currentAvg, changePct, sentence };
}

/**
 * Classify the overall 24-month series into a broker-readable shape.
 * Used by the trend-label badge that appears alongside each percentage.
 */
export function trendShape24(series24: number[]): import("./types").TrendShape {
  if (series24.length < 12) return "steady";
  const recent6 = avg(series24.slice(-6));
  const prior6 = avg(series24.slice(-12, -6));
  const earliest = avg(series24.slice(0, 6));
  const last = series24.at(-1) ?? 0;
  const peak = Math.max(...series24);
  const m = avg(series24);
  const sd = Math.sqrt(avg(series24.map((v) => (v - m) ** 2)));
  const cv = m > 0 ? sd / m : 0;
  const recentIsPeak = last >= peak * 0.9;

  if (recentIsPeak && recent6 > prior6 * 1.4) return "surging";
  if (recent6 > prior6 * 1.15) return "rising";
  if (prior6 > recent6 * 1.15 && earliest > recent6 * 1.1) return "cooling";
  if (cv > 0.55) return "volatile";
  return "steady";
}

/** Shape applied to a single keyword's 24-month series. */
export function trendShapeOf(k: Keyword): import("./types").TrendShape {
  return trendShape24(monthlyVolumes24(k));
}

/** Volume-weighted aggregate series across a basket — for shape on aggregated views. */
export function basketSeries24(ks: Keyword[]): number[] {
  if (!ks.length) return new Array(24).fill(0);
  const result = new Array(24).fill(0);
  for (const k of ks) {
    const series = monthlyVolumes24(k);
    for (let i = 0; i < 24; i++) result[i] += series[i];
  }
  return result;
}

/** Average monthly searches across the last 3 months. Used as "right now" headline volume. */
export function latestMonthlyVolume(k: Keyword): number {
  return Math.round(snapshotToMonthly(k.s2026)[11]);
}

export function basketLatest(ks: Keyword[]): number {
  return ks.reduce((s, k) => s + latestMonthlyVolume(k), 0);
}

export function filterByProfile(ks: Keyword[], profile: SignalProfile): Keyword[] {
  return ks.filter((k) => k.profiles.includes(profile));
}

export function byGroup<T extends Keyword>(keywords: T[]): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const k of keywords) {
    const g = k.group ?? k.phrase;
    if (!m.has(g)) m.set(g, []);
    m.get(g)!.push(k);
  }
  return m;
}

export function formatVolume(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return v.toLocaleString();
}

export function formatPct(p: number, opts: { signed?: boolean } = {}): string {
  const sign = opts.signed && p > 0 ? "+" : "";
  const v = Math.round(p * 100);
  return `${sign}${v}%`;
}

export type Direction = "up" | "down" | "flat";

export function direction(pct: number): Direction {
  if (pct > 0.05) return "up";
  if (pct < -0.05) return "down";
  return "flat";
}

/** Plain-language label that brokers can read at a glance. */
export function directionWord(d: Direction): string {
  if (d === "up") return "Rising";
  if (d === "down") return "Cooling";
  return "Steady";
}

export function directionColor(d: Direction): string {
  if (d === "up") return "#2C537A";    // brand denim
  if (d === "down") return "#9E6464";  // terracotta
  return "#6B7F89";                    // slate-mute
}

export function shapeLabel(s: import("./types").TrendShape): string {
  switch (s) {
    case "surging": return "Surging";
    case "rising": return "Rising";
    case "cooling": return "Cooling";
    case "volatile": return "Volatile";
    case "steady": return "Steady";
  }
}

/** Salmon for surging (urgency / standout), denim/terracotta otherwise. */
export function shapeAccent(s: import("./types").TrendShape): "up" | "down" | "flat" | "salmon" {
  if (s === "surging") return "salmon";
  if (s === "rising") return "up";
  if (s === "cooling") return "down";
  return "flat";
}

export function shapeColor(s: import("./types").TrendShape): string {
  if (s === "surging") return "#FF787A";
  if (s === "rising") return "#2C537A";
  if (s === "cooling") return "#9E6464";
  return "#6B7F89";
}

/** Pick the single biggest YoY mover from a basket — for hero call-outs. */
export function biggestYoYMover(
  ks: Keyword[],
  periodId: PeriodId = "jan-feb",
): { keyword: Keyword; comparison: PeriodComparison } | null {
  let best: { keyword: Keyword; comparison: PeriodComparison } | null = null;
  for (const k of ks) {
    const cmp = periodComparison(k, periodId);
    if (cmp.priorAvg < 50 && cmp.currentAvg < 50) continue; // skip noise
    if (!best || cmp.changePct > best.comparison.changePct) {
      best = { keyword: k, comparison: cmp };
    }
  }
  return best;
}
