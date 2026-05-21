import { Sparkline } from "./Sparkline";
import { TrendBadge } from "./TrendBadge";
import type { Keyword } from "@/lib/types";
import {
  byGroup,
  formatVolume,
  quarterOverQuarter,
  shapeAccent,
  trendShape,
} from "@/lib/analytics";

interface MiniStatGridProps {
  keywords: Keyword[];
  columns?: 2 | 3 | 4;
}

export function MiniStatGrid({ keywords, columns = 3 }: MiniStatGridProps) {
  const groups = byGroup(keywords);
  const items = Array.from(groups, ([group, ks]) => {
    const totalVolume = ks.reduce((s, k) => s + k.volume, 0);
    const length = ks[0]?.trend.length ?? 12;
    const trend = Array.from({ length }, (_, i) => {
      let num = 0;
      let den = 0;
      for (const k of ks) {
        num += (k.trend[i] ?? 0) * k.volume;
        den += k.volume;
      }
      return den > 0 ? num / den : 0;
    });
    return {
      group,
      totalVolume,
      trend,
      shape: trendShape(trend),
      qoq: quarterOverQuarter(trend),
      top: [...ks].sort((a, b) => b.volume - a.volume)[0],
    };
  });
  items.sort((a, b) => b.totalVolume - a.totalVolume);

  const colClass =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid grid-cols-1 ${colClass} gap-4`}>
      {items.map((it) => {
        const accent = shapeAccent(it.shape);
        const sparkColor =
          accent === "up" ? "#2C537A" : accent === "down" ? "#9E6464" : "#1F343F";
        return (
          <div key={it.group} className="card-tight">
            <div className="flex items-center justify-between gap-3">
              <div className="font-serif text-[18px] leading-tight text-slate font-medium">{it.group}</div>
              <TrendBadge shape={it.shape} size="sm" />
            </div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="stat-md">{formatVolume(it.totalVolume)}</div>
                <div className="text-[11px] text-slate-mute mt-0.5">searches / mo</div>
              </div>
              <Sparkline
                data={it.trend}
                width={90}
                height={28}
                stroke={sparkColor}
                fill={sparkColor}
              />
            </div>
            {it.top && (
              <div className="mt-3 pt-3 border-t border-mist-200 text-[11px] text-slate-faint truncate">
                top: {it.top.phrase}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
