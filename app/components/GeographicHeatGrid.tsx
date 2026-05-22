"use client";

import { useState } from "react";
import type { Keyword, PeriodId } from "@/lib/types";
import {
  basketPeriodComparison,
  basketSeries24,
  direction,
  directionColor,
  formatPct,
  formatVolume,
  monthlyVolumes24,
  shapeColor,
  trendShape24,
} from "@/lib/analytics";
import { DUBAI_AREA_GROUPS } from "@/lib/data/keywords";
import { AREA_SALES_NOTES } from "@/lib/data/sales-notes";
import { SalesCallout } from "./SalesCallout";
import { Sparkline } from "./Sparkline";
import { TimeFilter } from "./TimeFilter";
import { TrendBadge } from "./TrendBadge";

interface GeographicHeatGridProps {
  keywords: Keyword[];
}

export function GeographicHeatGrid({ keywords }: GeographicHeatGridProps) {
  const [period, setPeriod] = useState<PeriodId>("mom");

  const groups = DUBAI_AREA_GROUPS.map((group) => {
    const ks = keywords.filter((k) => k.group === group);
    if (!ks.length) return null;
    const total = ks.reduce((s, k) => s + (monthlyVolumes24(k).at(-1) ?? 0), 0);
    const cmp = basketPeriodComparison(ks, period);
    const series = basketSeries24(ks);
    const shape = trendShape24(series);
    const top = [...ks].sort(
      (a, b) => (monthlyVolumes24(b).at(-1) ?? 0) - (monthlyVolumes24(a).at(-1) ?? 0),
    )[0];
    return { group, total, cmp, series, shape, top };
  })
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .sort((a, b) => b.total - a.total);

  return (
    <div>
      <TimeFilter active={period} onChange={setPeriod} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((g) => {
          const d = direction(g.cmp.changePct);
          const stroke = shapeColor(g.shape);
          return (
            <div key={g.group} className="card-tight">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-serif text-[20px] leading-tight text-slate font-medium">
                    {g.group}
                  </div>
                  <div className="text-[11px] text-slate-faint mt-0.5 truncate max-w-[200px]">
                    top: {g.top.phrase}
                  </div>
                </div>
                <TrendBadge shape={g.shape} />
              </div>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <div className="stat-md">{formatVolume(g.total)}</div>
                  <div className="text-[11px] text-slate-mute mt-0.5">searches / mo</div>
                </div>
                <Sparkline data={g.series} width={110} height={32} stroke={stroke} fill={stroke} />
              </div>
              <div className="mt-3 pt-3 border-t border-mist-200 flex items-center justify-between text-xs">
                <span className="text-slate-mute">{g.cmp.label}</span>
                <span
                  className="tabular-nums font-semibold"
                  style={{ color: directionColor(d) }}
                >
                  {formatPct(g.cmp.changePct, { signed: true })}
                </span>
              </div>
              {AREA_SALES_NOTES[g.group] && (
                <SalesCallout label="Talk track">{AREA_SALES_NOTES[g.group]}</SalesCallout>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
