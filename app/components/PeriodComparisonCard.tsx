import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import type { PeriodComparison } from "@/lib/types";
import { direction, directionColor, formatPct, formatVolume } from "@/lib/analytics";

interface PeriodComparisonCardProps {
  comparison: PeriodComparison;
  /** Optional subtitle / keyword context. */
  context?: string;
  /** Render in compact mode for tight grids. */
  compact?: boolean;
}

export function PeriodComparisonCard({
  comparison,
  context,
  compact = false,
}: PeriodComparisonCardProps) {
  const d = direction(comparison.changePct);
  const color = directionColor(d);
  const Icon = d === "up" ? ArrowUp : d === "down" ? ArrowDown : ArrowRight;

  const labelLeft = comparison.id === "may" ? "May 2025" : `${comparison.label} 2025`;
  const labelRight = comparison.id === "may" ? "May 2026" : `${comparison.label} 2026`;

  // Bar widths — scale relative to max of the two
  const maxVal = Math.max(comparison.priorAvg, comparison.currentAvg, 1);
  const priorPct = (comparison.priorAvg / maxVal) * 100;
  const currentPct = (comparison.currentAvg / maxVal) * 100;

  return (
    <div className={compact ? "p-4 bg-white rounded-lg border border-mist-200" : "card"}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="text-[11px] uppercase tracking-[0.16em] text-slate-mute font-semibold">
          {comparison.id === "may" ? "May this year" : `${comparison.label} year-on-year`}
        </div>
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ color, backgroundColor: `${color}1A` }}
        >
          <Icon size={12} strokeWidth={2.5} />
          {formatPct(comparison.changePct, { signed: true })}
        </span>
      </div>
      {context && (
        <div className="text-[11px] text-slate-faint mb-2 truncate">{context}</div>
      )}
      <div className="space-y-2.5">
        <div>
          <div className="flex items-center justify-between mb-1 text-[11px]">
            <span className="text-slate-mute">{labelLeft}</span>
            <span className="font-medium text-slate tabular-nums">
              {formatVolume(comparison.priorAvg)}
            </span>
          </div>
          <div className="h-1.5 bg-mist-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-slate-faint"
              style={{ width: `${priorPct}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1 text-[11px]">
            <span className="text-slate-mute">{labelRight}</span>
            <span className="font-semibold text-slate tabular-nums">
              {formatVolume(comparison.currentAvg)}
            </span>
          </div>
          <div className="h-1.5 bg-mist-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${currentPct}%`, backgroundColor: color }}
            />
          </div>
        </div>
      </div>
      <div className="mt-3 text-[11px] text-slate-mute">
        searches / month {comparison.id === "may" ? "(May only)" : "(average)"}
      </div>
    </div>
  );
}
