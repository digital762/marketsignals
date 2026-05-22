import type { Keyword } from "@/lib/types";
import {
  basketPeriodComparison,
  basketSeries24,
  direction,
  directionColor,
  formatPct,
  formatVolume,
  monthlyVolumes24,
  trendShape24,
} from "@/lib/analytics";
import { EMIRATE_SALES_NOTES } from "@/lib/data/sales-notes";
import { SalesCallout } from "./SalesCallout";
import { TrendBadge } from "./TrendBadge";

interface EmirateBandProps {
  keywords: Keyword[];
}

const SHARJAH_PHRASES = [
  "property for sale sharjah",
  "apartments for sale sharjah",
  "aljada sharjah",
  "al zahia sharjah",
  "tilal city sharjah",
];

const ABU_DHABI_PHRASES = [
  "property for sale abu dhabi",
  "apartments for sale abu dhabi",
];

export function EmirateBand({ keywords }: EmirateBandProps) {
  const sharjah = keywords.filter((k) => SHARJAH_PHRASES.includes(k.phrase));
  const abuDhabi = keywords.filter((k) => ABU_DHABI_PHRASES.includes(k.phrase));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <EmirateCard
        name="Sharjah"
        eyebrow="Sharjah · aggregate"
        keywords={sharjah}
        sublabel="Includes Aljada, Al Zahia, Tilal City + general Sharjah property terms."
      />
      <EmirateCard
        name="Abu Dhabi"
        eyebrow="Abu Dhabi · capital"
        keywords={abuDhabi}
        sublabel="Includes general AD + Saadiyat + Yas + Reem."
      />

      {/* RAK placeholder — to be added on next data refresh */}
      <div
        className="card relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #F7F4F0 0%, #EDE8E4 100%)",
          borderStyle: "dashed",
          borderColor: "#CDC3B7",
        }}
      >
        <div className="eyebrow mb-2">Ras Al Khaimah</div>
        <h3 className="font-serif text-[22px] leading-tight text-slate font-medium">RAK</h3>
        <div className="mt-3 inline-block bg-sand text-slate text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded">
          To be added
        </div>
        <p className="text-xs text-slate-soft mt-3 leading-relaxed">
          RAK keyword pull pending — will add &ldquo;property for sale ras al
          khaimah&rdquo;, &ldquo;al marjan island&rdquo;, &ldquo;wynn rak&rdquo;
          to next data refresh.
        </p>
        <SalesCallout label="Why it matters">{EMIRATE_SALES_NOTES.RAK}</SalesCallout>
      </div>
    </div>
  );
}

function EmirateCard({
  name,
  eyebrow,
  keywords,
  sublabel,
}: {
  name: string;
  eyebrow: string;
  keywords: Keyword[];
  sublabel: string;
}) {
  if (!keywords.length) return null;
  const totalLatest = keywords.reduce(
    (s, k) => s + (monthlyVolumes24(k).at(-1) ?? 0),
    0,
  );
  const yoy = basketPeriodComparison(keywords, "may");
  const series = basketSeries24(keywords);
  const shape = trendShape24(series);
  const d = direction(yoy.changePct);

  return (
    <div className="card">
      <div className="eyebrow mb-2">{eyebrow}</div>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-[26px] leading-tight text-slate font-medium">{name}</h3>
        <TrendBadge shape={shape} />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="font-serif text-[34px] leading-none text-slate">
            {formatVolume(totalLatest)}
          </div>
          <div className="text-xs text-slate-mute mt-1">searches / mo</div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-mist-200 flex items-center justify-between text-xs">
        <span className="text-slate-mute">May YoY</span>
        <span className="tabular-nums font-semibold" style={{ color: directionColor(d) }}>
          {formatPct(yoy.changePct, { signed: true })}
        </span>
      </div>
      <p className="text-[11px] text-slate-faint mt-2 leading-relaxed">{sublabel}</p>
      <SalesCallout label="Talk track">{EMIRATE_SALES_NOTES[name]}</SalesCallout>
    </div>
  );
}
