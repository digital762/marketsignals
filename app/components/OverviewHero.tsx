import type { Keyword } from "@/lib/types";
import {
  basketLatest,
  basketPeriodComparison,
  biggestYoYMover,
  formatPct,
  formatVolume,
  latestMonthlyVolume,
} from "@/lib/analytics";
import { PeriodComparisonCard } from "./PeriodComparisonCard";

interface OverviewHeroProps {
  keywords: Keyword[];
}

export function OverviewHero({ keywords }: OverviewHeroProps) {
  const mover = biggestYoYMover(keywords, "jan-feb");
  const totalLatest = basketLatest(keywords);
  const allMarketYoY = basketPeriodComparison(keywords, "jan-feb");

  return (
    <section className="bg-mist-50 rounded-2xl border border-mist-200 overflow-hidden diamond-bg">
      <div className="p-8 md:p-10">
        <div className="eyebrow mb-3">UAE real estate · across all profiles</div>
        <h2 className="font-serif text-[36px] md:text-[44px] leading-[1.05] tracking-tightish max-w-3xl text-slate font-medium">
          What UAE is searching for right now.
        </h2>
        <p className="mt-4 max-w-2xl text-slate-soft leading-relaxed text-base">
          Every number below comes from real Google search demand in the UAE.
          Pick a customer profile above to dive into the segment your customer
          fits.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Total active demand */}
          <div className="card">
            <div className="eyebrow mb-3">Total active search demand · May 2026</div>
            <div className="stat-xl">
              {formatVolume(totalLatest)}
              <span className="ml-2 text-base font-sans text-slate-mute font-normal">
                / month
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-soft leading-snug">
              Combined monthly Google searches in UAE across the {keywords.length}{" "}
              real-estate terms we track — across renters, landlords, sellers,
              buyers, and investors.
            </p>
          </div>

          {/* Biggest YoY mover */}
          {mover && (
            <div className="card relative">
              <div className="eyebrow mb-3">Biggest year-on-year jump</div>
              <div className="stat-xl">
                <span className="relative inline-block">
                  {formatPct(mover.comparison.changePct, { signed: true })}
                  <span className="absolute -top-1 -right-2 w-3 h-3 rounded-full bg-salmon" />
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-soft leading-snug">
                Searches for{" "}
                <span className="font-semibold text-slate">
                  &ldquo;{mover.keyword.phrase}&rdquo;
                </span>{" "}
                in Jan-Feb 2026 vs Jan-Feb 2025:{" "}
                <span className="font-semibold text-slate">
                  {formatVolume(mover.comparison.priorAvg)}
                </span>{" "}
                →{" "}
                <span className="font-semibold text-slate">
                  {formatVolume(mover.comparison.currentAvg)}
                </span>
                .
              </p>
            </div>
          )}

          {/* All-market Jan-Feb YoY */}
          <PeriodComparisonCard
            comparison={allMarketYoY}
            context="Aggregated across all UAE real-estate terms we track"
          />
        </div>
      </div>
    </section>
  );
}
