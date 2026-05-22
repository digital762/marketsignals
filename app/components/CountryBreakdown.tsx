import type { CountrySearch } from "@/lib/types";
import { formatVolume } from "@/lib/analytics";

interface CountryBreakdownProps {
  countries: CountrySearch[];
  /** Optional subtitle below the panel title. */
  subtitle?: string;
}

export function CountryBreakdown({ countries, subtitle }: CountryBreakdownProps) {
  const maxVolume = Math.max(...countries.map((c) => c.volume), 1);

  return (
    <div className="card">
      <div className="mb-5">
        <h3 className="font-serif text-[22px] leading-tight text-slate font-medium">
          Where buyers are searching from
        </h3>
        {subtitle && (
          <p className="text-sm text-slate-soft mt-1 leading-relaxed">{subtitle}</p>
        )}
      </div>
      <div className="space-y-2.5">
        {countries.map((c, i) => {
          const widthPct = (c.volume / maxVolume) * 100;
          return (
            <div key={c.code} className="flex items-center gap-3">
              <span className="w-5 text-[11px] text-slate-faint tabular-nums text-right">
                {i + 1}.
              </span>
              <span className="text-base" aria-hidden="true">
                {c.flag}
              </span>
              <span className="text-sm font-medium text-slate min-w-[120px]">
                {c.name}
              </span>
              <div className="flex-1 h-2 bg-mist-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-denim"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-slate tabular-nums w-14 text-right">
                {formatVolume(c.volume)}
              </span>
              <span className="text-[11px] text-slate-mute tabular-nums w-10 text-right">
                {Math.round(c.share * 100)}%
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-5 pt-4 border-t border-mist-200 text-[11px] text-slate-faint leading-relaxed">
        Combined monthly Google searches from each country for the four anchor
        buyer/investor terms (buy property in dubai · apartments for sale in
        dubai · off plan dubai · invest in dubai property). UAE itself is
        excluded so this is the foreign-buyer view.
      </div>
    </div>
  );
}
