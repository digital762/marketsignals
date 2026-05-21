import type { Keyword } from "@/lib/types";
import { latestMonthlyVolume } from "@/lib/analytics";
import { PeriodComparisonRow } from "./PeriodComparisonRow";

interface PeriodComparisonGridProps {
  keywords: Keyword[];
  /** Hide rows where May 2026 volume is below this number. */
  minVolume?: number;
}

export function PeriodComparisonGrid({ keywords, minVolume = 0 }: PeriodComparisonGridProps) {
  const rows = [...keywords]
    .filter((k) => latestMonthlyVolume(k) >= minVolume)
    .sort((a, b) => latestMonthlyVolume(b) - latestMonthlyVolume(a));

  return (
    <div className="card">
      <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 pb-2 text-[10px] uppercase tracking-[0.14em] text-slate-faint font-semibold border-b border-mist-200">
        <span>Keyword</span>
        <span className="text-center min-w-[170px]">Jan-Feb 25 vs 26</span>
        <span className="text-center min-w-[170px]">Mar-Apr 25 vs 26</span>
        <span className="text-center min-w-[170px]">May this year</span>
      </div>
      <div>
        {rows.map((k) => (
          <PeriodComparisonRow key={k.phrase} keyword={k} />
        ))}
      </div>
    </div>
  );
}
