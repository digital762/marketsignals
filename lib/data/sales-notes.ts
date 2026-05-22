/**
 * Sales-trainer style notes for buyer-demand keywords, geographic areas,
 * and emirates. Each note is a 1-2 sentence "bring this to the conversation"
 * line — written from a director-of-sales lens.
 */

export const KEYWORD_SALES_NOTES: Record<string, { headline: string; line: string }> = {
  "distressed property dubai": {
    headline: "The deal-hunter signal.",
    line:
      'Use the volume to legitimize urgency: "There\'s an active pool of buyers in UAE hunting for distressed inventory right now — if you wait, you\'ll be competing with them."',
  },
  "dubai property crash": {
    headline: "Today's fear narrative.",
    line:
      'Don\'t argue with it — acknowledge: "You\'re not alone in reading these headlines — searches for this just spiked this month. Let me show you what\'s actually happening on the ground."',
  },
  "buy property dubai": {
    headline: "The confidence anchor.",
    line:
      'Use the raw volume to settle nerves: "Thousands of people in UAE searched \'buy property dubai\' last month — the market isn\'t hesitating, it\'s moving."',
  },
  "apartments for sale dubai": {
    headline: "The pool-size proof.",
    line:
      'This is the audience you\'re competing with for any listing: "On any unit you like, thousands of other UAE buyers are looking at the same shortlist this month."',
  },
  "cheap property dubai": {
    headline: "The bargain frenzy is over.",
    line:
      'Reframe a deal-seeker: "The wider \'cheap dubai\' hunt has cooled — meaning the easy bargains already moved. What\'s left are the targeted opportunities you want me to find for you."',
  },
  "dubai mortgage rates": {
    headline: "Financing anxiety past peak.",
    line:
      'Use this in a mortgage conversation: "Search interest in mortgage rates has dropped sharply from peak. The fear is fading — but the deals priced during the fear are still on the market."',
  },
  "villas for sale dubai": {
    headline: "Villa demand exploded YoY.",
    line:
      'Use with end-user buyers: "Villa search demand in UAE went many times higher this May vs last May. We are at peak villa appetite — the right unit will get multiple interested parties."',
  },
};

export const AREA_SALES_NOTES: Record<string, string> = {
  "Dubai Hills":
    "Dubai Hills demand softened — a good window to negotiate on listings that have sat longer than 60 days.",
  "MBR City":
    "MBR City cooled this month after a strong April. Brand-name area, still high-traffic — position as 'consolidation pause,' not weakness.",
  "Damac Hills 2":
    "Stable plateau — Damac Hills 2 is in the 'investor-affordable' sweet spot. Lead with rental yield, not capital appreciation.",
  "Dubai Marina":
    "Marina demand is steady-down. Lifestyle-driven buyers — sell the location, not the discount.",
  "Dubai South":
    "Dubai South — investor-led, expo-tied. Cyclic dip is normal. Lead with 'long-game' framing.",
  "Downtown Dubai":
    "Downtown — small-volume, prestige-driven. Lead with brand, view, and lifestyle, not search momentum.",
  "Palm Jumeirah":
    "Palm — lifestyle and prestige. Buyers here aren't price-shopping. Lead with view, scarcity, and the brand of the address.",
  "Business Bay":
    "Business Bay — investor sweet spot for short-term-rental yields. Lead with rental income math, not capital story.",
};

export const EMIRATE_SALES_NOTES: Record<string, string> = {
  Sharjah:
    "Sharjah is the 'price-comparison' emirate. If your customer is looking there, they're priced-out of Dubai. Use Dubai-mid-market areas (JVC, Damac Hills 2) as the bridge offer.",
  "Abu Dhabi":
    "AD demand cooled YoY. If your customer mentions AD, they're seeking yield, not lifestyle — counter with high-yield Dubai areas (Dubai South, JVC).",
  RAK:
    "RAK is the new 'lifestyle alternative' emirate — Wynn casino, Marjan Island. Expect this to be the fastest-growing emirate basket; we want this on the dashboard before next month's review.",
};

/**
 * The three core sales-playbook scenarios, exposed as data so they can be
 * referenced or extended without editing the component.
 */
export interface PlaybookScenario {
  id: string;
  scenario: string;
  customerSays: string;
  agentResponds: string;
  proof: string;
}

export const SALES_PLAYBOOK: PlaybookScenario[] = [
  {
    id: "wait-for-drop",
    scenario: "\"I'll wait for the market to drop.\"",
    customerSays: "Why buy now? Everyone says prices are falling.",
    agentResponds:
      "You're right to be cautious. But look at this — distressed property searches jumped sharply MoM in UAE. That means the bargain hunters have already started moving. You're not waiting alongside the market, you're competing with it.",
    proof: '"distressed property dubai" — MoM uplift',
  },
  {
    id: "crash",
    scenario: "\"The market is crashing.\"",
    customerSays: "Every news article is about Dubai property crashing.",
    agentResponds:
      "You're reading the same headlines I am — searches for 'dubai property crash' spiked this month. That's fear noise. The actual buyers haven't slowed: thousands searched for apartments to buy last month. The price reset is real; the crash is media-built.",
    proof: '"dubai property crash" surging vs "apartments for sale dubai" steady',
  },
  {
    id: "rates",
    scenario: "\"Mortgage rates are too high.\"",
    customerSays: "I'll wait until rates drop.",
    agentResponds:
      "Mortgage rate searches in UAE dropped sharply from their peak — the rate panic is already past. But here's the gap you want: sellers who listed during the panic haven't repriced their listings yet. That gap closes in 60-90 days. Right now is when patient money makes its play.",
    proof: '"dubai mortgage rates" — well off peak, cooling',
  },
];
