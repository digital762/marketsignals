import type { CountrySearch } from "../types";

/**
 * Top countries searching for Dubai property right now.
 *
 * Aggregated from Semrush phrase_all responses across 4 buyer/investor anchor
 * keywords (May 2026 snapshot, all databases):
 *   - "buy property in dubai"
 *   - "apartments for sale in dubai"
 *   - "off plan dubai"
 *   - "invest in dubai property"
 *
 * Foreign-buyer view: UAE (the home market) is excluded from the list since
 * brokers want to see who's looking from abroad. Volumes are the sum of
 * monthly Google searches across the four anchor keywords.
 */

const TOTAL = 17_550; // sum of all foreign volumes for share calculation

export const COUNTRIES_FOREIGN_BUYERS: CountrySearch[] = [
  { code: "in", name: "India", flag: "🇮🇳", volume: 7330, share: 7330 / TOTAL },
  { code: "uk", name: "United Kingdom", flag: "🇬🇧", volume: 2340, share: 2340 / TOTAL },
  { code: "us", name: "United States", flag: "🇺🇸", volume: 2090, share: 2090 / TOTAL },
  { code: "pk", name: "Pakistan", flag: "🇵🇰", volume: 1730, share: 1730 / TOTAL },
  { code: "br", name: "Brazil", flag: "🇧🇷", volume: 960, share: 960 / TOTAL },
  { code: "ca", name: "Canada", flag: "🇨🇦", volume: 700, share: 700 / TOTAL },
  { code: "sa", name: "Saudi Arabia", flag: "🇸🇦", volume: 630, share: 630 / TOTAL },
  { code: "au", name: "Australia", flag: "🇦🇺", volume: 630, share: 630 / TOTAL },
  { code: "pl", name: "Poland", flag: "🇵🇱", volume: 630, share: 630 / TOTAL },
  { code: "ie", name: "Ireland", flag: "🇮🇪", volume: 520, share: 520 / TOTAL },
];

export const COUNTRIES_LAST_UPDATED = "2026-05-21";
