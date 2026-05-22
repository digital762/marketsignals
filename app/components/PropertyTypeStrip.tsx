"use client";

import { useState } from "react";
import type { Keyword, PeriodId } from "@/lib/types";
import {
  direction,
  directionColor,
  formatPct,
  formatVolume,
  monthlyVolumes24,
  periodComparison,
  trendShapeOf,
} from "@/lib/analytics";
import { PROPERTY_TYPE_PHRASES } from "@/lib/data/keywords";
import { SalesCallout } from "./SalesCallout";
import { TimeFilter } from "./TimeFilter";
import { TrendBadge } from "./TrendBadge";

interface PropertyTypeStripProps {
  keywords: Keyword[];
}

const TYPE_LABELS: Record<string, string> = {
  "studio for sale dubai": "Studio",
  "1 bedroom apartment dubai": "1BR apartment",
  "2 bedroom apartment dubai": "2BR apartment",
  "townhouse for sale dubai": "Townhouse",
  "villas for sale dubai": "Villa",
};

export function PropertyTypeStrip({ keywords }: PropertyTypeStripProps) {
  const [period, setPeriod] = useState<PeriodId>("may");

  const items = PROPERTY_TYPE_PHRASES.map((phrase) => {
    const k = keywords.find((kw) => kw.phrase === phrase);
    if (!k) return null;
    const cmp = periodComparison(k, period);
    const shape = trendShapeOf(k);
    const latest = monthlyVolumes24(k).at(-1) ?? 0;
    return { phrase, label: TYPE_LABELS[phrase] ?? phrase, latest, cmp, shape };
  }).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <div>
      <TimeFilter active={period} onChange={setPeriod} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {items.map((it) => {
          const d = direction(it.cmp.changePct);
          return (
            <div key={it.phrase} className="card-tight">
              <div className="font-serif text-[18px] leading-tight text-slate font-medium">
                {it.label}
              </div>
              <div className="font-serif text-[26px] leading-none text-slate mt-3 tabular-nums">
                {formatVolume(it.latest)}
                <span className="text-[12px] font-sans font-normal text-slate-mute ml-1">/mo</span>
              </div>
              <div className="text-[11px] text-slate-mute mt-1 truncate">&ldquo;{it.phrase}&rdquo;</div>
              <div className="mt-3 flex items-center gap-2">
                <TrendBadge shape={it.shape} />
                <span
                  className="text-[11px] font-semibold tabular-nums"
                  style={{ color: directionColor(d) }}
                >
                  {formatPct(it.cmp.changePct, { signed: true })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <SalesCallout label="Director's read">
        <strong>Apartments &amp; townhouses cooled, villas surged.</strong> The
        end-user market is consolidating up — buyers who would&rsquo;ve taken a
        2BR last year are stretching to a townhouse, and townhouse buyers are
        stretching to villas. Your conversation:{" "}
        <em>
          &ldquo;The mid-market squeezed up. If you&rsquo;ve been thinking 1BR,
          the data says people in your situation are now buying 2BR. Let me
          show you the gap.&rdquo;
        </em>
      </SalesCallout>
    </div>
  );
}
