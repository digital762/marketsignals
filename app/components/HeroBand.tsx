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
      <div className="bg-cream-50 rounded-2xl border border-cream-200 overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="eyebrow mb-3">The price-drop signal</div>
          <h1 className="font-serif text-[40px] md:text-[52px] leading-[1.05] tracking-tightish max-w-3xl">
            Capturing buyer demand in a price-correcting market.
          </h1>
          <p className="mt-4 max-w-2xl text-ink-soft leading-relaxed">
            Every signal below is a real UAE buyer search. Use the trends to
            lead price-sensitive conversations with confidence — and turn the
            customer's hesitation into your evidence.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Hero stat: biggest MoM uplift */}
            {best && (
              <div className="card relative">
                <div className="eyebrow mb-3">Biggest monthly uplift</div>
                <div className="stat-xl text-ink">
                  <span className="relative inline-block">
                    {formatPct(best.pct, { signed: true })}
                    <span className="absolute -top-1 -right-2 w-3 h-3 rounded-full bg-gold" />
                  </span>
                </div>
                <div className="mt-3 text-sm text-ink-soft leading-snug">
                  MoM uplift on{" "}
                  <span className="font-semibold text-ink">
                    &ldquo;{best.keyword.phrase}&rdquo;
                  </span>{" "}
                  searches — UAE.
                </div>
                <div className="mt-4 -mb-1">
                  <Sparkline
                    data={best.keyword.trend}
                    width={280}
                    height={44}
                    stroke="#C9A961"
                    fill="#C9A961"
                  />
                </div>
              </div>
            )}

            {/* Total basket volume */}
            <div className="card">
              <div className="eyebrow mb-3">Below-market basket</div>
              <div className="stat-xl text-ink">
                {formatVolume(total)}
                <span className="ml-2 text-base font-sans text-ink-mute font-normal">
                  /mo
                </span>
              </div>
              <div className="mt-3 text-sm text-ink-soft leading-snug">
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
                      className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-cream-100 text-ink-soft"
                    >
                      <span className="font-medium">{k.phrase}</span>
                      <span className="text-ink-faint">
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
                <div className="stat-lg text-ink">
                  {formatVolume(topByVolume.volume)}
                  <span className="ml-2 text-base font-sans text-ink-mute font-normal">
                    /mo
                  </span>
                </div>
                <div className="mt-2 text-base font-medium text-ink">
                  &ldquo;{topByVolume.phrase}&rdquo;
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <TrendBadge shape={topShape} />
                  <span className="text-xs text-ink-mute">
                    peaked {topSincePeak} mo ago
                  </span>
                </div>
                <div className="mt-4 -mb-1">
                  <Sparkline
                    data={topByVolume.trend}
                    width={280}
                    height={44}
                    stroke="#1A1A1A"
                    fill="#1A1A1A"
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
