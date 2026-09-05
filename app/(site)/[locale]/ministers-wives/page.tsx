import { SubConferencePage } from "@/components/ministries/SubConferencePage";
import { setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "Ministers' Wives Conference — Christ Apostolic Church North America (CACNA)",
  description:
    "CAC Latunde Region Ministers' Wives Conference — leadership and executive committee supporting the wives of CACNA's ministers.",
  alternates: { canonical: "/ministers-wives" },
};

export default async function MinistersWivesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <SubConferencePage
      kicker="Ministers' Wives Conference"
      headingLines={["Standing beside", "those who shepherd."]}
      intro="CAC Latunde Region Ministers' Wives Conference — a fellowship for the wives of CACNA's ministers, gathered in prayer and mutual support."
      leaderLabel="Chairperson"
      leaderNames={["Evang./Mrs. Agnes Agbeja"]}
      executive={[
        { name: "Evang./Mrs. Agnes Agbeja", title: "Chairperson" },
        { name: "Evang./Mrs. Esther Adenodi", title: "Executive Member" },
        { name: "Evang./Mrs. Janet Adelani", title: "Executive Member" },
        { name: "Evang./Mrs. Beatrice Olawale", title: "Executive Member" },
        { name: "Evang./Mrs. Toyin Ademuwagun, Esq.", title: "Secretary" },
      ]}
      relatedLink={{ href: "/good-women", label: "Good Women Association" }}
    />
  );
}
