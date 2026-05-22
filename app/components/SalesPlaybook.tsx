import { MessageSquareQuote } from "lucide-react";
import { SALES_PLAYBOOK } from "@/lib/data/sales-notes";

export function SalesPlaybook() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {SALES_PLAYBOOK.map((p, i) => (
        <div key={p.id} className="card flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-mist-100 text-slate flex items-center justify-center text-xs font-semibold">
              {i + 1}
            </div>
            <div className="text-xs text-slate-mute font-semibold uppercase tracking-wider">
              Objection
            </div>
          </div>
          <div className="font-serif text-[18px] leading-snug text-slate font-medium">
            {p.scenario}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-faint mb-1 font-semibold">
                Customer says
              </div>
              <div className="text-sm text-slate-soft italic leading-relaxed">
                &ldquo;{p.customerSays}&rdquo;
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-denim mb-1 font-semibold">
                <MessageSquareQuote size={11} strokeWidth={2.25} />
                Your response
              </div>
              <div className="text-sm text-slate leading-relaxed">{p.agentResponds}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-mist-200">
            <div className="text-[10px] uppercase tracking-wider text-slate-faint mb-1 font-semibold">
              Backed by
            </div>
            <div className="text-[11px] font-medium text-slate-soft">{p.proof}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
