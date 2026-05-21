/**
 * Refresh keywords.ts from the Semrush API.
 *
 * Usage:
 *   SEMRUSH_API_KEY=xxxx npm run refresh-data
 *
 * Notes:
 * - The Semrush MCP report `phrase_these` is the most efficient (batch, 10 units/line).
 * - The trend column (Td) returns 12 monthly values oldest → newest, normalized 0-1.
 * - To extend coverage, add seed phrases to SEEDS below grouped by category.
 *
 * This script writes lib/data/keywords.ts in place.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import type { Keyword, SignalCategory } from "../lib/types";

const SEMRUSH_API = "https://api.semrush.com/";
const DB = "ae";

interface Seed {
  phrase: string;
  category: SignalCategory;
  group?: string;
}

const SEEDS: Seed[] = [
  // ── price-sensitive ──
  { phrase: "cheap property dubai", category: "price-sensitive" },
  { phrase: "dubai property crash", category: "price-sensitive" },
  { phrase: "distressed property dubai", category: "price-sensitive" },
  { phrase: "below market price", category: "price-sensitive" },
  { phrase: "dubai real estate crash", category: "price-sensitive" },
  { phrase: "foreclosure dubai", category: "price-sensitive" },
  { phrase: "dubai property bubble", category: "price-sensitive" },
  // ── transactional ──
  { phrase: "apartments for sale dubai", category: "transactional" },
  { phrase: "villas for sale dubai", category: "transactional" },
  { phrase: "buy property dubai", category: "transactional" },
  { phrase: "property for sale dubai", category: "transactional" },
  { phrase: "townhouse for sale dubai", category: "transactional" },
  { phrase: "invest in dubai property", category: "transactional" },
  // ── off-plan ──
  { phrase: "off plan dubai", category: "off-plan" },
  { phrase: "off plan property dubai", category: "off-plan" },
  // ── property-type ──
  { phrase: "1 bedroom apartment dubai", category: "property-type", group: "1BR apartment" },
  { phrase: "2 bedroom apartment dubai", category: "property-type", group: "2BR apartment" },
  { phrase: "studio for sale dubai", category: "property-type", group: "Studio" },
  // ── buyer-profile ──
  { phrase: "mortgage dubai", category: "buyer-profile", group: "Mortgage" },
  { phrase: "dubai mortgage rates", category: "buyer-profile", group: "Mortgage" },
  { phrase: "dubai mortgage calculator", category: "buyer-profile", group: "Mortgage" },
  { phrase: "can foreigners buy property in dubai", category: "buyer-profile", group: "Foreign buyer" },
  // ── Dubai areas ──
  { phrase: "dubai marina apartments for sale", category: "area-dubai", group: "Dubai Marina" },
  { phrase: "dubai marina property", category: "area-dubai", group: "Dubai Marina" },
  { phrase: "downtown dubai apartments", category: "area-dubai", group: "Downtown Dubai" },
  { phrase: "business bay apartments", category: "area-dubai", group: "Business Bay" },
  { phrase: "palm jumeirah apartments", category: "area-dubai", group: "Palm Jumeirah" },
  { phrase: "dubai hills estate", category: "area-dubai", group: "Dubai Hills" },
  { phrase: "damac hills 2", category: "area-dubai", group: "Damac Hills 2" },
  { phrase: "mohammed bin rashid city", category: "area-dubai", group: "MBR City" },
  { phrase: "jumeirah lake towers", category: "area-dubai", group: "JLT" },
  { phrase: "dubai south property", category: "area-dubai", group: "Dubai South" },
  { phrase: "dubai creek harbour property", category: "area-dubai", group: "Dubai Creek Harbour" },
  // ── UAE wider ──
  { phrase: "property for sale sharjah", category: "area-uae", group: "Sharjah" },
  { phrase: "apartments for sale sharjah", category: "area-uae", group: "Sharjah" },
  { phrase: "aljada sharjah", category: "area-uae", group: "Aljada (Sharjah)" },
  { phrase: "al zahia sharjah", category: "area-uae", group: "Al Zahia (Sharjah)" },
  { phrase: "tilal city sharjah", category: "area-uae", group: "Tilal City (Sharjah)" },
  { phrase: "property for sale abu dhabi", category: "area-uae", group: "Abu Dhabi" },
  { phrase: "apartments for sale abu dhabi", category: "area-uae", group: "Abu Dhabi" },
  { phrase: "ajman property", category: "area-uae", group: "Ajman" },
];

async function fetchBatch(phrases: string[]): Promise<Record<string, Omit<Keyword, "category" | "group" | "label">>> {
  const key = process.env.SEMRUSH_API_KEY;
  if (!key) throw new Error("SEMRUSH_API_KEY missing");

  // phrase_these report: 10 API units per line
  const url = new URL(SEMRUSH_API);
  url.searchParams.set("type", "phrase_these");
  url.searchParams.set("key", key);
  url.searchParams.set("phrase", phrases.join(";"));
  url.searchParams.set("database", DB);
  url.searchParams.set("export_columns", "Ph,Nq,Cp,Co,Nr,Td");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Semrush HTTP ${res.status}`);
  const text = await res.text();
  if (text.startsWith("ERROR")) throw new Error(text.trim());

  const lines = text.trim().split(/\r?\n/);
  // header line, then data
  const out: Record<string, Omit<Keyword, "category" | "group" | "label">> = {};
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(";");
    if (cols.length < 6) continue;
    const phrase = cols[0];
    const volume = Number(cols[1]);
    const cpc = Number(cols[2]);
    const competition = Number(cols[3]);
    const trend = cols[5].split(",").map(Number);
    out[phrase] = { phrase, volume, cpc, competition, trend };
  }
  return out;
}

async function main() {
  const phrases = SEEDS.map((s) => s.phrase);
  // Semrush accepts ~100 phrases per phrase_these call comfortably; we send all in one.
  const data = await fetchBatch(phrases);

  const keywords: Keyword[] = SEEDS.map((seed) => {
    const found = data[seed.phrase];
    if (!found) {
      console.warn(`No data for seed: ${seed.phrase}`);
      return {
        phrase: seed.phrase,
        category: seed.category,
        group: seed.group,
        volume: 0,
        cpc: 0,
        competition: 0,
        trend: Array(12).fill(0),
      };
    }
    return { ...found, category: seed.category, group: seed.group };
  });

  const today = new Date().toISOString().slice(0, 10);
  const file = `import type { Keyword } from "../types";

export const DATA_REFRESHED_AT = ${JSON.stringify(today)};
export const DATA_SOURCE = "Semrush · Google.ae (UAE)";

export const KEYWORDS: Keyword[] = ${JSON.stringify(keywords, null, 2)};
`;

  const out = resolve(__dirname, "../lib/data/keywords.ts");
  writeFileSync(out, file, "utf8");
  console.log(`Wrote ${keywords.length} keywords to ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
