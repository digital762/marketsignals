import { RefreshCcw, Globe2 } from "lucide-react";

interface HeaderProps {
  source: string;
  refreshedAt: string;
}

export function Header({ source, refreshedAt }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="font-serif text-[22px] leading-none text-slate font-medium tracking-tight">
            betterhomes
          </span>
          <span className="h-4 w-px bg-mist-300" />
          <span className="text-[11px] uppercase tracking-[0.18em] text-slate-mute font-semibold">
            Market Signals
          </span>
        </div>
        <h1 className="font-serif text-[44px] leading-[1.05] tracking-tightish text-slate font-medium">
          Dubai &amp; UAE buyer demand
        </h1>
        <p className="mt-3 max-w-xl text-slate-soft text-sm leading-relaxed">
          Live search-demand intelligence to help you lead price conversations
          and prove to customers you understand the market better than the next
          agent on their list.
        </p>
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-mute shrink-0">
        <div className="flex items-center gap-1.5">
          <Globe2 size={14} strokeWidth={1.75} />
          <span>{source}</span>
        </div>
        <div className="hidden md:block w-px h-4 bg-mist-300" />
        <div className="flex items-center gap-1.5">
          <RefreshCcw size={14} strokeWidth={1.75} />
          <span>Refreshed {refreshedAt}</span>
        </div>
      </div>
    </header>
  );
}
