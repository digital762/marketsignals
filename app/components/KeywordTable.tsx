"use client";

import { useMemo, useState } from "react";
import { Sparkline } from "./Sparkline";
import { TrendBadge } from "./TrendBadge";
import type { Keyword } from "@/lib/types";
import {
  formatPct,
  formatVolume,
  quarterOverQuarter,
  shapeAccent,
  trendShape,
} from "@/lib/analytics";

type SortKey = "volume" | "qoq" | "cpc" | "phrase";

interface KeywordTableProps {
  keywords: Keyword[];
  filters?: { label: string; ids: string[] }[];
}

export function KeywordTable({ keywords, filters }: KeywordTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("volume");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (!filters || activeFilter === "all") return keywords;
    const f = filters.find((x) => x.label === activeFilter);
    if (!f) return keywords;
    return keywords.filter((k) => f.ids.includes(k.category));
  }, [keywords, filters, activeFilter]);

  const rows = useMemo(() => {
    return [...filtered]
      .map((k) => ({
        k,
        qoq: quarterOverQuarter(k.trend),
        shape: trendShape(k.trend),
      }))
      .sort((a, b) => {
        const dir = sortDir === "desc" ? -1 : 1;
        if (sortKey === "phrase") return dir * a.k.phrase.localeCompare(b.k.phrase);
        if (sortKey === "volume") return dir * (a.k.volume - b.k.volume);
        if (sortKey === "cpc") return dir * (a.k.cpc - b.k.cpc);
        return dir * (a.qoq - b.qoq);
      });
  }, [filtered, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="card">
      {filters && (
        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              activeFilter === "all"
                ? "bg-ink text-cream-50"
                : "bg-cream-100 text-ink-soft hover:bg-cream-200"
            }`}
          >
            All
          </button>
          {filters.map((f) => (
            <button
              type="button"
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                activeFilter === f.label
                  ? "bg-ink text-cream-50"
                  : "bg-cream-100 text-ink-soft hover:bg-cream-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-ink-mute">
              <th
                className="font-medium pb-3 pl-2 cursor-pointer select-none"
                onClick={() => toggleSort("phrase")}
              >
                Keyword
              </th>
              <th
                className="font-medium pb-3 cursor-pointer select-none text-right"
                onClick={() => toggleSort("volume")}
              >
                Vol/mo
              </th>
              <th className="font-medium pb-3">12-mo trend</th>
              <th
                className="font-medium pb-3 cursor-pointer select-none text-right"
                onClick={() => toggleSort("qoq")}
              >
                Recent vs prior
              </th>
              <th className="font-medium pb-3">Shape</th>
              <th
                className="font-medium pb-3 cursor-pointer select-none text-right pr-2"
                onClick={() => toggleSort("cpc")}
              >
                CPC
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ k, qoq, shape }) => {
              const accent = shapeAccent(shape);
              const sparkColor =
                accent === "up"
                  ? "#3E6B47"
                  : accent === "down"
                    ? "#B4422D"
                    : "#1A1A1A";
              return (
                <tr
                  key={k.phrase}
                  className="border-t border-cream-200 hover:bg-cream-50/60"
                >
                  <td className="py-3 pl-2 pr-3">
                    <div className="font-medium text-ink">{k.phrase}</div>
                    {k.group && k.category !== "area-dubai" && k.category !== "area-uae" && (
                      <div className="text-[11px] text-ink-faint mt-0.5">{k.group}</div>
                    )}
                  </td>
                  <td className="py-3 text-right font-medium text-ink tabular-nums">
                    {formatVolume(k.volume)}
                  </td>
                  <td className="py-3">
                    <Sparkline
                      data={k.trend}
                      width={130}
                      height={28}
                      stroke={sparkColor}
                      fill={sparkColor}
                    />
                  </td>
                  <td className="py-3 text-right tabular-nums">
                    <span
                      className={
                        qoq > 0.05
                          ? "text-signal-up font-medium"
                          : qoq < -0.05
                            ? "text-signal-down font-medium"
                            : "text-ink-mute"
                      }
                    >
                      {formatPct(qoq, { signed: true })}
                    </span>
                  </td>
                  <td className="py-3">
                    <TrendBadge shape={shape} />
                  </td>
                  <td className="py-3 text-right pr-2 tabular-nums text-ink-soft">
                    {k.cpc > 0 ? `$${k.cpc.toFixed(2)}` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-[11px] text-ink-faint">
        Recent vs prior = avg of last 3 months ÷ avg of prior 3 months. CPC is
        Google's average paid-search cost in USD — a proxy for advertiser
        willingness to chase the keyword.
      </div>
    </div>
  );
}
