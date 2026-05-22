import { MessageSquareQuote } from "lucide-react";
import type { Keyword, SignalProfile } from "@/lib/types";
import {
  biggestYoYMover,
  filterByProfile,
  formatPct,
  formatVolume,
  periodComparison,
} from "@/lib/analytics";

interface AgentPlaybookProps {
  keywords: Keyword[];
  /** Restrict to a specific profile's talking points. */
  profile?: SignalProfile;
}

interface TalkingPoint {
  scenario: string;
  customerSays: string;
  agentResponds: string;
  proof: string;
}

function buildOverview(keywords: Keyword[]): TalkingPoint[] {
  const out: TalkingPoint[] = [];

  // Cross-market headline mover
  const mover = biggestYoYMover(keywords, "jan-feb");
  if (mover) {
    const c = mover.comparison;
    out.push({
      scenario: "Customer is hesitant — wants to wait",
      customerSays: "Maybe I'll wait a few months. The market feels slow.",
      agentResponds:
        `Searches for "${mover.keyword.phrase}" in Jan-Feb this year were ` +
        `${formatVolume(c.currentAvg)} a month, vs ${formatVolume(c.priorAvg)} ` +
        `the same time last year — that's ${formatPct(c.changePct, { signed: true })} more ` +
        `buyers looking for exactly what you're considering. Every month of waiting is ` +
        `competition you can't see yet.`,
      proof: `"${mover.keyword.phrase}" — Jan-Feb 2025: ${formatVolume(c.priorAvg)} → 2026: ${formatVolume(c.currentAvg)} (${formatPct(c.changePct, { signed: true })})`,
    });
  }

  // Buyer side reassurance
  const buyerKws = filterByProfile(keywords, "buyer");
  const topBuy = [...buyerKws].sort((a, b) =>
    periodComparison(b, "may").currentAvg - periodComparison(a, "may").currentAvg,
  )[0];
  if (topBuy) {
    const m = periodComparison(topBuy, "may");
    out.push({
      scenario: "Customer thinks the market is quiet",
      customerSays: "Is anyone actually buying? Feels quiet to me.",
      agentResponds:
        `${formatVolume(m.currentAvg)} people in UAE searched "${topBuy.phrase}" in May alone. ` +
        `That's the pool you're competing with on any listing you like. If it were quiet ` +
        `this number would have collapsed. It hasn't.`,
      proof: `"${topBuy.phrase}" — ${formatVolume(m.currentAvg)} searches in May 2026`,
    });
  }

  // Investor side
  const investorKws = filterByProfile(keywords, "investor");
  const offPlan = investorKws.find((k) => k.phrase === "off plan dubai");
  if (offPlan) {
    const c = periodComparison(offPlan, "jan-feb");
    out.push({
      scenario: "Investor asking about off-plan timing",
      customerSays: "Is off-plan still where the action is?",
      agentResponds:
        `"Off plan dubai" searches in Jan-Feb 2025 averaged ${formatVolume(c.priorAvg)}/month, ` +
        `and Jan-Feb 2026 came in at ${formatVolume(c.currentAvg)}/month (${formatPct(c.changePct, { signed: true })}). ` +
        `${c.changePct >= 0 ? "Investor interest is holding up — meaning developer pricing is still anchored to high demand." : "Interest has cooled — meaning developers are more open to negotiation than the headlines suggest. Good window."}`,
      proof: `"off plan dubai" — Jan-Feb 25: ${formatVolume(c.priorAvg)} → 26: ${formatVolume(c.currentAvg)} (${formatPct(c.changePct, { signed: true })})`,
    });
  }

  return out;
}

function buildForProfile(profile: SignalProfile, keywords: Keyword[]): TalkingPoint[] {
  const profileKws = filterByProfile(keywords, profile);
  const out: TalkingPoint[] = [];

  // Biggest mover in this profile
  const mover = biggestYoYMover(profileKws, "jan-feb");
  if (mover) {
    const c = mover.comparison;
    const direction = c.changePct >= 0.05 ? "growing" : c.changePct <= -0.05 ? "cooling" : "steady";
    out.push({
      scenario: `${profile === "renter" ? "Renter" : profile === "buyer" ? "Buyer" : profile === "investor" ? "Investor" : profile === "seller" ? "Seller" : "Landlord"} asks about timing`,
      customerSays:
        profile === "renter"
          ? "Should I lock in now or wait for new options?"
          : profile === "seller"
            ? "Is it a good time to list?"
            : profile === "landlord"
              ? "Is now the right time to put my unit on the rental market?"
              : "Is the market right for what I want?",
      agentResponds:
        `${direction === "growing" ? `Demand is ${direction} — ` : ""}` +
        `"${mover.keyword.phrase}" was searched ${formatVolume(c.priorAvg)}/mo in Jan-Feb last year, ` +
        `and ${formatVolume(c.currentAvg)}/mo this year. ` +
        `That's a ${formatPct(c.changePct, { signed: true })} year-on-year shift. ` +
        `${direction === "growing" ? "Acting sooner means less competition." : direction === "cooling" ? "It's a buyer-friendly moment — sellers are more flexible." : "Demand is steady — fewer surprises."}`,
      proof: `"${mover.keyword.phrase}" — Jan-Feb 25: ${formatVolume(c.priorAvg)} → 26: ${formatVolume(c.currentAvg)}`,
    });
  }

  // Latest-month signal
  const topByVolume = [...profileKws].sort(
    (a, b) => periodComparison(b, "may").currentAvg - periodComparison(a, "may").currentAvg,
  )[0];
  if (topByVolume) {
    const m = periodComparison(topByVolume, "may");
    out.push({
      scenario: "Customer wants proof the market is active",
      customerSays: "Show me something that says people care about this segment.",
      agentResponds:
        `In May alone, ${formatVolume(m.currentAvg)} people in UAE searched "${topByVolume.phrase}". ` +
        `That's a live audience — not historical noise. Compared to May 2025 (${formatVolume(m.priorAvg)}), ` +
        `that's ${formatPct(m.changePct, { signed: true })}.`,
      proof: `"${topByVolume.phrase}" — May 2026: ${formatVolume(m.currentAvg)} searches`,
    });
  }

  return out;
}

export function AgentPlaybook({ keywords, profile }: AgentPlaybookProps) {
  const points = profile ? buildForProfile(profile, keywords) : buildOverview(keywords);
  if (!points.length) return null;

  return (
    <div className={`grid grid-cols-1 ${points.length > 2 ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-4`}>
      {points.map((p, i) => (
        <div key={i} className="card flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-mist-100 text-slate flex items-center justify-center text-xs font-semibold">
              {i + 1}
            </div>
            <div className="text-xs text-slate-mute font-semibold uppercase tracking-wider">
              Scenario
            </div>
          </div>
          <div className="font-serif text-[18px] leading-snug text-slate font-medium">
            {p.scenario}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-faint mb-1 font-semibold">
                Customer says
              </div>
              <div className="text-sm text-slate-soft italic leading-relaxed">
                &ldquo;{p.customerSays}&rdquo;
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-denim mb-1 font-semibold">
                <MessageSquareQuote size={11} strokeWidth={2.25} />
                Agent responds
              </div>
              <div className="text-sm text-slate leading-relaxed">{p.agentResponds}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-mist-200">
            <div className="text-[10px] uppercase tracking-wider text-slate-faint mb-1 font-semibold">
              Backed by
            </div>
            <div className="text-[11px] font-medium text-slate-soft">{p.proof}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
