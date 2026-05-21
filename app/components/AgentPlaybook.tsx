import { MessageSquareQuote } from "lucide-react";
import type { Keyword } from "@/lib/types";
import {
  formatPct,
  formatVolume,
  maxMoMInBasket,
  monthsSincePeak,
  quarterOverQuarter,
  trendShape,
} from "@/lib/analytics";

interface AgentPlaybookProps {
  priceSensitive: Keyword[];
  transactional: Keyword[];
  mortgageGroup: Keyword[];
}

interface TalkingPoint {
  scenario: string;
  customerSays: string;
  agentResponds: string;
  proof: string;
}

function build(
  priceSensitive: Keyword[],
  transactional: Keyword[],
  mortgageGroup: Keyword[],
): TalkingPoint[] {
  const out: TalkingPoint[] = [];

  // 1. Price-drop narrative
  const best = maxMoMInBasket(priceSensitive);
  if (best) {
    out.push({
      scenario: "Customer hesitant — 'I'm waiting for prices to drop'",
      customerSays:
        "I keep reading that Dubai prices are dropping. I'll wait six months.",
      agentResponds:
        "I totally get that — and the data agrees with you, partly. Right now searches for terms like \"" +
        best.keyword.phrase +
        "\" jumped " +
        formatPct(best.pct, { signed: true }) +
        " month-on-month here in UAE, so you're not alone in looking. But here's the thing — every other serious buyer is doing the same search, so the inventory at a fair correction is moving fast. Let me show you three units that already reflect a real price adjustment.",
      proof:
        '"' +
        best.keyword.phrase +
        '" — ' +
        formatPct(best.pct, { signed: true }) +
        " MoM uplift · UAE",
    });
  }

  // 2. High-volume transactional anchor
  const topBuy = [...transactional].sort((a, b) => b.volume - a.volume)[0];
  if (topBuy) {
    const shape = trendShape(topBuy.trend);
    const recencyNote = shape === "surging" ? "and surging right now" : "consistent each month";
    out.push({
      scenario: "Customer testing if you understand the market",
      customerSays: "Is the market actually active? Feels quiet to me.",
      agentResponds:
        formatVolume(topBuy.volume) +
        " people in UAE searched \"" +
        topBuy.phrase +
        '" last month alone — ' +
        recencyNote +
        ". That's the pool you'd be competing with on any listing you like. If quiet meant low interest, this number would have collapsed. It hasn't.",
      proof:
        '"' + topBuy.phrase + '" — ' + formatVolume(topBuy.volume) + " /mo searches",
    });
  }

  // 3. Mortgage / financing posture
  const mortgageKeywords = mortgageGroup.filter((k) =>
    k.group?.toLowerCase().includes("mortgage"),
  );
  const mortgageRates = mortgageKeywords.find((k) =>
    k.phrase.includes("rates"),
  );
  if (mortgageRates) {
    const sincePeak = monthsSincePeak(mortgageRates.trend);
    const qoq = quarterOverQuarter(mortgageRates.trend);
    const trajectory = qoq < -0.15 ? "easing" : qoq > 0.15 ? "climbing" : "steady";
    out.push({
      scenario: "Customer worried about financing cost",
      customerSays: "Interest rates make me nervous. Should I wait?",
      agentResponds:
        "Search interest in \"dubai mortgage rates\" peaked about " +
        sincePeak +
        " months ago and has been " +
        trajectory +
        " since (" +
        formatPct(qoq, { signed: true }) +
        " over the last quarter). When peer anxiety about rates is past its peak, that's usually the window where motivated sellers are still pricing as if the anxiety is current — exactly when buyers like you get the cleanest deals.",
      proof:
        '"dubai mortgage rates" — peaked ' +
        sincePeak +
        " mo ago, " +
        formatPct(qoq, { signed: true }) +
        " QoQ",
    });
  }

  return out;
}

export function AgentPlaybook({
  priceSensitive,
  transactional,
  mortgageGroup,
}: AgentPlaybookProps) {
  const points = build(priceSensitive, transactional, mortgageGroup);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {points.map((p, i) => (
        <div key={i} className="card flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-cream-100 text-ink flex items-center justify-center text-xs font-semibold">
              {i + 1}
            </div>
            <div className="text-xs text-ink-mute font-medium uppercase tracking-wider">
              Scenario
            </div>
          </div>
          <div>
            <div className="font-serif text-[18px] leading-snug text-ink">
              {p.scenario}
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="text-sm">
              <div className="text-[11px] uppercase tracking-wider text-ink-faint mb-1">
                Customer says
              </div>
              <div className="text-ink-soft italic leading-relaxed">
                &ldquo;{p.customerSays}&rdquo;
              </div>
            </div>

            <div className="text-sm">
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-gold-dark mb-1">
                <MessageSquareQuote size={12} strokeWidth={2.25} />
                Agent responds
              </div>
              <div className="text-ink leading-relaxed">{p.agentResponds}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-cream-200">
            <div className="text-[11px] uppercase tracking-wider text-ink-faint mb-1">
              Backed by
            </div>
            <div className="text-[12px] font-medium text-ink-soft">{p.proof}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
