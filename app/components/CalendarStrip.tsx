interface CalendarStripProps {
  priorIndices: number[];
  currentIndices: number[];
  /** Use salmon for current cells (instead of denim) — for the standout box. */
  salmonCurrent?: boolean;
}

/**
 * 24-cell mini-calendar (Jun '24 → May '26, oldest left → newest right).
 * Prior cells render in light slate, current cells in denim (or salmon).
 */
export function CalendarStrip({
  priorIndices,
  currentIndices,
  salmonCurrent = false,
}: CalendarStripProps) {
  const priorSet = new Set(priorIndices);
  const currentSet = new Set(currentIndices);
  const cells = Array.from({ length: 24 });

  return (
    <div className="grid grid-cols-24 gap-[2px] h-[26px] my-3" style={{ gridTemplateColumns: "repeat(24, minmax(0,1fr))" }}>
      {cells.map((_, i) => {
        let bg = "bg-mist-200";
        if (priorSet.has(i)) bg = "bg-mist-300";
        if (currentSet.has(i)) bg = salmonCurrent ? "bg-salmon" : "bg-denim";
        return <div key={i} className={`${bg} rounded-sm`} aria-hidden="true" />;
      })}
    </div>
  );
}
