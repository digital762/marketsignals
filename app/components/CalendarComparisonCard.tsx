import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { CalendarStrip } from "./CalendarStrip";
import type { PeriodComparison, PeriodId, TrendShape } from "@/lib/types";
import { comparisonConfig, direction, directionColor, directionWord, formatPct, formatVolume, shapeLabel } from "@/lib/analytics";

interface CalendarComparisonCardProps {
  id: PeriodId;
  comparison: PeriodComparison;
  /** Optional override for the trend word (else derived from direction). */
  shape?: TrendShape;
  /** Optional text under the values (e.g. "Below-market basket aggregate"). */
  basketLabel?: string;
  /** Style the card as the "standout" mover with salmon accents. */
  emphasis?: boolean;
}

export function CalendarComparisonCard({
  id,
  comparison,
  shape,
  basketLabel = "Below-market basket aggregate",
  emphasis = false,
}: CalendarComparisonCardProps) {
  const cfg = comparisonConfig(id);
  const d = direction(comparison.changePct);
  const Icon = d === "up" ? ArrowUp : d === "down" ? ArrowDown : ArrowRight;
  const trendWord = shape ? shapeLabel(shape) : directionWord(d);
  const pctColor = emphasis ? "#FF787A" : directionColor(d);

  return (
    <div className="card-tight">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-[0.16em] text-slate-mute font-bold">
          {cfg.longLabel}
        </span>
        <span
          className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
          style={{ color: pctColor, backgroundColor: `${pctColor}1A` }}
        >
          <Icon size={11} strokeWidth={2.5} />
          {trendWord}
        </span>
      </div>
      <CalendarStrip
        priorIndices={cfg.prior}
        currentIndices={cfg.current}
        salmonCurrent={emphasis}
      />
      <div className="flex justify-between text-[9px] text-slate-faint font-semibold tracking-wider mb-2.5">
        <span>Jun &apos;24</span>
        <span>May &apos;26</span>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-[36px] leading-none" style={{ color: pctColor }}>
          {formatPct(comparison.changePct, { signed: true })}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: pctColor }}>
          {trendWord}
        </span>
      </div>
      <div className="text-xs text-slate-soft font-medium mt-1.5">{cfg.caption}</div>
      <div className="text-xs text-slate-mute font-semibold tabular-nums mt-2">
        {formatVolume(comparison.priorAvg)}
        <span className="text-slate-faint mx-2">→</span>
        <span className="text-slate font-bold">{formatVolume(comparison.currentAvg)}</span>
        <span className="text-slate-mute font-medium ml-1">/mo</span>
      </div>
      <div className="text-[11px] text-slate-faint mt-1.5">{basketLabel}</div>
    </div>
  );
}
