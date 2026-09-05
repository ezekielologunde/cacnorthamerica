import { SubConferencePage } from "@/components/ministries/SubConferencePage";
import { setRequestLocale } from "next-intl/server";

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

  return (
    <SubConferencePage
      kicker="Good Women Association"
      headingLines={["Serving with", "open hands."]}
      intro="CAC Latunde Region Good Women Association — leading the family in prayer, hospitality, and generosity at every gathering."
      leaderLabel="Leader"
      leaderNames={["Evang. Mrs. Bolanle Mustapha"]}
      highlight={{
        label: "2026 Convention Welcome Address",
        text: "Leading the department's signature free-food initiative, the Good Women gave $40,000 in 2025 and $50,000 in 2026 toward food for all convention attendees.",
      }}
      executive={[
        { name: "L/Evang. Bolanle Mustapha", title: "Leader" },
        { name: "L/Evang. Bisi Benson", title: "Women Leader" },
        { name: "L/Evang. Janet Olajide", title: "Secretary" },
        { name: "L/Evang. Yomi Adeneye", title: "Chaplain" },
        { name: "L/Evang. Bukola Awosanya", title: "Financial Secretary" },
      ]}
      relatedLink={{ href: "/ministers-wives", label: "Ministers' Wives Conference" }}
    />
  );
}
