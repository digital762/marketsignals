"use client";

import { useEffect, useState } from "react";
import type { LucideProps } from "lucide-react";
import { Home, KeyRound, Tag, ShoppingCart, TrendingUp, LayoutDashboard } from "lucide-react";
import type { SignalProfile } from "@/lib/types";

export type TabId = SignalProfile | "overview";

const TABS: { id: TabId; label: string; Icon: React.ComponentType<LucideProps> }[] = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "renter", label: "Renter", Icon: KeyRound },
  { id: "landlord", label: "Landlord", Icon: Home },
  { id: "seller", label: "Seller", Icon: Tag },
  { id: "buyer", label: "Buyer", Icon: ShoppingCart },
  { id: "investor", label: "Investor", Icon: TrendingUp },
];

interface ProfileTabsProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function ProfileTabs({ active, onChange }: ProfileTabsProps) {
  return (
    <nav className="sticky top-0 z-30 -mx-6 md:-mx-10 px-6 md:px-10 py-3 bg-mist-100/85 backdrop-blur-md border-b border-mist-200 mb-10">
      <div className="flex items-center gap-1 overflow-x-auto">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate text-mist-50"
                  : "text-slate-soft hover:bg-mist-200"
              }`}
            >
              <Icon size={14} strokeWidth={2} />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/** Hook that syncs tab state with URL hash, defaulting to "overview". */
export function useTabFromHash(): [TabId, (t: TabId) => void] {
  const [tab, setTab] = useState<TabId>("overview");

  useEffect(() => {
    function read() {
      const hash = (typeof window !== "undefined" ? window.location.hash : "").replace(/^#/, "");
      const valid: TabId[] = ["overview", "renter", "landlord", "seller", "buyer", "investor"];
      setTab((valid as string[]).includes(hash) ? (hash as TabId) : "overview");
    }
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const setAndPush = (t: TabId) => {
    if (typeof window !== "undefined") {
      if (t === "overview") {
        history.pushState(null, "", window.location.pathname + window.location.search);
      } else {
        window.location.hash = t;
      }
    }
    setTab(t);
  };

  return [tab, setAndPush];
}
