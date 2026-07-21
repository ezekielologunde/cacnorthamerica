import { SubConferencePage } from "@/components/ministries/SubConferencePage";

export const metadata = {
  title: "Christian Education Department — Christ Apostolic Church North America (CACNA)",
  description:
    "CACNA-CED, the Christian Education Department — 2026 Convention theme, moderator, and a department rooted in the Sunday School movement.",
  alternates: { canonical: "/christian-education" },
};

export default function ChristianEducationPage() {
  return (
    <SubConferencePage
      kicker="Christian Education Department"
      headingLines={["Rooted in", "the Sunday School."]}
      intro="CACNA-CED — soul winning and spiritual re-awakening of the world, through teaching grounded in Scripture, since the church's earliest years."
      theme="The Bible: A Dynamic Force for the Church"
      leaderLabel="Moderator"
      leaderNames={["Evangelist Mrs. Belinda Otusanya", "Philadelphia Zone"]}
      historyParagraphs={[
        "Hebrews 4:12 anchors this year's theme — the conviction that Scripture is not a static text but a living, active force in the life of the Church.",
      ]}
      note="For the department's full worldwide history — from the Sunday School movement's 1780s roots to CACNA's own Christian Education team — see the Ministries page."
      relatedLink={{ href: "/ministries#departments", label: "Read the Full History & Team" }}
    />
  );
}
