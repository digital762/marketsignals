/**
 * Refresh keywords.ts and countries.ts from the Semrush API.
 *
 * Usage:
 *   SEMRUSH_API_KEY=xxxx npm run refresh-data
 *
 * What this does:
 * 1. For every SEED keyword, runs Semrush `phrase_these` TWICE:
 *      - display_date=20260515 → Td covers Jun 2025 → May 2026
 *      - display_date=20250515 → Td covers Jun 2024 → May 2025
 *    Combined, those two snapshots let us compute Jan-Feb 25 vs 26,
 *    Mar-Apr 25 vs 26, and May this year vs last.
 * 2. For each COUNTRY_ANCHOR keyword, runs Semrush `phrase_all` to get
 *    monthly volume per country, then aggregates the top-10 foreign markets
 *    (UAE excluded) and writes the country snapshot.
 *
 * Both Td columns are oldest → newest (Semrush convention). We rely on Nq as
 * the average monthly search volume to convert normalized series → absolute.
 *
 * Output: rewrites lib/data/keywords.ts and lib/data/countries.ts.
 *
 * Note: The `display_date` parameter and `Td` (trend) column shape were
 * verified against Semrush's docs and live MCP responses as of May 2026.
 * If Semrush changes either, update the index map in lib/analytics.ts.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import type { Keyword, SignalProfile } from "../lib/types";

const SEMRUSH_API = "https://api.semrush.com/";
const DB = "ae";

interface Seed {
  phrase: string;
  profiles: SignalProfile[];
  group?: string;
}

/**
 * Seed keyword universe. Order here is preserved in the written file.
 * Edit this list (add/remove/retag) and re-run the script.
 */
const SEEDS: Seed[] = [
  // Renter
  { phrase: "apartments for rent dubai", profiles: ["renter"] },
  { phrase: "studio for rent dubai", profiles: ["renter"], group: "Studio" },
  { phrase: "1 bedroom for rent dubai", profiles: ["renter"], group: "1BR" },
  { phrase: "2 bedroom for rent dubai", profiles: ["renter"], group: "2BR" },
  { phrase: "villas for rent dubai", profiles: ["renter"], group: "Villa" },
  { phrase: "cheap rent dubai", profiles: ["renter"] },
  { phrase: "monthly rent dubai", profiles: ["renter"] },
  { phrase: "dubai rent prices", profiles: ["renter"] },
  { phrase: "rent dubai marina", profiles: ["renter"], group: "Dubai Marina" },
  { phrase: "rent jvc", profiles: ["renter"], group: "JVC" },
  { phrase: "furnished apartment dubai", profiles: ["renter"] },

  // Landlord
  { phrase: "property management dubai", profiles: ["landlord"] },
  { phrase: "rental yield dubai", profiles: ["landlord", "investor"] },
  { phrase: "dubai rental income", profiles: ["landlord", "investor"] },
  { phrase: "ejari dubai", profiles: ["renter", "landlord"] },

  // Seller
  { phrase: "how to sell property in dubai", profiles: ["seller"] },
  { phrase: "dubai property valuation", profiles: ["seller"] },

  // Buyer
  { phrase: "buy property dubai", profiles: ["buyer"] },
  { phrase: "property for sale dubai", profiles: ["buyer"] },
  { phrase: "apartments for sale dubai", profiles: ["buyer"] },
  { phrase: "villas for sale dubai", profiles: ["buyer"] },
  { phrase: "townhouse for sale dubai", profiles: ["buyer"] },
  { phrase: "cheap property dubai", profiles: ["buyer"] },
  { phrase: "distressed property dubai", profiles: ["buyer"] },
  { phrase: "below market price", profiles: ["buyer"] },
  { phrase: "dubai property crash", profiles: ["buyer"] },
  { phrase: "dubai mortgage rates", profiles: ["buyer"] },
  { phrase: "dubai mortgage calculator", profiles: ["buyer"] },
  { phrase: "mortgage dubai", profiles: ["buyer"] },
  { phrase: "can foreigners buy property in dubai", profiles: ["buyer"] },
  { phrase: "dubai marina apartments for sale", profiles: ["buyer"], group: "Dubai Marina" },
  { phrase: "downtown dubai apartments", profiles: ["buyer"], group: "Downtown Dubai" },
  { phrase: "business bay apartments", profiles: ["buyer"], group: "Business Bay" },
  { phrase: "palm jumeirah apartments", profiles: ["buyer"], group: "Palm Jumeirah" },
  { phrase: "dubai hills estate", profiles: ["buyer"], group: "Dubai Hills" },
  { phrase: "1 bedroom apartment dubai", profiles: ["buyer"], group: "1BR apartment" },
  { phrase: "2 bedroom apartment dubai", profiles: ["buyer"], group: "2BR apartment" },
  { phrase: "studio for sale dubai", profiles: ["buyer"], group: "Studio" },

  // Investor
  { phrase: "off plan dubai", profiles: ["investor"] },
  { phrase: "off plan property dubai", profiles: ["investor"] },
  { phrase: "invest in dubai property", profiles: ["investor"] },
  { phrase: "dubai property investment", profiles: ["investor"] },
  { phrase: "emaar off plan", profiles: ["investor"], group: "Emaar" },
  { phrase: "damac off plan", profiles: ["investor"], group: "Damac" },
  { phrase: "dubai south property", profiles: ["buyer", "investor"], group: "Dubai South" },
  { phrase: "dubai creek harbour property", profiles: ["buyer", "investor"], group: "Dubai Creek Harbour" },
  { phrase: "mohammed bin rashid city", profiles: ["buyer", "investor"], group: "MBR City" },
  { phrase: "damac hills 2", profiles: ["buyer", "investor"], group: "Damac Hills 2" },
];

/** Anchor keywords used to compute the foreign-buyer country breakdown. */
const COUNTRY_ANCHORS = [
  "buy property in dubai",
  "apartments for sale in dubai",
  "off plan dubai",
  "invest in dubai property",
];

interface SnapshotResult {
  nq: number;
  td: number[];
}

interface CountryRow {
  code: string;
  volume: number;
}

async function callPhraseThese(
  phrases: string[],
  displayDate: string,
): Promise<Record<string, SnapshotResult>> {
  const key = process.env.SEMRUSH_API_KEY;
  if (!key) throw new Error("SEMRUSH_API_KEY missing");

  const url = new URL(SEMRUSH_API);
  url.searchParams.set("type", "phrase_these");
  url.searchParams.set("key", key);
  url.searchParams.set("phrase", phrases.join(";"));
  url.searchParams.set("database", DB);
  url.searchParams.set("display_date", displayDate);
  url.searchParams.set("export_columns", "Ph,Nq,Cp,Td");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Semrush HTTP ${res.status}`);
  const text = await res.text();
  if (text.startsWith("ERROR")) throw new Error(text.trim());

  const lines = text.trim().split(/\r?\n/);
  const out: Record<string, SnapshotResult> = {};
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(";");
    if (cols.length < 5) continue;
    const phrase = cols[0];
    const nq = Number(cols[1]);
    const td = cols[4].split(",").map(Number);
    out[phrase] = { nq, td };
  }
  return out;
}

async function callPhraseAll(phrase: string): Promise<CountryRow[]> {
  const key = process.env.SEMRUSH_API_KEY;
  if (!key) throw new Error("SEMRUSH_API_KEY missing");

  const url = new URL(SEMRUSH_API);
  url.searchParams.set("type", "phrase_all");
  url.searchParams.set("key", key);
  url.searchParams.set("phrase", phrase);
  url.searchParams.set("export_columns", "Db,Nq");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Semrush HTTP ${res.status}`);
  const text = await res.text();
  if (text.startsWith("ERROR")) throw new Error(text.trim());

  const lines = text.trim().split(/\r?\n/);
  const out: CountryRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(";");
    // phrase_all returns: Date;Database;Keyword;Search Volume;CPC;Competition (when export_columns is default)
    // With Db,Nq we get Db, Nq — but in practice the live response includes Date and Keyword too.
    // Take the second-to-last numeric column as Nq (the volume).
    const db = cols.find((c) => /^[a-z]{2}(-[a-z]+)?$/.test(c)) ?? "";
    const nqCol = cols.slice().reverse().find((c) => /^\d+$/.test(c));
    if (!db || !nqCol) continue;
    out.push({ code: db, volume: Number(nqCol) });
  }
  return out;
}

const COUNTRY_NAMES: Record<string, { name: string; flag: string }> = {
  in: { name: "India", flag: "🇮🇳" },
  uk: { name: "United Kingdom", flag: "🇬🇧" },
  us: { name: "United States", flag: "🇺🇸" },
  pk: { name: "Pakistan", flag: "🇵🇰" },
  br: { name: "Brazil", flag: "🇧🇷" },
  ca: { name: "Canada", flag: "🇨🇦" },
  sa: { name: "Saudi Arabia", flag: "🇸🇦" },
  au: { name: "Australia", flag: "🇦🇺" },
  pl: { name: "Poland", flag: "🇵🇱" },
  ie: { name: "Ireland", flag: "🇮🇪" },
  de: { name: "Germany", flag: "🇩🇪" },
  fr: { name: "France", flag: "🇫🇷" },
  nl: { name: "Netherlands", flag: "🇳🇱" },
  za: { name: "South Africa", flag: "🇿🇦" },
};

async function main() {
  const phrases = SEEDS.map((s) => s.phrase);

  const [recent, prior] = await Promise.all([
    callPhraseThese(phrases, "20260515"),
    callPhraseThese(phrases, "20250515"),
  ]);

  const keywords: Keyword[] = [];
  for (const seed of SEEDS) {
    const s2026 = recent[seed.phrase];
    const s2025 = prior[seed.phrase];
    if (!s2026 || !s2025) {
      console.warn(`Skipping ${seed.phrase} — missing data`);
      continue;
    }
    keywords.push({
      phrase: seed.phrase,
      profiles: seed.profiles,
      group: seed.group,
      s2026,
      s2025,
    });
  }

  // Country breakdown — aggregate across COUNTRY_ANCHORS, exclude AE
  const tally: Record<string, number> = {};
  for (const anchor of COUNTRY_ANCHORS) {
    const rows = await callPhraseAll(anchor);
    for (const r of rows) {
      if (r.code === "ae") continue;
      tally[r.code] = (tally[r.code] ?? 0) + r.volume;
    }
  }
  const ranked = Object.entries(tally)
    .map(([code, volume]) => ({ code, volume }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 10);
  const total = ranked.reduce((s, r) => s + r.volume, 0) || 1;
  const countries = ranked.map((r) => ({
    code: r.code,
    name: COUNTRY_NAMES[r.code]?.name ?? r.code.toUpperCase(),
    flag: COUNTRY_NAMES[r.code]?.flag ?? "🏳️",
    volume: r.volume,
    share: r.volume / total,
  }));

  const today = new Date().toISOString().slice(0, 10);

  const kwFile = `import type { Keyword } from "../types";

export const DATA_REFRESHED_AT = ${JSON.stringify(today)};
export const DATA_SOURCE = "Semrush · Google.ae (UAE)";
export const DATA_SOURCE_SHORT = "Semrush UAE";

export const KEYWORDS: Keyword[] = ${JSON.stringify(keywords, null, 2)};
`;
  writeFileSync(resolve(__dirname, "../lib/data/keywords.ts"), kwFile, "utf8");

  const countryFile = `import type { CountrySearch } from "../types";

export const COUNTRIES_FOREIGN_BUYERS: CountrySearch[] = ${JSON.stringify(countries, null, 2)};

export const COUNTRIES_LAST_UPDATED = ${JSON.stringify(today)};
`;
  writeFileSync(resolve(__dirname, "../lib/data/countries.ts"), countryFile, "utf8");

  console.log(`Wrote ${keywords.length} keywords + ${countries.length} countries`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
