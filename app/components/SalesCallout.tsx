interface SalesCalloutProps {
  label?: string;
  children: React.ReactNode;
}

export function SalesCallout({ label = "Use it this way", children }: SalesCalloutProps) {
  return (
    <div className="flex items-start gap-2.5 mt-3 px-3 py-2.5 bg-sand/15 border-l-[3px] border-sand rounded-r-md">
      <div>
        <div className="text-[9px] uppercase tracking-[0.18em] text-denim font-bold mb-1">
          {label}
        </div>
        <div className="text-[12px] text-slate leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
