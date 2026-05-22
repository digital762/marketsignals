import { Database, RefreshCcw } from "lucide-react";

interface HeaderProps {
  source: string;
  refreshedAt: string;
}

export function Header({ source, refreshedAt }: HeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <span className="font-serif text-[22px] leading-none text-slate font-medium tracking-tight">
          betterhomes
        </span>
        <span className="h-4 w-px bg-mist-300" />
        <span className="text-[11px] uppercase tracking-[0.18em] text-slate-mute font-semibold">
          Market Signals · Agent Dashboard
        </span>
      </div>
      <h1 className="font-serif text-[44px] leading-[1.05] tracking-tightish text-slate font-medium">
        UAE buyer-demand intelligence
      </h1>
      <p className="mt-3 max-w-2xl text-slate-soft text-sm leading-relaxed">
        Live Google search-demand for your customer&rsquo;s segment. Use the
        year-on-year numbers in your next call — they&rsquo;re the real data
        your customer is reacting to.
      </p>

      {/* Prominent source line — director's ask */}
      <div className="mt-5 inline-flex items-center gap-3 px-4 py-2.5 bg-white border border-mist-200 rounded-lg">
        <Database size={15} strokeWidth={2} className="text-denim" />
        <div className="text-xs">
          <span className="text-slate-mute">Data source:</span>{" "}
          <span className="font-semibold text-slate">{source}</span>
        </div>
        <div className="h-3 w-px bg-mist-200" />
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-mute">
          <RefreshCcw size={11} strokeWidth={2} />
          Refreshed {refreshedAt}
        </div>
      </div>
    </header>
  );
}
