import type { Keyword, SignalProfile } from "@/lib/types";
import { allPeriodComparisons, filterByProfile } from "@/lib/analytics";
import { PROFILE_BY_ID } from "@/lib/categories";
import { COUNTRIES_FOREIGN_BUYERS } from "@/lib/data/countries";
import { AgentPlaybook } from "../components/AgentPlaybook";
import { CountryBreakdown } from "../components/CountryBreakdown";
import { PeriodComparisonCard } from "../components/PeriodComparisonCard";
import { PeriodComparisonGrid } from "../components/PeriodComparisonGrid";
import { SectionHeader } from "../components/SectionHeader";
import { SourceBadge } from "../components/SourceBadge";
import { WhatThisMeans } from "../components/WhatThisMeans";

interface ProfileTabProps {
  profile: SignalProfile;
  keywords: Keyword[];
}

export function ProfileTab({ profile, keywords }: ProfileTabProps) {
  const meta = PROFILE_BY_ID[profile];
  const profileKws = filterByProfile(keywords, profile);
  const headline = profileKws.find((k) => k.phrase === meta.headlinePhrase) ?? profileKws[0];
  const headlineComps = headline ? allPeriodComparisons(headline) : null;
  const showCountries = profile === "buyer" || profile === "investor";

  return (
    <div className="space-y-14">
      {/* Profile header */}
      <header className="bg-mist-50 rounded-2xl border border-mist-200 p-8 md:p-10 diamond-bg">
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="eyebrow mb-3">{meta.label} profile</div>
            <h2 className="font-serif text-[36px] md:text-[42px] leading-[1.05] tracking-tightish text-slate font-medium">
              What {meta.label.toLowerCase()}s in UAE are asking about right now
            </h2>
            <p className="mt-3 max-w-xl text-slate-soft leading-relaxed text-base">
              {meta.whatThisMeans}
            </p>
          </div>
          <SourceBadge />
        </div>

        {headline && headlineComps && (
          <div className="mt-8">
            <div className="text-[11px] uppercase tracking-[0.16em] text-slate-mute font-semibold mb-3">
              Headline keyword · &ldquo;{headline.phrase}&rdquo;
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {headlineComps.map((c) => (
                <PeriodComparisonCard
                  key={c.id}
                  comparison={c}
                  context={`"${headline.phrase}"`}
                />
              ))}
            </div>
          </div>
        )}
      </header>

      {/* All keywords in this profile */}
      <section>
        <SectionHeader
          eyebrow="Section 01"
          title={`Every ${meta.label.toLowerCase()} keyword, year-on-year`}
          whatThisMeans={`Each row is a real ${meta.label.toLowerCase()} search term. The three boxes show how Jan-Feb, Mar-Apr, and May this year compared to the same months last year — straight from Google search data.`}
        />
        <PeriodComparisonGrid keywords={profileKws} />
      </section>

      {/* Country breakdown for buyer + investor */}
      {showCountries && (
        <section>
          <SectionHeader
            eyebrow="Section 02 · Foreign buyers"
            title="Top countries searching for Dubai property"
            whatThisMeans="When a customer asks 'who else is buying right now?' — this is your answer. Volumes are last month's searches from each country for our four headline buyer terms."
          />
          <CountryBreakdown countries={COUNTRIES_FOREIGN_BUYERS} />
        </section>
      )}

      {/* Profile-specific playbook */}
      <section>
        <SectionHeader
          eyebrow={showCountries ? "Section 03 · Use in your next call" : "Section 02 · Use in your next call"}
          title="Talking points for your next call"
          whatThisMeans="Ready-to-use lines built from the numbers above. The proof line is something you can read straight to a customer."
        />
        <AgentPlaybook keywords={keywords} profile={profile} />
      </section>
    </div>
  );
}
