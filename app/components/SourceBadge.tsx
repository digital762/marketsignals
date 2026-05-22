import { Database } from "lucide-react";
import { DATA_REFRESHED_AT, DATA_SOURCE_SHORT } from "@/lib/data/keywords";

interface SourceBadgeProps {
  variant?: "default" | "compact";
}

export function SourceBadge({ variant = "default" }: SourceBadgeProps) {
  if (variant === "compact") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-slate-mute font-semibold">
        <Database size={10} strokeWidth={2} />
        <span>{DATA_SOURCE_SHORT}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-slate-mute font-semibold px-2.5 py-1 bg-mist-100 rounded-full">
      <Database size={11} strokeWidth={2} />
      <span>
        Source · {DATA_SOURCE_SHORT}
        <span className="text-slate-faint normal-case tracking-normal font-medium ml-1.5">
          {DATA_REFRESHED_AT}
        </span>
      </span>
    </span>
  );
}
