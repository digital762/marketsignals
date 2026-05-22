"use client";

import type { Keyword, SignalProfile } from "@/lib/types";
import { basketPeriodComparison } from "@/lib/analytics";
import {
  BUYER_DEMAND_PHRASES,
  PRICE_DROP_PHRASES,
} from "@/lib/data/keywords";
import { BuyerDemandTable } from "../components/BuyerDemandTable";
import { BuyerProfilePanel } from "../components/BuyerProfilePanel";
import { CalendarComparisonCard } from "../components/CalendarComparisonCard";
import { EmirateBand } from "../components/EmirateBand";
import { GeographicHeatGrid } from "../components/GeographicHeatGrid";
import { PriceDropHero } from "../components/PriceDropHero";
import { ProfileMarketTemp } from "../components/ProfileMarketTemp";
import { PropertyTypeStrip } from "../components/PropertyTypeStrip";
import { SalesPlaybook } from "../components/SalesPlaybook";
import { SectionHeader } from "../components/SectionHeader";

interface OverviewTabProps {
  keywords: Keyword[];
  onSelectProfile: (p: SignalProfile) => void;
}

export function OverviewTab({ keywords, onSelectProfile }: OverviewTabProps) {
  const priceDropBasket = keywords.filter((k) =>
    PRICE_DROP_PHRASES.includes(k.phrase),
  );
  const buyerDemandKws = BUYER_DEMAND_PHRASES.map((p) =>
    keywords.find((k) => k.phrase === p),
  ).filter((k): k is Keyword => Boolean(k));

  const momHeadline = keywords.find((k) => k.phrase === "distressed property dubai");
  const fearKw = keywords.find((k) => k.phrase === "dubai property crash");

  const janFebCmp = basketPeriodComparison(priceDropBasket, "jan-feb");
  const marAprCmp = basketPeriodComparison(priceDropBasket, "mar-apr");
  const mayCmp = basketPeriodComparison(priceDropBasket, "may");
  const momCmp = basketPeriodComparison(priceDropBasket, "mom");

  const allCmps = [
    { id: "jan-feb" as const, cmp: janFebCmp },
    { id: "mar-apr" as const, cmp: marAprCmp },
    { id: "may" as const, cmp: mayCmp },
    { id: "mom" as const, cmp: momCmp },
  ];
  const standout = allCmps.reduce((a, b) =>
    Math.abs(b.cmp.changePct) > Math.abs(a.cmp.changePct) ? b : a,
  );

  return (
    <div className="space-y-14">
      {momHeadline && fearKw && (
        <PriceDropHero
          priceDropBasket={priceDropBasket}
          momHeadlineKeyword={momHeadline}
          fearKeyword={fearKw}
        />
      )}

      <section>
        <SectionHeader
          eyebrow="Section 01 · Calendar view"
          title="Below-market demand across four time lenses"
          whatThisMeans="Each box compares a different window of time on the price-sensitive keyword basket. Read left-to-right as a story of how buyer demand has moved. The salmon dot marks the box with the biggest swing."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allCmps.map(({ id, cmp }) => (
            <CalendarComparisonCard
              key={id}
              id={id}
              comparison={cmp}
              emphasis={id === standout.id}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Section 02 · Buyer-demand keywords"
          title="The seven keywords to bring to your next call"
          whatThisMeans="Real UAE Google searches, with the talk-track to use when a customer raises that exact concern. Sparkline shows the 24-month shape; trend label gives you the headline at a glance."
        />
        <BuyerDemandTable keywords={buyerDemandKws} />
      </section>

      <section>
        <SectionHeader
          eyebrow="Section 03 · Geographic heat"
          title="Where Dubai demand is — and isn't — moving"
          whatThisMeans="One card per top community. Trend label and percentage tell you whether to push or hold; the talk track gives you the line to use with a customer asking about that area."
        />
        <GeographicHeatGrid keywords={keywords} />
      </section>

      <section>
        <SectionHeader
          eyebrow="Section 04 · Demand outside Dubai"
          title="Sharjah, Abu Dhabi, Ras Al Khaimah"
          whatThisMeans="When a customer mentions a non-Dubai emirate, use these aggregates to position. Sharjah = price-comparison; Abu Dhabi = yield; RAK = lifestyle alternative."
        />
        <EmirateBand keywords={keywords} />
      </section>

      <section>
        <SectionHeader
          eyebrow="Section 05 · Type &amp; size"
          title="What unit type the market is actually searching for"
          whatThisMeans="Five cards, one per unit type. Switch the time lens to see whether each type is rising or cooling — the mid-market is squeezing up."
        />
        <PropertyTypeStrip keywords={keywords} />
      </section>

      <section>
        <SectionHeader
          eyebrow="Section 06 · Buyer profile"
          title="Financing posture &amp; the foreign-buyer pool"
          whatThisMeans="Where mortgage anxiety sits today, and which countries are still searching Dubai property — for when a customer asks 'who else is in the market right now?'"
        />
        <BuyerProfilePanel keywords={keywords} />
      </section>

      <section>
        <SectionHeader
          eyebrow="Section 07 · Sales playbook"
          title="The three objections you'll hear this week"
          whatThisMeans="Verbatim talk-tracks for the three most common price-conversation objections, each backed by a live signal from the dashboard above."
        />
        <SalesPlaybook />
      </section>

      <section>
        <SectionHeader
          eyebrow="Profiles · deep dive"
          title="Jump into a customer-type view"
          whatThisMeans="One tile per customer profile. Click to load the dedicated tab with the full keyword grid and (for Buyer / Investor) the country breakdown."
          showSource={false}
        />
        <ProfileMarketTemp keywords={keywords} onSelect={onSelectProfile} />
      </section>
    </div>
  );
}
