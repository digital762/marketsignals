import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { TrendShape } from "@/lib/analytics";
import { shapeAccent, shapeLabel } from "@/lib/analytics";

interface TrendBadgeProps {
  shape: TrendShape;
  size?: "sm" | "md";
  pct?: number;
}

export function TrendBadge({ shape, size = "sm", pct }: TrendBadgeProps) {
  const accent = shapeAccent(shape);
  const tone =
    accent === "up"
      ? "text-signal-up bg-signal-up/10"
      : accent === "down"
        ? "text-signal-down bg-signal-down/10"
        : "text-ink-mute bg-cream-200/50";

  const Icon =
    accent === "up" ? ArrowUpRight : accent === "down" ? ArrowDownRight : Minus;

  const padding = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";
  const iconSize = size === "sm" ? 12 : 14;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${tone} ${padding}`}
    >
      <Icon size={iconSize} strokeWidth={2.25} />
      <span>{shapeLabel(shape)}</span>
      {pct !== undefined && (
        <span className="opacity-70">
          {pct > 0 ? "+" : ""}
          {Math.round(pct * 100)}%
        </span>
      )}
    </span>
  );
}
