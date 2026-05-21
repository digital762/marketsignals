import { RefreshCcw, Globe2 } from "lucide-react";

interface HeaderProps {
  source: string;
  refreshedAt: string;
}

export function Header({ source, refreshedAt }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gold" />
          <div className="eyebrow">Market Signals · Agent Dashboard</div>
        </div>
        <h1 className="font-serif text-[40px] leading-[1.05] tracking-tightish">
          Dubai &amp; UAE buyer demand
        </h1>
        <p className="mt-2 max-w-xl text-ink-soft text-sm leading-relaxed">
          Live search-demand intelligence to help you lead price conversations
          and prove to customers you understand the market better than the next
          agent on their list.
        </p>
      </div>
      <div className="flex items-center gap-4 text-xs text-ink-mute">
        <div className="flex items-center gap-1.5">
          <Globe2 size={14} strokeWidth={1.75} />
          <span>{source}</span>
        </div>
        <div className="hidden md:block w-px h-4 bg-cream-200" />
        <div className="flex items-center gap-1.5">
          <RefreshCcw size={14} strokeWidth={1.75} />
          <span>Refreshed {refreshedAt}</span>
        </div>
      </div>
    </header>
  );
}
