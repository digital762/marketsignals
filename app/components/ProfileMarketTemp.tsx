"use client";

import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import type { Keyword, SignalProfile } from "@/lib/types";
import {
  basketLatest,
  basketPeriodComparison,
  direction,
  directionColor,
  filterByProfile,
  formatPct,
  formatVolume,
} from "@/lib/analytics";
import { PROFILES } from "@/lib/categories";

interface ProfileMarketTempProps {
  keywords: Keyword[];
  onSelect?: (p: SignalProfile) => void;
}

export function ProfileMarketTemp({ keywords, onSelect }: ProfileMarketTempProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {PROFILES.map((p) => {
        const ks = filterByProfile(keywords, p.id);
        const yoy = basketPeriodComparison(ks, "jan-feb");
        const latest = basketLatest(ks);
        const d = direction(yoy.changePct);
        const color = directionColor(d);
        const Icon = d === "up" ? ArrowUp : d === "down" ? ArrowDown : ArrowRight;

        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect?.(p.id)}
            className="group text-left card-tight hover:border-slate transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-[11px] uppercase tracking-[0.14em] text-slate-mute font-semibold">
                {p.label}
              </div>
              <span
                className="inline-flex items-center gap-0.5 text-[11px] font-semibold tabular-nums"
                style={{ color }}
              >
                <Icon size={10} strokeWidth={2.5} />
                {formatPct(yoy.changePct, { signed: true })}
              </span>
            </div>
            <div className="font-serif text-[26px] leading-none text-slate font-medium tabular-nums">
              {formatVolume(latest)}
            </div>
            <div className="text-[11px] text-slate-mute mt-1">searches / mo</div>
            <div className="mt-2 text-[11px] text-slate-faint">
              Jan-Feb YoY {formatPct(yoy.changePct, { signed: true })}
            </div>
          </button>
        );
      })}
    </div>
  );
}
