import type { ProfileMeta, SignalProfile } from "./types";

export const PROFILES: ProfileMeta[] = [
  {
    id: "renter",
    label: "Renter",
    whatThisMeans:
      "How many people in UAE are searching to rent right now — by unit type, area, and price. Use this when a customer is comparing rental options or weighing rent vs buy.",
    headlinePhrase: "apartments for rent dubai",
  },
  {
    id: "landlord",
    label: "Landlord",
    whatThisMeans:
      "Demand from owners who want to rent their property out — yields, property managers, tenant search. Use this when you're talking to a landlord client.",
    headlinePhrase: "property management dubai",
  },
  {
    id: "seller",
    label: "Seller",
    whatThisMeans:
      "What owners are searching when they think about selling — valuations and how-to questions. Lean on this in a listing conversation.",
    headlinePhrase: "dubai property valuation",
  },
  {
    id: "buyer",
    label: "Buyer",
    whatThisMeans:
      "Live buyer demand — total searches, the areas they want, price-sensitivity signals, and mortgage interest. This is the headline view for sales conversations.",
    headlinePhrase: "apartments for sale dubai",
  },
  {
    id: "investor",
    label: "Investor",
    whatThisMeans:
      "Off-plan and yield-driven searches — investors looking at developers, communities, and ROI. Use this with an investor client weighing new launches.",
    headlinePhrase: "off plan dubai",
  },
];

export const PROFILE_BY_ID = Object.fromEntries(
  PROFILES.map((p) => [p.id, p]),
) as Record<SignalProfile, ProfileMeta>;

export const PROFILE_ORDER: SignalProfile[] = [
  "renter",
  "landlord",
  "seller",
  "buyer",
  "investor",
];
