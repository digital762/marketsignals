import { Sparkline } from "./Sparkline";
import { TrendBadge } from "./TrendBadge";
import type { Keyword } from "@/lib/types";
import {
  byGroup,
  formatPct,
  formatVolume,
  quarterOverQuarter,
  shapeAccent,
  trendShape,
} from "@/lib/analytics";

interface AreaGridProps {
  keywords: Keyword[];
}

interface AreaSummary {
  group: string;
  totalVolume: number;
  shape: ReturnType<typeof trendShape>;
  qoq: number;
  topPhrase: string;
  trend: number[];
}

function summarise(keywords: Keyword[]): AreaSummary {
  const totalVolume = keywords.reduce((s, k) => s + k.volume, 0);
  const length = keywords[0]?.trend.length ?? 12;
  const trend = Array.from({ length }, (_, i) => {
    let num = 0;
    let den = 0;
    for (const k of keywords) {
      num += (k.trend[i] ?? 0) * k.volume;
      den += k.volume;
    }
    return den > 0 ? num / den : 0;
  });
  const top = [...keywords].sort((a, b) => b.volume - a.volume)[0];
  return {
    group: keywords[0].group ?? top.phrase,
    totalVolume,
    shape: trendShape(trend),
    qoq: quarterOverQuarter(trend),
    topPhrase: top.phrase,
    trend,
  };
}

export function AreaGrid({ keywords }: AreaGridProps) {
  const groups = byGroup(keywords);
  const areas: AreaSummary[] = [];
  for (const [, ks] of groups) {
    areas.push(summarise(ks));
  }
  areas.sort((a, b) => b.totalVolume - a.totalVolume);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {areas.map((a) => {
        const accent = shapeAccent(a.shape);
        const sparkColor =
          accent === "up" ? "#2C537A" : accent === "down" ? "#9E6464" : "#1F343F";
        return (
          <div key={a.group} className="card-tight">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-serif text-[22px] leading-tight text-slate font-medium">{a.group}</div>
                <div className="text-[11px] text-slate-faint mt-0.5 truncate max-w-[200px]">
                  top: {a.topPhrase}
                </div>
              </div>
              <TrendBadge shape={a.shape} />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="stat-md">{formatVolume(a.totalVolume)}</div>
                <div className="text-[11px] text-slate-mute mt-0.5">
                  searches / mo
                </div>
              </div>
              <Sparkline
                data={a.trend}
                width={110}
                height={32}
                stroke={sparkColor}
                fill={sparkColor}
              />
            </div>
            <div className="mt-3 pt-3 border-t border-mist-200 flex items-center justify-between text-xs">
              <span className="text-slate-mute">Recent vs prior 3 mo</span>
              <span
                className={`tabular-nums font-medium ${
                  a.qoq > 0.05
                    ? "text-signal-up"
                    : a.qoq < -0.05
                      ? "text-signal-down"
                      : "text-slate-mute"
                }`}
              >
                {formatPct(a.qoq, { signed: true })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
