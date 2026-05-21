import type { CategoryMeta } from "./types";

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "price-sensitive",
    title: "Price-sensitivity demand",
    shortTitle: "Price-sensitive",
    agentLens:
      "How loudly the market is asking about discounts, crashes, and below-market deals. Lead with these to validate a buyer's price hesitation, then anchor on inventory.",
  },
  {
    id: "transactional",
    title: "Active buy intent",
    shortTitle: "Buy intent",
    agentLens:
      "Buyers in 'I am ready to purchase' mode. Volume here is the size of the live pipeline you are competing for.",
  },
  {
    id: "off-plan",
    title: "Off-plan vs ready",
    shortTitle: "Off-plan",
    agentLens:
      "Whether the market is leaning toward off-plan (developer-led) or ready (resale) inventory. Re-orient your pitch to match the dominant intent.",
  },
  {
    id: "property-type",
    title: "Property type & size",
    shortTitle: "Type & size",
    agentLens:
      "Which unit configurations are pulling the most search demand right now. Use to prioritise stock and shape positioning.",
  },
  {
    id: "buyer-profile",
    title: "Buyer profile signals",
    shortTitle: "Buyer profile",
    agentLens:
      "Financing posture, foreign-buyer activity, and visa-linked intent. Tells you who is searching and what they actually need help with.",
  },
  {
    id: "area-dubai",
    title: "Dubai community demand",
    shortTitle: "Dubai areas",
    agentLens:
      "Which Dubai communities are gaining or losing buyer attention. Match your conversation to where the demand is moving.",
  },
  {
    id: "area-uae",
    title: "UAE wider market",
    shortTitle: "UAE wider",
    agentLens:
      "Demand outside Dubai — Sharjah, Abu Dhabi, Ajman. Useful when a customer is price-comparing across emirates.",
  },
];

export const CATEGORY_BY_ID = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryMeta["id"], CategoryMeta>;
