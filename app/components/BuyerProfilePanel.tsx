import type { Keyword } from "@/lib/types";
import { formatVolume, monthlyVolumes24, trendShapeOf } from "@/lib/analytics";
import { COUNTRIES_FOREIGN_BUYERS } from "@/lib/data/countries";
import { SalesCallout } from "./SalesCallout";
import { TrendBadge } from "./TrendBadge";

interface BuyerProfilePanelProps {
  keywords: Keyword[];
}

const FINANCING_PHRASES = [
  "dubai mortgage rates",
  "dubai mortgage calculator",
  "can foreigners buy property in dubai",
];

export function BuyerProfilePanel({ keywords }: BuyerProfilePanelProps) {
  const financing = FINANCING_PHRASES.map((phrase) => {
    const k = keywords.find((kw) => kw.phrase === phrase);
    if (!k) return null;
    return {
      phrase,
      latest: monthlyVolumes24(k).at(-1) ?? 0,
      shape: trendShapeOf(k),
    };
  }).filter((x): x is NonNullable<typeof x> => Boolean(x));

  const maxCountry = Math.max(...COUNTRIES_FOREIGN_BUYERS.map((c) => c.volume), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4">
      {/* Financing posture */}
      <div className="card">
        <div className="eyebrow mb-3">Financing posture · UAE searches</div>
        <div className="space-y-3">
          {financing.map((f) => (
            <div
              key={f.phrase}
              className="flex items-center justify-between py-2 border-b border-mist-200 last:border-0"
            >
              <div className="font-semibold text-slate text-sm">{f.phrase}</div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-soft tabular-nums">
                  {formatVolume(f.latest)} /mo
                </span>
                <TrendBadge shape={f.shape} />
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between py-2 opacity-60">
            <div className="font-semibold text-slate text-sm">golden visa property dubai</div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-faint">to be added</span>
            </div>
          </div>
        </div>
        <SalesCallout label="Sales angle">
          Mortgage rate searches dropped sharply from peak — financing anxiety
          is fading. Use with hesitant buyers:{" "}
          <em>
            &ldquo;The rate panic is behind us. The sellers who priced during
            that panic haven&rsquo;t repriced yet. That gap is yours.&rdquo;
          </em>
        </SalesCallout>
      </div>

      {/* Foreign-buyer country list */}
      <div className="card">
        <div className="eyebrow mb-3">Foreign-buyer countries · May 2026</div>
        <div className="space-y-2.5">
          {COUNTRIES_FOREIGN_BUYERS.map((c, i) => {
            const widthPct = (c.volume / maxCountry) * 100;
            return (
              <div key={c.code} className="flex items-center gap-2.5">
                <span className="w-4 text-[11px] text-slate-faint tabular-nums text-right">
                  {i + 1}.
                </span>
                <span className="text-base" aria-hidden="true">
                  {c.flag}
                </span>
                <span className="text-xs font-medium text-slate min-w-[110px]">{c.name}</span>
                <div className="flex-1 h-2 bg-mist-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-denim"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate tabular-nums w-12 text-right">
                  {formatVolume(c.volume)}
                </span>
                <span className="text-[10px] text-slate-mute tabular-nums w-8 text-right">
                  {Math.round(c.share * 100)}%
                </span>
              </div>
            );
          })}
        </div>
        <SalesCallout label="Use it with a foreign-buyer customer">
          Match the customer&rsquo;s country:{" "}
          <em>
            &ldquo;You&rsquo;re in the same bracket as 7,330 other Indian
            buyers looking at Dubai this month — but only a fraction will
            actually transact. Let me get you in the right room.&rdquo;
          </em>
        </SalesCallout>
      </div>
    </div>
  );
}
