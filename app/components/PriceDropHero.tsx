import type { Keyword } from "@/lib/types";
import { basketLatest, basketPeriodComparison, formatPct, formatVolume, monthlyVolumes24, periodComparison } from "@/lib/analytics";
import { SalesCallout } from "./SalesCallout";

interface PriceDropHeroProps {
  priceDropBasket: Keyword[];
  /** The keyword whose MoM uplift is the headline. */
  momHeadlineKeyword: Keyword;
  /** Crash-narrative keyword whose MoM spike drives the "fear" card. */
  fearKeyword: Keyword;
}

export function PriceDropHero({
  priceDropBasket,
  momHeadlineKeyword,
  fearKeyword,
}: PriceDropHeroProps) {
  const momHeadline = periodComparison(momHeadlineKeyword, "mom");
  const fearMom = periodComparison(fearKeyword, "mom");
  const basketLatestVol = basketLatest(priceDropBasket);
  const sorted = [...priceDropBasket].sort((a, b) => {
    const av = monthlyVolumes24(a).at(-1) ?? 0;
    const bv = monthlyVolumes24(b).at(-1) ?? 0;
    return bv - av;
  });

  return (
    <section className="bg-mist-50 rounded-2xl border border-mist-200 overflow-hidden diamond-bg mb-12">
      <div className="p-8 md:p-10">
        <div className="eyebrow mb-3">The price-drop signal</div>
        <h2 className="font-serif text-[40px] md:text-[46px] leading-[1.05] tracking-tightish text-slate font-medium max-w-3xl">
          Capturing buyer demand in a price-correcting market.
        </h2>
        <p className="mt-4 max-w-2xl text-slate-soft leading-relaxed text-base">
          Every signal below is a real UAE buyer search. Use the calendar view
          to lead price-sensitive conversations — and turn the customer&rsquo;s
          hesitation into your evidence.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Biggest monthly uplift */}
          <div className="card relative">
            <div className="eyebrow mb-3">Biggest monthly uplift</div>
            <div className="stat-xl">
              <span className="relative inline-block">
                {formatPct(momHeadline.changePct, { signed: true })}
                <span className="absolute -top-1 -right-2 w-3 h-3 rounded-full bg-salmon" />
              </span>
            </div>
            <div className="mt-3 text-sm text-slate-soft leading-snug">
              Month-on-month uplift on{" "}
              <span className="font-semibold text-slate">&ldquo;{momHeadlineKeyword.phrase}&rdquo;</span>{" "}
              searches in UAE.
              <div className="text-xs text-slate-mute mt-1">
                April 2026: {formatVolume(momHeadline.priorAvg)}/mo → May 2026:{" "}
                {formatVolume(momHeadline.currentAvg)}/mo
              </div>
            </div>
            <SalesCallout>
              When a customer says &ldquo;I&rsquo;ll wait,&rdquo; respond:{" "}
              <em>&ldquo;Last month, {formatPct(momHeadline.changePct, { signed: true })}{" "}
              more UAE buyers started searching specifically for distressed
              deals. Whatever you&rsquo;re waiting for, they&rsquo;re not.&rdquo;</em>
            </SalesCallout>
          </div>

          {/* 2. Below-market basket — agent-addressed copy */}
          <div className="card">
            <div className="eyebrow mb-3">Below-market basket · May 2026</div>
            <div className="stat-xl">
              {formatVolume(basketLatestVol)}
              <span className="ml-2 text-base font-sans text-slate-mute font-normal">
                /mo
              </span>
            </div>
            <div className="mt-3 text-sm text-slate-soft leading-snug">
              Combined monthly searches across{" "}
              <span className="font-semibold text-slate">
                {priceDropBasket.length} price-sensitive UAE keywords
              </span>
              . Each one is a buyer asking a question{" "}
              <span className="font-semibold text-slate">you are trained to answer</span>{" "}
              — use these exact phrases in your responses to price objections.
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {sorted.slice(0, 4).map((k) => (
                <span
                  key={k.phrase}
                  className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-mist-100 text-slate-soft"
                >
                  <span className="font-medium">{k.phrase}</span>
                  <span className="text-slate-faint">
                    {formatVolume(monthlyVolumes24(k).at(-1) ?? 0)}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* 3. Today's fear narrative — sales-hook card */}
          <div className="card relative" style={{ borderColor: "#FF787A" }}>
            <span className="absolute -top-2.5 right-5 bg-salmon text-slate text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-0.5 rounded-full">
              Sales hook
            </span>
            <div className="eyebrow mb-3">Today&rsquo;s fear narrative</div>
            <div className="stat-xl text-terracotta">
              {formatPct(fearMom.changePct, { signed: true })}
            </div>
            <div className="mt-3 text-sm text-slate-soft leading-snug">
              UAE searches for{" "}
              <span className="font-semibold text-slate">&ldquo;{fearKeyword.phrase}&rdquo;</span>{" "}
              spiked from {formatVolume(fearMom.priorAvg)}/mo in April to{" "}
              {formatVolume(fearMom.currentAvg)}/mo in May — your customer just read
              the crash headlines this week.
            </div>
            <SalesCallout label="Open the call with this">
              Lead with empathy, not rebuttal:{" "}
              <em>&ldquo;I see the same headlines you do — that&rsquo;s why I
              want to walk you through what&rsquo;s actually moving in the
              market, not what&rsquo;s making noise.&rdquo;</em>{" "}
              Then pivot to the deal data.
            </SalesCallout>
          </div>
        </div>
      </div>
    </section>
  );
}
