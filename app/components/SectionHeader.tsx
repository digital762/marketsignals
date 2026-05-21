interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  agentLens?: string;
  rightSlot?: React.ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  agentLens,
  rightSlot,
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-6 mb-6">
      <div className="max-w-2xl">
        <div className="eyebrow mb-2">{eyebrow}</div>
        <h2 className="text-[28px] font-semibold leading-tight">{title}</h2>
        {agentLens && (
          <p className="mt-2 text-sm text-ink-soft leading-relaxed">{agentLens}</p>
        )}
      </div>
      {rightSlot && <div className="shrink-0">{rightSlot}</div>}
    </div>
  );
}
