import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import type { Keyword } from "@/lib/types";
import {
  allPeriodComparisons,
  direction,
  directionColor,
  formatPct,
  formatVolume,
} from "@/lib/analytics";

interface PeriodComparisonRowProps {
  keyword: Keyword;
}

/**
 * A single keyword shown as 3 small period cells (Jan-Feb, Mar-Apr, May).
 * Used inside the per-keyword grid on each profile tab.
 */
export function PeriodComparisonRow({ keyword }: PeriodComparisonRowProps) {
  const comps = allPeriodComparisons(keyword);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3 md:gap-4 items-center py-3 border-t border-mist-200 first:border-t-0">
      <div className="min-w-0">
        <div className="font-medium text-slate truncate">{keyword.phrase}</div>
        {keyword.group && (
          <div className="text-[11px] text-slate-faint mt-0.5">{keyword.group}</div>
        )}
      </div>
      {comps.map((c) => {
        const d = direction(c.changePct);
        const color = directionColor(d);
        const Icon = d === "up" ? ArrowUp : d === "down" ? ArrowDown : ArrowRight;
        return (
          <div
            key={c.id}
            className="bg-mist-50 rounded-md px-3 py-2 min-w-[170px]"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase tracking-[0.14em] text-slate-mute font-semibold">
                {c.id === "may" ? "May" : c.label}
              </span>
              <span
                className="inline-flex items-center gap-0.5 text-[11px] font-semibold tabular-nums"
                style={{ color }}
              >
                <Icon size={10} strokeWidth={2.5} />
                {formatPct(c.changePct, { signed: true })}
              </span>
            </div>
            <div className="text-[11px] text-slate-soft tabular-nums">
              <span className="text-slate-faint">{formatVolume(c.priorAvg)}</span>
              <span className="mx-1.5 text-slate-faint">→</span>
              <span className="font-semibold text-slate">{formatVolume(c.currentAvg)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
