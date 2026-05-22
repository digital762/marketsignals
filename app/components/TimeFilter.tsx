"use client";

import type { PeriodId } from "@/lib/types";
import { comparisonConfig } from "@/lib/analytics";

interface TimeFilterProps {
  active: PeriodId;
  onChange: (id: PeriodId) => void;
  options?: PeriodId[];
  label?: string;
}

const DEFAULT_OPTIONS: PeriodId[] = ["jan-feb", "mar-apr", "may", "mom"];

export function TimeFilter({
  active,
  onChange,
  options = DEFAULT_OPTIONS,
  label = "Compare against",
}: TimeFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-5 px-4 py-2.5 bg-white border border-mist-200 rounded-xl">
      <span className="text-[10px] uppercase tracking-[0.16em] text-slate-mute font-bold mr-1">
        {label}
      </span>
      {options.map((id) => {
        const cfg = comparisonConfig(id);
        const isActive = id === active;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
              isActive
                ? "bg-slate text-mist-50"
                : "bg-mist-100 text-slate-soft hover:bg-mist-200"
            }`}
          >
            {cfg.label}
          </button>
        );
      })}
    </div>
  );
}
