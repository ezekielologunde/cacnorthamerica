import { SubConferencePage } from "@/components/ministries/SubConferencePage";

export const metadata = {
  title: "CACMA — Christ Apostolic Church North America (CACNA)",
  description:
    "CAC Latunde Region Men Association (CACMA) — supporting the church's ministers and its Bible training institutions since the church's earliest years.",
  alternates: { canonical: "/cacma" },
};

export default function CACMAPage() {
  return (
    <SubConferencePage
      kicker="CACMA"
      headingLines={["Raising up", "the hands of Moses."]}
      intro="CAC Latunde Region Men Association — the men of CACNA, gathered to support the church's ministers, its Bible training institutions, and its ongoing work."
      leaderLabel="Named at the 2026 Convention"
      leaderNames={["Pastor Dr. Amos Dele Dada"]}
      highlight={{
        label: "2026 Convention Chairman's Address",
        text: "“CACMA, under Pastor Dr. Amos Dele Dada, for their prayers and support.” — thanking the association for its role in the Convention's free-food initiative.",
      }}
      note="CACMA's full identity — its 2026 convention theme and current executive committee — has not yet been published anywhere on either CACNA site. This page will be updated once that information is available; see the Ministries page for CACMA's founding history within Christ Apostolic Church."
      relatedLink={{ href: "/ministries#departments", label: "Read CACMA's History" }}
    />
  );
}
