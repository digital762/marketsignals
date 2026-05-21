import { SourceBadge } from "./SourceBadge";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  /** Short broker-language sentence under the title. */
  whatThisMeans?: string;
  /** Show source attribution at the right. Defaults to true. */
  showSource?: boolean;
  rightSlot?: React.ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  whatThisMeans,
  showSource = true,
  rightSlot,
}: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-6 mb-6">
      <div className="max-w-2xl">
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h2 className="text-[26px] md:text-[28px] font-medium leading-tight text-slate">{title}</h2>
        {whatThisMeans && (
          <p className="mt-2 text-sm text-slate-soft leading-relaxed">{whatThisMeans}</p>
        )}
      </div>
      <div className="shrink-0 flex items-center gap-3">
        {rightSlot}
        {showSource && <SourceBadge />}
      </div>
    </div>
  );
}
