export interface GivingAccount {
  label: string;
  value: string;
}

type LocalizedCampaignText = Pick<GivingCampaign, "eyebrow" | "title" | "description" | "adBlurb">;

export interface GivingCampaign {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Short, ad-friendly one-liner — used by the blog sidebar widget. */
  adBlurb: string;
  accounts: GivingAccount[];
  /** Real Yoruba for the translatable text fields above -- bank/account
   *  details are proper nouns and stay the same in every locale, so
   *  `accounts` itself is never overridden here. Drafted by Claude
   *  (2026-09-05), pending review by the site owner (a Yoruba speaker). */
  translations?: { yo?: LocalizedCampaignText };
}

export const GIVING_CAMPAIGNS: GivingCampaign[] = [
  {
    slug: "centenary",
    eyebrow: "Featured Campaign",
    title: "CAC Centenary Building Project",
    description:
      "Conceived in 2018 to commemorate the Church's 100th anniversary, this project helps solve accommodation challenges on the prayer camp at Ikeji-Arakeji, Nigeria. CACNA members are warmly encouraged to give toward it.",
    adBlurb: "Marking 100 years of Christ Apostolic Church — help fund accommodation at the Ikeji-Arakeji prayer camp.",
    accounts: [
      { label: "First Bank — Naira", value: "2046703336" },
      { label: "First Bank — USD", value: "2046963520" },
      { label: "First Bank — GBP", value: "2046963509" },
      { label: "First Bank — EUR", value: "2046963516" },
    ],
    translations: {
      yo: {
        eyebrow: "Ìpolongo Pàtàkì",
        title: "Iṣẹ́ Ìkọ́lé Ọdún Ọgọ́rùn-ún CAC",
        description:
          "A gbé ọ̀rọ̀ yìí kalẹ̀ ní ọdún 2018 láti ṣe ìrántí ọdún ọgọ́rùn-ún Ìjọ, iṣẹ́ yìí ń ṣe ìrànlọ́wọ́ láti yanjú ìṣòro ibùgbé ní àgọ́ àdúrà ní Ikeji-Arakeji, Nàìjíríà. A gba àwọn ọmọ ẹgbẹ́ CACNA níyànjú pẹ̀lú ìfẹ́ láti fi ẹ̀bùn sí i.",
        adBlurb: "Ń ṣe àmì ọdún ọgọ́rùn-ún Ìjọ Aposteli Kristi — ràn wá lọ́wọ́ láti náwó ibùgbé ní àgọ́ àdúrà Ikeji-Arakeji.",
      },
    },
  },
  {
    slug: "village-payoff",
    eyebrow: "CAC Village",
    title: "CAC Village Pay Off",
    description:
      "Help pay down the mortgage on CAC Village, Blue Ridge Summit, PA — the home of our Annual Convention. Kindly send your donations to the CAC Village account below.",
    adBlurb: "Help pay down the mortgage on CAC Village — the home of our Annual Convention, every year.",
    accounts: [
      { label: "Chase Bank", value: "Ac# 823986275" },
      { label: "Zelle", value: "cacna@hotmail.com" },
    ],
    // Adapted from Convention's own already-reviewed Give.villageBody --
    // that site's account paragraph says "the account below" where CACNA's
    // English says "the CAC Village account below"; adjusted to match.
    translations: {
      yo: {
        eyebrow: "Abúlé CAC",
        title: "Sísan Gbèsè Abúlé CAC",
        description:
          "Ràn wá lọ́wọ́ láti san gbèsè (mortgage) Abúlé CAC, tí ó wà ní Blue Ridge Summit, PA — ilé Àpéjọ Ọdọọdún wa. Jọ̀wọ́ fi ẹ̀bùn rẹ ránṣẹ́ sí àkọọ́lẹ̀ Abúlé CAC tí ó wà nísàlẹ̀.",
        adBlurb: "Ràn wá lọ́wọ́ láti san gbèsè Abúlé CAC — ilé Àpéjọ Ọdọọdún wa, lọ́dọọdún.",
      },
    },
  },
  {
    slug: "hope-for-all",
    eyebrow: "Hope For All Initiative",
    title: "Creating a brighter tomorrow.",
    description:
      "Support Hope For All — CACNA Latunde Region's welfare and evangelism initiative, caring for the needy, supporting evangelism and church planting, and organizing a retirement program for ministers.",
    adBlurb: "Caring for the needy, supporting evangelism and church planting, and caring for retired ministers.",
    accounts: [
      { label: "Bank of America", value: "AC# 4460 4872 3291" },
      { label: "Zelle", value: "charityfinancial8@gmail.com" },
    ],
    translations: {
      yo: {
        eyebrow: "Ìpìlẹ̀ṣẹ̀ Ìrètí Fún Gbogbo Ènìyàn",
        title: "Ń dá ọjọ́ ọ̀la tí ó dán yíyanilójú.",
        description:
          "Ṣe àtìlẹ́yìn fún Ìrètí Fún Gbogbo Ènìyàn — ìpìlẹ̀ṣẹ̀ ìtọ́jú àti ìjíhìnrere ti Ẹkùn Latunde CACNA, tí ń tọ́jú àwọn tálákà, tí ń ṣe àtìlẹ́yìn fún ìjíhìnrere àti ìdásílẹ̀ ìjọ, àti tí ń ṣètò ètò ìtìsinlẹ́ fún àwọn òjíṣẹ́.",
        adBlurb: "Ń tọ́jú àwọn tálákà, ń ṣe àtìlẹ́yìn fún ìjíhìnrere àti ìdásílẹ̀ ìjọ, àti ń tọ́jú àwọn òjíṣẹ́ tí wọ́n ti fẹ̀yìn tì.",
      },
    },
  },
];

/** Merges in a campaign's Yoruba text when `locale` is "yo" and a
 *  translation exists; falls back to the English fields otherwise (honest
 *  placeholder, same pattern as messages/yo.json). Bank/account details in
 *  `accounts` are never overridden -- those are the same in every locale. */
export function localizeCampaign(campaign: GivingCampaign, locale: string): GivingCampaign {
  const yo = locale === "yo" ? campaign.translations?.yo : undefined;
  return yo ? { ...campaign, ...yo } : campaign;
}
