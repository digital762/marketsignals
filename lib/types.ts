export type SignalProfile = "renter" | "landlord" | "seller" | "buyer" | "investor";

export interface KeywordSnapshot {
  /** Latest monthly search volume from Semrush (Nq) for the endpoint date. */
  nq: number;
  /** 12 monthly normalized values, oldest → newest, peak in window = 1.00. */
  td: number[];
}

export interface Keyword {
  phrase: string;
  profiles: SignalProfile[];
  /** Optional grouping label (area name, segment, etc.). */
  group?: string;
  /** Display label override. */
  label?: string;
  /** Snapshot from display_date=20260515 → Td covers Jun 2025 → May 2026. */
  s2026: KeywordSnapshot;
  /** Snapshot from display_date=20250515 → Td covers Jun 2024 → May 2025. */
  s2025: KeywordSnapshot;
}

export type PeriodId = "jan-feb" | "mar-apr" | "may";

export interface PeriodComparison {
  id: PeriodId;
  /** Plain-language label for the period (e.g. "Jan-Feb"). */
  label: string;
  /** Prior year (2025) average monthly searches. */
  priorAvg: number;
  /** Current year (2026) average monthly searches. */
  currentAvg: number;
  /** (currentAvg - priorAvg) / priorAvg, or 0 when prior is 0. */
  changePct: number;
  /** Human-readable comparison sentence for brokers. */
  sentence: string;
}

export interface CountrySearch {
  code: string;
  name: string;
  flag: string;
  /** Sum of monthly volumes across the buyer/investor anchor basket. */
  volume: number;
  /** Share of total foreign-buyer search volume (0-1). */
  share: number;
}

export interface ProfileMeta {
  id: SignalProfile;
  label: string;
  /** Broker-language description of what this profile means. */
  whatThisMeans: string;
  /** Optional headline phrase to anchor the profile's hero card. */
  headlinePhrase?: string;
}
