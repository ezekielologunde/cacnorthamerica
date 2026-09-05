import { SubConferencePage } from "@/components/ministries/SubConferencePage";
import { setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "Business Group Fellowship — Christ Apostolic Church North America (CACNA)",
  description:
    "CACNA Business Group Fellowship (CACBGF) — inaugurated May 2026, supporting the Church's projects and mentoring members who are business-inclined.",
  alternates: { canonical: "/business-group" },
};

export default async function BusinessGroupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <SubConferencePage
      kicker="Business Group Fellowship"
      headingLines={["Our office is", "a mission field."]}
      intro="CACNA Business Group Fellowship (CACBGF) — a platform for interaction, mentorship, and support among CAC members who are business-inclined."
      leaderLabel="Moderators"
      leaderNames={["Evangelist (Dr.) Efuntoye", "Evangelist Oyarombi"]}
      highlight={{
        label: "Kingdom Economics — Deut. 8:18",
        text: "“Most believers think that our God is present only in prayer, worship, and other church related activities, but looking intensely into the Scripture, we quickly come to see that God is interested in ALL the facets of our earthly activities. Our office is a mission field. Our work is a worship center. Our business place is a platform for witness and our trading place is an altar!”",
      }}
      historyParagraphs={[
        "The CAC Business Group Fellowship (CACBGF) was formally inaugurated by the Authority of the Church on Monday 4th of May, 2026 at Ikeji-Arakeji, Osun State. The CAC Business Group Fellowship was formed to support projects and programs of the Church as well as serve as a platform for interaction, mentorship and support of members of our Church who are business-inclined. It is not a policy-making body, pressure group or Authority in the Church.",
      ]}
      executive={[
        { name: "Pastor Bolaji Oladunni", title: "Chairman" },
        { name: "Engineer Ajibola Osinubi", title: "Vice Chairman" },
        { name: "Evangelist Gbemisola Oluwayimika", title: "Secretary" },
        { name: "Evangelist Olubunmi Otun", title: "Assistant Secretary" },
        { name: "Elder Emmanuel Odetoye", title: "Financial Secretary" },
        { name: "Evangelist Eunice Alabi Oni", title: "Treasurer" },
        { name: "Evangelist Janet Olajide", title: "P.R.O" },
        { name: "Evangelist Adebisi Abikoye", title: "Assistant P.R.O" },
        { name: "Evangelist Wunmi Atomolagun", title: "Assistant P.R.O" },
      ]}
      relatedLink={{ href: "/blog/cacna-business-group-founding-story", label: "Read the Founding Story" }}
    />
  );
}
