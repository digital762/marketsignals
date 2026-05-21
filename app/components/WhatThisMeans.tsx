import { Sparkles } from "lucide-react";

interface WhatThisMeansProps {
  children: React.ReactNode;
}

export function WhatThisMeans({ children }: WhatThisMeansProps) {
  return (
    <div className="flex items-start gap-2.5 mt-3 px-4 py-3 bg-sand/20 border border-sand/40 rounded-lg">
      <Sparkles size={14} strokeWidth={2} className="text-denim shrink-0 mt-0.5" />
      <div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-denim font-semibold mb-1">
          What this means for you
        </div>
        <div className="text-sm text-slate leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
