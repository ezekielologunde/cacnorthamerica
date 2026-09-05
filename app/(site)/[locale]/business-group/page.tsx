import { SubConferencePage } from "@/components/ministries/SubConferencePage";
import { getTranslations, setRequestLocale } from "next-intl/server";

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
  const t = await getTranslations("BusinessGroup");
  const officer = await getTranslations("OfficerTitle");

  return (
    <SubConferencePage
      kicker={t("kicker")}
      headingLines={[t("headingLine1"), t("headingLine2")]}
      intro={t("intro")}
      leaderLabel={t("leaderLabel")}
      leaderNames={["Evangelist (Dr.) Efuntoye", "Evangelist Oyarombi"]}
      highlight={{
        label: t("highlightLabel"),
        text: "“Most believers think that our God is present only in prayer, worship, and other church related activities, but looking intensely into the Scripture, we quickly come to see that God is interested in ALL the facets of our earthly activities. Our office is a mission field. Our work is a worship center. Our business place is a platform for witness and our trading place is an altar!”",
      }}
      historyParagraphs={[t("history1")]}
      executive={[
        { name: "Pastor Bolaji Oladunni", title: officer("chairman") },
        { name: "Engineer Ajibola Osinubi", title: officer("viceChairman") },
        { name: "Evangelist Gbemisola Oluwayimika", title: officer("secretary") },
        { name: "Evangelist Olubunmi Otun", title: officer("assistantSecretary") },
        { name: "Elder Emmanuel Odetoye", title: officer("financialSecretary") },
        { name: "Evangelist Eunice Alabi Oni", title: officer("treasurer") },
        { name: "Evangelist Janet Olajide", title: officer("pro") },
        { name: "Evangelist Adebisi Abikoye", title: officer("assistantPro") },
        { name: "Evangelist Wunmi Atomolagun", title: officer("assistantPro") },
      ]}
      scheduleYear={2026}
      schedule={[
        {
          dayLabel: "Thursday, July 16, 2026",
          agenda: [
            { time: "11:15–11:20am", event: "Opening Prayer", speaker: "Pastor (Dr.) Mathew Babalola" },
            { time: "11:20–11:30am", event: "Chairman's Speech", speaker: "Pastor Bolaji Oladunni" },
            { time: "11:35am–12:05pm", event: "Guest Speaker's Lecture", speaker: "Dr. Jumoke Ojo" },
            { time: "12:05–12:15pm", event: "Questions and Answers", speaker: "Evangelist Janet Olajide" },
            { time: "12:15–12:25pm", event: "Kingdom Partners", speaker: "Evangelist Abikoye" },
            { time: "12:25–12:40pm", event: "Raffle Tickets / Prizes", speaker: "Evangelist Janet Olajide" },
            { time: "12:45pm", event: "Introduction of the Regional Superintendent", speaker: "Pastor Gabriel Idowu" },
            { event: "Closing Prayer and Benediction", speaker: "Pastor (Dr.) T.O.A. Agbeja" },
          ],
        },
      ]}
      relatedLink={{ href: "/blog/cacna-business-group-founding-story", label: t("relatedLinkLabel") }}
    />
  );
}
