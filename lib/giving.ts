export interface GivingAccount {
  label: string;
  value: string;
}

export interface GivingCampaign {
  slug: string;
  eyebrow: string;
  title: string;
  /** Plain name for emails and the Zelle ledger; `title` is sometimes a tagline. */
  name: string;
  description: string;
  /** Short, ad-friendly one-liner — used by the blog sidebar widget. */
  adBlurb: string;
  accounts: GivingAccount[];
}

export const GIVING_CAMPAIGNS: GivingCampaign[] = [
  {
    slug: "centenary",
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
];

/** The Zelle address a campaign takes gifts at, or null when it has none (the
 *  Centenary project is Nigerian bank accounts only). */
export function zelleRecipientFor(campaign: Pick<GivingCampaign, "accounts">): string | null {
  return campaign.accounts.find((a) => a.label === "Zelle")?.value ?? null;
}
