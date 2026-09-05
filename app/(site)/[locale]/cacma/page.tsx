import { SubConferencePage } from "@/components/ministries/SubConferencePage";
import { setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "CACMA — Christ Apostolic Church North America (CACNA)",
  description:
    "CAC Latunde Region Men Association (CACMA) — supporting the church's ministers and its Bible training institutions since the church's earliest years.",
  alternates: { canonical: "/cacma" },
};

export default async function CACMAPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

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
      scheduleYear={2026}
      schedule={[
        {
          dayLabel: "Wednesday, July 15, 2026",
          timeRange: "Early Afternoon · 11:45am – 1:15pm",
          agenda: [
            { time: "11:45–11:50am", event: "Opening Prayer", speaker: "Pastor Amos Adetobi" },
            { time: "11:50am–12:00noon", event: "Choruses" },
            { time: "12:00–12:45pm", event: "Message — \"Love the Bible, Love God\"", speaker: "Pastor Gabriel S. Dada, Superintendent, CAC Babalola Region" },
            { time: "12:45–1:00pm", event: "Q & A" },
            { time: "1:00–1:10pm", event: "Fund Raising — CACMA" },
            { time: "1:10–1:15pm", event: "Prayer and Closing", speaker: "Regional Superintendent" },
          ],
        },
        {
          dayLabel: "Wednesday, July 15, 2026",
          timeRange: "Late Afternoon · 3:30 – 5:00pm",
          agenda: [
            { time: "3:35–3:45pm", event: "Choruses" },
            { time: "3:45–4:05pm", event: "Annual Report", speaker: "Pastor Amos Dada" },
            { time: "4:05–4:20pm", event: "Become a Practicing Christian", speaker: "Pastor Amos Dada" },
            { time: "4:20–4:35pm", event: "Financial Report", speaker: "Engr. Sunday Kalejaiye" },
            { time: "4:45–5:00pm", event: "Closing Prayer", speaker: "Pastor T.A.O. Agbeja" },
          ],
        },
        {
          dayLabel: "Thursday, July 16, 2026",
          timeRange: "Afternoon · 1:00 – 2:15pm",
          agenda: [
            { time: "1:10–1:50pm", event: "Message — \"Mobilizing Men to Fulfil Purpose\"", speaker: "Pastor Francis A. Olaniyi, Provost, CAC Theological Seminary" },
            { time: "1:55–2:05pm", event: "Fundraising for CACMA Project" },
            { time: "2:05pm", event: "Closing Prayer", speaker: "Pastor S.O. Oladele" },
          ],
        },
      ]}
      note="CACMA's full identity — its 2026 convention theme and current executive committee — has not yet been published anywhere on either CACNA site. This page will be updated once that information is available; see the Ministries page for CACMA's founding history within Christ Apostolic Church."
      relatedLink={{ href: "/ministries#departments", label: "Read CACMA's History" }}
    />
  );
}
