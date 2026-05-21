import { AgentPlaybook } from "./components/AgentPlaybook";
import { AreaGrid } from "./components/AreaGrid";
import { Header } from "./components/Header";
import { HeroBand } from "./components/HeroBand";
import { KeywordTable } from "./components/KeywordTable";
import { MiniStatGrid } from "./components/MiniStatGrid";
import { SectionHeader } from "./components/SectionHeader";
import { CATEGORY_BY_ID } from "@/lib/categories";
import { DATA_REFRESHED_AT, DATA_SOURCE, KEYWORDS } from "@/lib/data/keywords";

export default function Page() {
  const priceSensitive = KEYWORDS.filter((k) => k.category === "price-sensitive");
  const transactional = KEYWORDS.filter((k) => k.category === "transactional");
  const offPlan = KEYWORDS.filter((k) => k.category === "off-plan");
  const propertyType = KEYWORDS.filter((k) => k.category === "property-type");
  const buyerProfile = KEYWORDS.filter((k) => k.category === "buyer-profile");
  const areaDubai = KEYWORDS.filter((k) => k.category === "area-dubai");
  const areaUae = KEYWORDS.filter((k) => k.category === "area-uae");

  const demandTable = [
    ...priceSensitive,
    ...transactional,
    ...offPlan,
    ...buyerProfile,
  ];

  return (
    <main className="mx-auto max-w-[1240px] px-6 md:px-10 py-10 md:py-14">
      <Header source={DATA_SOURCE} refreshedAt={DATA_REFRESHED_AT} />

      <HeroBand basket={priceSensitive} />

      {/* Buyer demand table */}
      <section className="mt-16">
        <SectionHeader
          eyebrow="Section 01 · Buyer demand"
          title={CATEGORY_BY_ID["price-sensitive"].title + " & active intent"}
          agentLens={
            "All the live UAE searches you can use in a conversation — sorted, filtered, and trend-checked. Look for keywords that are surging in the right column; they're the script your customer is already running in their head."
          }
        />
        <KeywordTable
          keywords={demandTable}
          filters={[
            { label: "Price-sensitive", ids: ["price-sensitive"] },
            { label: "Active buy intent", ids: ["transactional"] },
            { label: "Off-plan", ids: ["off-plan"] },
            { label: "Buyer profile", ids: ["buyer-profile"] },
          ]}
        />
      </section>

      {/* Geographic */}
      <section className="mt-16">
        <SectionHeader
          eyebrow="Section 02 · Geographic heat"
          title="Where Dubai demand is moving"
          agentLens={CATEGORY_BY_ID["area-dubai"].agentLens}
        />
        <AreaGrid keywords={areaDubai} />
      </section>

      <section className="mt-12">
        <SectionHeader
          eyebrow="Section 03 · Wider UAE"
          title="Demand outside Dubai"
          agentLens={CATEGORY_BY_ID["area-uae"].agentLens}
        />
        <AreaGrid keywords={areaUae} />
      </section>

      {/* Property type & buyer profile */}
      <section className="mt-16">
        <SectionHeader
          eyebrow="Section 04 · Type & size"
          title="What buyers are asking for"
          agentLens={CATEGORY_BY_ID["property-type"].agentLens}
        />
        <MiniStatGrid keywords={propertyType} columns={3} />
      </section>

      <section className="mt-12">
        <SectionHeader
          eyebrow="Section 05 · Off-plan vs ready"
          title="Inventory bias signal"
          agentLens={CATEGORY_BY_ID["off-plan"].agentLens}
        />
        <MiniStatGrid keywords={offPlan} columns={2} />
      </section>

      <section className="mt-12">
        <SectionHeader
          eyebrow="Section 06 · Buyer profile"
          title="Who's actually searching"
          agentLens={CATEGORY_BY_ID["buyer-profile"].agentLens}
        />
        <MiniStatGrid keywords={buyerProfile} columns={3} />
      </section>

      {/* Agent playbook */}
      <section className="mt-16">
        <SectionHeader
          eyebrow="Section 07 · Agent playbook"
          title="Three ways to use this in your next call"
          agentLens={
            "Auto-generated talking points pulled directly from the data above. Use them verbatim or adapt the proof line to the keyword your customer is actually asking about."
          }
        />
        <AgentPlaybook
          priceSensitive={priceSensitive}
          transactional={transactional}
          mortgageGroup={buyerProfile}
        />
      </section>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-cream-200 text-xs text-ink-faint flex flex-wrap gap-x-8 gap-y-2">
        <div>
          <span className="text-ink-mute">Source · </span>
          {DATA_SOURCE}
        </div>
        <div>
          <span className="text-ink-mute">Refreshed · </span>
          {DATA_REFRESHED_AT}
        </div>
        <div>
          <span className="text-ink-mute">Method · </span>
          Trends are 12-month normalized series. Each value is a month, peak = 1.00.
          Recent vs prior compares the last 3 months to the previous 3.
        </div>
      </footer>
    </main>
  );
}
