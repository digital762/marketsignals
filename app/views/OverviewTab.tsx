"use client";

import type { Keyword, SignalProfile } from "@/lib/types";
import { AgentPlaybook } from "../components/AgentPlaybook";
import { OverviewHero } from "../components/OverviewHero";
import { ProfileMarketTemp } from "../components/ProfileMarketTemp";
import { SectionHeader } from "../components/SectionHeader";
import { WhatThisMeans } from "../components/WhatThisMeans";

interface OverviewTabProps {
  keywords: Keyword[];
  onSelectProfile: (p: SignalProfile) => void;
}

export function OverviewTab({ keywords, onSelectProfile }: OverviewTabProps) {
  return (
    <div className="space-y-14">
      <OverviewHero keywords={keywords} />

      <section>
        <SectionHeader
          eyebrow="Section 01 · Profiles"
          title="The five customer types at a glance"
        />
        <WhatThisMeans>
          Each tile is one of your customer types — total UAE searches in May
          and the year-on-year shift for Jan-Feb. Click a tile to jump into
          that customer&rsquo;s segment.
        </WhatThisMeans>
        <div className="mt-5">
          <ProfileMarketTemp keywords={keywords} onSelect={onSelectProfile} />
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Section 02 · Use in your next call"
          title="Three ways to use this data with a customer"
          whatThisMeans="Ready-to-use lines, pulled from the live numbers above. Adapt the proof line to whichever keyword your customer is actually asking about."
        />
        <AgentPlaybook keywords={keywords} />
      </section>
    </div>
  );
}
