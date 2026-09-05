import { SubConferencePage } from "@/components/ministries/SubConferencePage";
import { mainGalleryPhotos } from "@/lib/mainGalleryPhotos";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "Good Women Association — Christ Apostolic Church North America (CACNA)",
  description:
    "CAC Latunde Region Good Women Association — leadership, executive committee, and the department's signature free-food initiative at the Annual Convention.",
  alternates: { canonical: "/good-women" },
};

export default async function GoodWomenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("GoodWomen");
  const officer = await getTranslations("OfficerTitle");

  return (
    <SubConferencePage
      kicker={t("kicker")}
      headingLines={[t("headingLine1"), t("headingLine2")]}
      intro={t("intro")}
      photoStrip={{ photos: mainGalleryPhotos.slice(9, 12), caption: "From the 2025 convention" }}
      leaderLabel={t("leaderLabel")}
      leaderNames={["Evang. Mrs. Bolanle Mustapha"]}
      highlight={{
        label: t("highlightLabel"),
        text: "Leading the department's signature free-food initiative, the Good Women gave $40,000 in 2025 and $50,000 in 2026 toward food for all convention attendees.",
      }}
      executive={[
        { name: "L/Evang. Bolanle Mustapha", title: officer("leader") },
        { name: "L/Evang. Bisi Benson", title: officer("womenLeader") },
        { name: "L/Evang. Janet Olajide", title: officer("secretary") },
        { name: "L/Evang. Yomi Adeneye", title: officer("chaplain") },
        { name: "L/Evang. Bukola Awosanya", title: officer("financialSecretary") },
      ]}
      scheduleYear={2026}
      schedule={[
        {
          dayLabel: "Wednesday, July 15, 2026",
          timeRange: "11:45am – 1:15pm",
          agenda: [
            { time: "11:45–11:50am", event: "Moderator's Opening Statement", speaker: "Evang. Bisi Benson" },
            { time: "11:50–11:55am", event: "Opening Prayer", speaker: "Evang. Mrs. Bukola Awosanya" },
            { time: "12:00–12:05pm", event: "CACNAGWA Leader's Address", speaker: "Evang. Mrs. Bolanle Mustapha" },
            { time: "12:05–12:15pm", event: "Special Presentation", speaker: "CACNAGWA Choir" },
            { time: "12:15–1:05pm", event: "Raising Godly Children in Navigating Cultural and Social Challenges" },
            { time: "1:10–1:15pm", event: "Closing Prayers", speaker: "Evang. Bola Ajisafe" },
          ],
        },
        {
          dayLabel: "Wednesday, July 15, 2026",
          timeRange: "3:30 – 5:00pm",
          agenda: [
            { event: "Raising Godly Children in Navigating Cultural and Social Challenges (continued)" },
            { event: "Special Presentation", speaker: "CACNAGWA Drama" },
            { event: "Closing Remarks", speaker: "L/E Bolanle Mustapha" },
            { event: "Closing Prayers & Benediction", speaker: "Pastor Dr. Hezekiah Ilufoye" },
          ],
        },
        {
          dayLabel: "Thursday, July 16, 2026",
          timeRange: "3:30 – 5:00pm",
          agenda: [
            { event: "Special Presentation", speaker: "CACNAGWA Drama Group" },
            { event: "Reflections on Raising Godly Children in Marriages" },
            { event: "Closing Remarks", speaker: "Pastor Wale Adelegan" },
            { event: "Closing Prayers & Benediction", speaker: "Pastor Dr. Hezekiah Ilufoye" },
          ],
        },
      ]}
      relatedLink={{ href: "/ministers-wives", label: t("relatedLinkLabel") }}
    />
  );
}
