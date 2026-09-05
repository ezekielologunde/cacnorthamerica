import { SubConferencePage } from "@/components/ministries/SubConferencePage";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "Christian Education Department — Christ Apostolic Church North America (CACNA)",
  description:
    "CACNA-CED, the Christian Education Department — 2026 Convention theme, moderator, and a department rooted in the Sunday School movement.",
  alternates: { canonical: "/christian-education" },
};

export default async function ChristianEducationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ChristianEducation");

  return (
    <SubConferencePage
      kicker={t("kicker")}
      headingLines={[t("headingLine1"), t("headingLine2")]}
      intro={t("intro")}
      theme={t("theme")}
      leaderLabel={t("leaderLabel")}
      leaderNames={[
        "Chairman: Pastor Gbenga Famojuro, D.Min — Superintendent, 1st In America DCC",
        "Moderator: Evangelist Mrs. Belinda Otusanya — Philadelphia Zone",
      ]}
      highlight={{
        label: t("highlightLabel"),
        text: "\"Between March and April this year, God helped us successfully organize the 49th Decentralized Sunday School Rally of CAC Nigeria & Overseas. More than 8,000 people participated nationwide... I am also excited to announce that preparations have already begun for a very special event: in 2027, we will celebrate the Golden Jubilee of Organized Sunday School in Christ Apostolic Church Nigeria and Overseas.\" — Pastor Sam Olu Falade, DMin, PhD, Director of Christian Education, CAC Nigeria & Overseas",
      }}
      historyParagraphs={[t("history1"), t("history2"), t("history3")]}
      executiveLabel={t("executiveLabel")}
      executive={[
        { name: "Rt. Rev. Prof. Dapo F. Asaju", title: "Bishop of Ilesa Anglican Diocese — \"The Bible: A Dynamic Force for the Church\"" },
        { name: "Evang. Mrs. Janet Olajide", title: "\"The Bible: The Ultimate Authority for Christians\"" },
        { name: "Pastor Adekunmi Browne", title: "Director, Youth & Young Adults CACNA — \"The Authority and Victory of the Word\"" },
        { name: "Pastor Samuel Tunji Ayeni", title: "CED Secretary; VOC USA DCC Rep — \"The Aseity of the Word of God\"" },
        { name: "Pastor Olufemi Olaluwoye", title: "Eastern DCC Superintendent — \"God Said It. Live It\"" },
      ]}
      scheduleYear={2026}
      schedule={[
        {
          dayLabel: "Thursday, July 16, 2026",
          agenda: [
            { time: "9:00–9:03am", event: "Opening Prayer", speaker: "Pastor Segun Olaniyi, VOC Atlanta DCC" },
            { time: "9:04–9:09am", event: "Sunday School Anthem", speaker: "CED Voices" },
            { time: "9:10–9:15am", event: "Welcome Address & Introduction of the Guest Speaker", speaker: "Pastor Dr. Gbenga Famojuro, FITA DCC / Chairman, CED" },
            { time: "9:17–10:07am", event: "Main Lecture — \"The Bible: A Dynamic Force for the Church\"", speaker: "Rt. Rev. Prof. Dapo Folorunso Asaju, Bishop of Diocese, Ilesa" },
            { time: "10:11–10:21am", event: "Q & A Session", speaker: "Pastor Matthew Oladejo, Cornerstone Zone" },
            { time: "10:22–10:27am", event: "Sunday School Exam Matter", speaker: "Pastor Ajibade & Pastor Oderinde, Atlanta DCC" },
            { time: "10:35–10:45am", event: "Prophetic Prayer Blessing", speaker: "Evang. Mrs. Bolanle Mustapha, CACNA Good Women Leader" },
            { time: "10:50–11:00am", event: "Closing Remarks, Blessings & Benediction", speaker: "Pastor Dr. Timothy A.O. Agbeja, Latunde Regional Supt." },
          ],
        },
      ]}
      note={t("note")}
      relatedLink={{ href: "/ministries#departments", label: t("relatedLinkLabel") }}
    />
  );
}
