import { SubConferencePage } from "@/components/ministries/SubConferencePage";
import { mainGalleryPhotos } from "@/lib/mainGalleryPhotos";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}/ministers-wives`]));
  return {
    title: "Ministers' Wives Conference — Christ Apostolic Church North America (CACNA)",
    description:
      "CAC Latunde Region Ministers' Wives Conference — leadership and executive committee supporting the wives of CACNA's ministers.",
    alternates: { canonical: `${SITE_URL}/${locale}/ministers-wives`, languages },
  };
}

export default async function MinistersWivesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("MinistersWives");
  const officer = await getTranslations("OfficerTitle");

  return (
    <SubConferencePage
      kicker={t("kicker")}
      headingLines={[t("headingLine1"), t("headingLine2")]}
      intro={t("intro")}
      photoStrip={{ photos: mainGalleryPhotos.slice(12, 15), caption: "From the 2025 convention" }}
      leaderLabel={t("leaderLabel")}
      leaderNames={["Evang./Mrs. Agnes Agbeja"]}
      executive={[
        { name: "Evang./Mrs. Agnes Agbeja", title: officer("chairperson") },
        { name: "Evang./Mrs. Esther Adenodi", title: officer("executiveMember") },
        { name: "Evang./Mrs. Janet Adelani", title: officer("executiveMember") },
        { name: "Evang./Mrs. Beatrice Olawale", title: officer("executiveMember") },
        { name: "Evang./Mrs. Toyin Ademuwagun, Esq.", title: officer("secretary") },
      ]}
      scheduleYear={2026}
      schedule={[
        {
          dayLabel: "Wednesday, July 15, 2026",
          timeRange: "11:45am – 1:15pm",
          agenda: [
            { time: "11:55am–12:00pm", event: "General Introduction", speaker: "All" },
            { time: "12:00–12:15pm", event: "Welcome Address", speaker: "Evang. Mrs. Agnes Agbeja" },
            { time: "12:15–1:00pm", event: "God's Communication and Purpose — Exodus 3:1-10", speaker: "Mrs. Susanna Oladele" },
            { time: "1:00–1:10pm", event: "Question & Answer" },
            { time: "1:10–1:15pm", event: "Closing Prayer", speaker: "Mrs. Susanna Oladele" },
          ],
        },
        {
          dayLabel: "Thursday, July 16, 2026",
          timeRange: "1:00pm – 2:15pm",
          agenda: [
            { time: "1:10–1:25pm", event: "Share and Care" },
            { time: "1:25–2:00pm", event: "Question & Answer", speaker: "All" },
            { time: "2:10–2:15pm", event: "Closing Prayer", speaker: "Mrs. Susanna Oladele" },
          ],
        },
      ]}
      relatedLink={{ href: "/good-women", label: t("relatedLinkLabel") }}
    />
  );
}
