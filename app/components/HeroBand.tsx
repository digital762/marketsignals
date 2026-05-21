import { Sparkline } from "./Sparkline";
import { TrendBadge } from "./TrendBadge";
import type { Keyword } from "@/lib/types";
import {
  basketVolume,
  formatPct,
  formatVolume,
  maxMoMInBasket,
  monthsSincePeak,
  trendShape,
} from "@/lib/analytics";

interface HeroBandProps {
  basket: Keyword[];
}

export function HeroBand({ basket }: HeroBandProps) {
  const total = basketVolume(basket);
  const best = maxMoMInBasket(basket);
  const topByVolume = [...basket].sort((a, b) => b.volume - a.volume)[0];
  const topShape = topByVolume ? trendShape(topByVolume.trend) : "flat";
  const topSincePeak = topByVolume ? monthsSincePeak(topByVolume.trend) : 0;

  return (
    <section className="relative">
      <div className="relative bg-mist-50 rounded-2xl border border-mist-200 overflow-hidden diamond-bg">
        <div className="relative p-8 md:p-10">
          <div className="eyebrow mb-3">The price-drop signal</div>
          <h2 className="font-serif text-[40px] md:text-[52px] leading-[1.05] tracking-tightish max-w-3xl text-slate font-medium">
            Capturing buyer demand in a price-correcting market.
          </h2>
          <p className="mt-4 max-w-2xl text-slate-soft leading-relaxed">
            Every signal below is a real UAE buyer search. Use the trends to
            lead price-sensitive conversations with confidence — and turn the
            customer&rsquo;s hesitation into your evidence.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Hero stat: biggest MoM uplift */}
            {best && (
              <div className="card relative">
                <div className="eyebrow mb-3">Biggest monthly uplift</div>
                <div className="stat-xl">
                  <span className="relative inline-block">
                    {formatPct(best.pct, { signed: true })}
                    <span className="absolute -top-1 -right-2 w-3 h-3 rounded-full bg-salmon" />
                  </span>
                </div>
                <div className="mt-3 text-sm text-slate-soft leading-snug">
                  MoM uplift on{" "}
                  <span className="font-semibold text-slate">
                    &ldquo;{best.keyword.phrase}&rdquo;
                  </span>{" "}
                  searches — UAE.
                </div>
                <div className="mt-4 -mb-1">
                  <Sparkline
                    data={best.keyword.trend}
                    width={280}
                    height={44}
                    stroke="#FF787A"
                    fill="#FF787A"
                  />
                </div>
              </div>
            )}

            {/* Total basket volume */}
            <div className="card">
              <div className="eyebrow mb-3">Below-market basket</div>
              <div className="stat-xl">
                {formatVolume(total)}
                <span className="ml-2 text-base font-sans text-slate-mute font-normal">
                  /mo
                </span>
              </div>
              <div className="mt-3 text-sm text-slate-soft leading-snug">
                Combined monthly searches across {basket.length}{" "}
                price-sensitive UAE keywords. Each one is a buyer asking the
                exact question your agent is trained to answer.
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {basket
                  .slice()
                  .sort((a, b) => b.volume - a.volume)
                  .slice(0, 4)
                  .map((k) => (
                    <span
                      key={k.phrase}
                      className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-mist-100 text-slate-soft"
                    >
                      <span className="font-medium">{k.phrase}</span>
                      <span className="text-slate-faint">
                        {formatVolume(k.volume)}
                      </span>
                    </span>
                  ))}
              </div>
            </div>

            {/* Headline mover */}
            {topByVolume && (
              <div className="card">
                <div className="eyebrow mb-3">Top-volume term</div>
                <div className="stat-lg">
                  {formatVolume(topByVolume.volume)}
                  <span className="ml-2 text-base font-sans text-slate-mute font-normal">
                    /mo
                  </span>
                </div>
                <div className="mt-2 text-base font-medium text-slate">
                  &ldquo;{topByVolume.phrase}&rdquo;
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <TrendBadge shape={topShape} />
                  <span className="text-xs text-slate-mute">
                    peaked {topSincePeak} mo ago
                  </span>
                </div>
                <div className="mt-4 -mb-1">
                  <Sparkline
                    data={topByVolume.trend}
                    width={280}
                    height={44}
                    stroke="#1F343F"
                    fill="#1F343F"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
