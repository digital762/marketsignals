import { ArrowDown, ArrowRight, ArrowUp, Activity } from "lucide-react";
import type { TrendShape } from "@/lib/types";
import { shapeAccent, shapeLabel } from "@/lib/analytics";

interface TrendBadgeProps {
  shape: TrendShape;
  size?: "sm" | "md";
}

export function TrendBadge({ shape, size = "sm" }: TrendBadgeProps) {
  const accent = shapeAccent(shape);
  const tone =
    accent === "salmon"
      ? "text-salmon bg-salmon/15"
      : accent === "up"
        ? "text-signal-up bg-signal-up/10"
        : accent === "down"
          ? "text-signal-down bg-signal-down/10"
          : "text-slate-mute bg-mist-200/60";
  const padding = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";
  const iconSize = size === "sm" ? 11 : 13;
  const Icon =
    accent === "salmon" || accent === "up"
      ? ArrowUp
      : accent === "down"
        ? ArrowDown
        : shape === "volatile"
          ? Activity
          : ArrowRight;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${tone} ${padding}`}>
      <Icon size={iconSize} strokeWidth={2.25} />
      <span>{shapeLabel(shape)}</span>
    </span>
  );
}
