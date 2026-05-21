export type SignalCategory =
  | "price-sensitive"
  | "transactional"
  | "off-plan"
  | "area-dubai"
  | "area-uae"
  | "property-type"
  | "buyer-profile";

export interface Keyword {
  phrase: string;
  category: SignalCategory;
  volume: number;
  cpc: number;
  competition: number;
  /** 12 monthly values, oldest → newest, normalized 0-1 where 1 is peak month. */
  trend: number[];
  /** Optional display label if you want something cleaner than the raw phrase. */
  label?: string;
  /** Optional grouping tag (e.g. area name, price band). */
  group?: string;
}

export interface CategoryMeta {
  id: SignalCategory;
  title: string;
  shortTitle: string;
  agentLens: string;
}
