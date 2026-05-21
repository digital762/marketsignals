"use client";

import { Header } from "./components/Header";
import { ProfileTabs, useTabFromHash } from "./components/ProfileTabs";
import { OverviewTab } from "./views/OverviewTab";
import { ProfileTab } from "./views/ProfileTab";
import { DATA_REFRESHED_AT, DATA_SOURCE, KEYWORDS } from "@/lib/data/keywords";

export default function Page() {
  const [tab, setTab] = useTabFromHash();

  return (
    <main className="mx-auto max-w-[1240px] px-6 md:px-10 py-10 md:py-12">
      <Header source={DATA_SOURCE} refreshedAt={DATA_REFRESHED_AT} />
      <ProfileTabs active={tab} onChange={setTab} />

      {tab === "overview" && (
        <OverviewTab keywords={KEYWORDS} onSelectProfile={setTab} />
      )}
      {tab !== "overview" && <ProfileTab profile={tab} keywords={KEYWORDS} />}

      <footer className="mt-20 pt-8 border-t border-mist-200">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif text-[18px] leading-none text-slate font-medium tracking-tight">
              betterhomes
            </span>
            <span className="h-3 w-px bg-mist-300" />
            <span className="text-[10px] uppercase tracking-[0.18em] text-slate-mute font-semibold">
              Est <span className="text-slate-faint">1986</span>
            </span>
          </div>
          <div className="text-xs text-slate-faint flex flex-wrap gap-x-6 gap-y-1">
            <div>
              <span className="text-slate-mute">Source · </span>
              {DATA_SOURCE}
            </div>
            <div>
              <span className="text-slate-mute">Refreshed · </span>
              {DATA_REFRESHED_AT}
            </div>
          </div>
        </div>
        <div className="mt-4 text-[11px] text-slate-faint max-w-3xl leading-relaxed">
          <span className="text-slate-mute font-semibold">How to read this · </span>
          Volumes are estimated monthly Google searches in the UAE from Semrush.
          Year-on-year comparisons average two consecutive months in each year
          (Jan-Feb 2025 vs Jan-Feb 2026, Mar-Apr 2025 vs Mar-Apr 2026). May this
          year is shown standalone.
        </div>
      </footer>
    </main>
  );
}
