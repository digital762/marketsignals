import type { Keyword } from "./types";

export type TrendShape = "surging" | "rising" | "cooling" | "spiky" | "flat";

const avg = (xs: number[]) => xs.reduce((s, v) => s + v, 0) / Math.max(xs.length, 1);
const stddev = (xs: number[]) => {
  if (xs.length < 2) return 0;
  const m = avg(xs);
  return Math.sqrt(avg(xs.map((v) => (v - m) ** 2)));
};

/**
 * Trend array convention: 12 monthly normalized values, oldest → newest.
 */

export function latestVsPrev(trend: number[]): number {
  const a = trend.at(-2) ?? 0;
  const b = trend.at(-1) ?? 0;
  if (a === 0) return b > 0 ? 1 : 0;
  return (b - a) / a;
}

export function quarterOverQuarter(trend: number[]): number {
  if (trend.length < 6) return 0;
  const recent = avg(trend.slice(-3));
  const prior = avg(trend.slice(-6, -3));
  if (prior === 0) return recent > 0 ? 1 : 0;
  return (recent - prior) / prior;
}

export function peakIndex(trend: number[]): number {
  let idx = 0;
  for (let i = 1; i < trend.length; i++) if (trend[i] > trend[idx]) idx = i;
  return idx;
}

export function monthsSincePeak(trend: number[]): number {
  return trend.length - 1 - peakIndex(trend);
}

export function trendShape(trend: number[]): TrendShape {
  if (trend.length < 6) return "flat";
  const recent3 = avg(trend.slice(-3));
  const prior3 = avg(trend.slice(-6, -3));
  const first3 = avg(trend.slice(0, 3));
  const sd = stddev(trend);

  const peak = Math.max(...trend);
  const last = trend.at(-1) ?? 0;
  const recentIsPeak = last >= peak * 0.95;

  if (recentIsPeak && recent3 > prior3 * 1.15) return "surging";
  if (recent3 > prior3 * 1.15) return "rising";
  if (prior3 > recent3 * 1.15 && first3 > recent3 * 1.15) return "cooling";
  if (sd > 0.25 && !recentIsPeak) return "spiky";
  return "flat";
}

export function basketVolume(keywords: Keyword[]): number {
  return keywords.reduce((s, k) => s + k.volume, 0);
}

/**
 * The strongest MoM observation across the basket (max % uplift between any two
 * consecutive months). Used to reproduce the "+583%" style hero stat.
 */
export function maxMoMInBasket(keywords: Keyword[]): {
  keyword: Keyword;
  pct: number;
  fromMonthIdx: number;
  toMonthIdx: number;
} | null {
  let best: {
    keyword: Keyword;
    pct: number;
    fromMonthIdx: number;
    toMonthIdx: number;
  } | null = null;
  for (const k of keywords) {
    for (let i = 1; i < k.trend.length; i++) {
      const a = k.trend[i - 1];
      const b = k.trend[i];
      if (a === 0) continue;
      const pct = (b - a) / a;
      if (!best || pct > best.pct) {
        best = { keyword: k, pct, fromMonthIdx: i - 1, toMonthIdx: i };
      }
    }
  }
  return best;
}

export function byCategory<T extends Keyword>(keywords: T[]) {
  return keywords.reduce<Record<string, T[]>>((acc, k) => {
    (acc[k.category] ??= []).push(k);
    return acc;
  }, {});
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
  return v.toString();
}

export function formatPct(p: number, opts: { signed?: boolean } = {}): string {
  const sign = opts.signed && p > 0 ? "+" : "";
  const v = Math.round(p * 100);
  return `${sign}${v}%`;
}

export function shapeLabel(shape: TrendShape): string {
  switch (shape) {
    case "surging":
      return "Surging";
    case "rising":
      return "Rising";
    case "cooling":
      return "Cooling";
    case "spiky":
      return "Volatile";
    case "flat":
      return "Stable";
  }
}

export function shapeAccent(
  shape: TrendShape,
): "up" | "down" | "flat" {
  if (shape === "surging" || shape === "rising") return "up";
  if (shape === "cooling") return "down";
  return "flat";
}
