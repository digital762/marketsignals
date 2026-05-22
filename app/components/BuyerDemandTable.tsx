import type { Keyword } from "@/lib/types";
import {
  formatPct,
  formatVolume,
  monthlyVolumes24,
  periodComparison,
  shapeColor,
  trendShapeOf,
} from "@/lib/analytics";
import { KEYWORD_SALES_NOTES } from "@/lib/data/sales-notes";
import { Sparkline } from "./Sparkline";
import { TrendBadge } from "./TrendBadge";

interface BuyerDemandTableProps {
  keywords: Keyword[];
}

export function BuyerDemandTable({ keywords }: BuyerDemandTableProps) {
  return (
    <div className="card">
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-[0.14em] text-slate-faint font-bold">
              <th className="pb-3 pl-2 pr-3">Keyword</th>
              <th className="pb-3 text-right">Vol /mo</th>
              <th className="pb-3">24-mo shape</th>
              <th className="pb-3 text-center px-2">vs last yr</th>
              <th className="pb-3 text-center px-2">vs last mo</th>
              <th className="pb-3 px-2">Trend</th>
              <th className="pb-3 pl-3 pr-2">Bring this to the conversation</th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((k) => {
              const may = periodComparison(k, "may");
              const mom = periodComparison(k, "mom");
              const shape = trendShapeOf(k);
              const note = KEYWORD_SALES_NOTES[k.phrase];
              const series = monthlyVolumes24(k);
              const stroke = shapeColor(shape);
              const yoyClass =
                may.changePct > 0.05 ? "up" : may.changePct < -0.05 ? "down" : "flat";
              const momClass =
                mom.changePct > 0.05 ? "up" : mom.changePct < -0.05 ? "down" : "flat";
              const latest = series.at(-1) ?? 0;

              return (
                <tr key={k.phrase} className="border-t border-mist-200 hover:bg-mist-50">
                  <td className="py-3.5 pl-2 pr-3">
                    <div className="font-semibold text-slate">{k.phrase}</div>
                  </td>
                  <td className="py-3.5 text-right font-medium text-slate tabular-nums">
                    {formatVolume(latest)}
                  </td>
                  <td className="py-3.5 pr-3">
                    <Sparkline data={series} width={110} height={28} stroke={stroke} fill={stroke} />
                  </td>
                  <td className="py-3.5 text-center px-2 tabular-nums">
                    <span
                      className={
                        yoyClass === "up"
                          ? "text-signal-up font-semibold"
                          : yoyClass === "down"
                            ? "text-signal-down font-semibold"
                            : "text-slate-mute font-medium"
                      }
                    >
                      {formatPct(may.changePct, { signed: true })}
                    </span>
                  </td>
                  <td className="py-3.5 text-center px-2 tabular-nums">
                    <span
                      className={
                        momClass === "up"
                          ? "text-signal-up font-semibold"
                          : momClass === "down"
                            ? "text-signal-down font-semibold"
                            : "text-slate-mute font-medium"
                      }
                    >
                      {formatPct(mom.changePct, { signed: true })}
                    </span>
                  </td>
                  <td className="py-3.5 px-2">
                    <TrendBadge shape={shape} />
                  </td>
                  <td className="py-3.5 pl-3 pr-2 max-w-[360px]">
                    {note ? (
                      <div className="text-[12px] text-slate-soft leading-snug">
                        <span className="font-semibold text-slate">{note.headline}</span>{" "}
                        {note.line}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-faint">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-[11px] text-slate-faint">
        &ldquo;Vs last yr&rdquo; compares May 2026 to May 2025. &ldquo;Vs last
        mo&rdquo; compares May 2026 to April 2026.
      </div>
    </div>
  );
}
