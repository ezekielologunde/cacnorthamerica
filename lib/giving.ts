export interface GivingAccount {
  label: string;
  value: string;
}

/** What a gift to a campaign is for (e.g. offering or thanksgiving); the donor
 *  picks one and it is appended to the campaign name everywhere the gift shows up. */
export interface GivingPurpose {
  value: string;
  label: string;
}

/** How the giving form groups a campaign: a tithe, an offering (thanksgiving is
 *  a kind of offering, see `purposes`), or a specific project. */
export type GivingKind = "tithe" | "offering" | "project";

export interface GivingCampaign {
  slug: string;
  kind: GivingKind;
  eyebrow: string;
  title: string;
  /** Plain name for emails and the Zelle ledger; `title` is sometimes a tagline. */
  name: string;
  description: string;
  /** Short, ad-friendly one-liner — used by the blog sidebar widget. */
  adBlurb: string;
  accounts: GivingAccount[];
  purposes?: GivingPurpose[];
}

export const GIVING_CAMPAIGNS: GivingCampaign[] = [
  {
    slug: "centenary",
    kind: "project",
    eyebrow: "Featured Campaign",
    title: "CAC Centenary Building Project",
    name: "CAC Centenary Building Project",
    description:
      "Conceived in 2018 to commemorate the Church's 100th anniversary, this project helps solve accommodation challenges on the prayer camp at Ikeji-Arakeji, Nigeria.",
    adBlurb: "Marking 100 years of Christ Apostolic Church — help fund accommodation at the Ikeji-Arakeji prayer camp.",
    accounts: [
      { label: "First Bank — Naira", value: "2046703336" },
      { label: "First Bank — USD", value: "2046963520" },
      { label: "First Bank — GBP", value: "2046963509" },
      { label: "First Bank — EUR", value: "2046963516" },
    ],
  },
  {
    slug: "village-payoff",
    kind: "project",
    eyebrow: "CAC Village",
    title: "CAC Village Pay Off",
    name: "CAC Village Pay Off",
    description:
      "Help pay down the mortgage on CAC Village, Blue Ridge Summit, PA — the home of our Annual Convention.",
    adBlurb: "Help pay down the mortgage on CAC Village — the home of our Annual Convention, every year.",
    accounts: [
      { label: "Chase Bank", value: "Ac# 823986275" },
      { label: "Zelle", value: "cacna@hotmail.com" },
    ],
  },
  {
    slug: "hope-for-all",
    kind: "project",
    eyebrow: "Hope For All Initiative",
    title: "Creating a brighter tomorrow.",
    name: "Hope For All Initiative",
    description:
      "Support Hope For All — CACNA Latunde Region's welfare and evangelism initiative, caring for the needy, supporting evangelism and church planting, and organizing a retirement program for ministers.",
    adBlurb: "Caring for the needy, supporting evangelism and church planting, and caring for retired ministers.",
    accounts: [
      { label: "Bank of America", value: "AC# 4460 4872 3291" },
      { label: "Zelle", value: "charityfinancial8@gmail.com" },
    ],
  },
  {
    slug: "convention-offering",
    kind: "offering",
    eyebrow: "Offering",
    title: "Offering",
    name: "CACNA Offering",
    description:
      "Give as you are led, toward CACNA's ministries and the Annual Convention. This is an offering, not a fundraiser.",
    adBlurb: "Give your offering or thanksgiving online, from wherever you are.",
    accounts: [
      { label: "Zelle", value: "cacnaconvention@gmail.com" },
    ],
    purposes: [
      { value: "regular", label: "Regular" },
      { value: "thanksgiving", label: "Thanksgiving" },
    ],
  },
  {
    slug: "tithe",
    kind: "tithe",
    eyebrow: "Tithe",
    title: "Tithe",
    name: "Tithe",
    description: "Return the first tenth of your increase to the Lord.",
    adBlurb: "Return your tithe online, by card or bank, in about a minute.",
    // No Zelle or bank details yet, so a tithe is given by card or bank through Stripe.
    accounts: [],
  },
];

/** The allowed purpose values for each campaign that has any, for validation. */
export function purposeValuesBySlug(): Record<string, string[]> {
  return Object.fromEntries(
    GIVING_CAMPAIGNS.filter((c) => c.purposes?.length).map((c) => [c.slug, c.purposes!.map((p) => p.value)]),
  );
}

/** `base` with the chosen purpose's label appended ("... — Thanksgiving"), or
 *  `base` unchanged when the campaign has no such purpose. */
export function withPurpose(base: string, campaign: Pick<GivingCampaign, "purposes">, purpose: string | undefined): string {
  const label = campaign.purposes?.find((p) => p.value === purpose)?.label;
  return label ? `${base} — ${label}` : base;
}

/** The Zelle address a campaign takes gifts at, or null when it has none (the
 *  Centenary project is Nigerian bank accounts only). */
export function zelleRecipientFor(campaign: Pick<GivingCampaign, "accounts">): string | null {
  return campaign.accounts.find((a) => a.label === "Zelle")?.value ?? null;
}
