import { ImageResponse } from "next/og";
import { CONVENTION_VENUE_SHORT, conventionYears, currentOrNextConvention, dateRangeLabel } from "@/lib/conventions";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/ogCard";

// Social image for /events/cacna-YYYY (the convention save-the-date and registration pages).
export const alt = "CACNA Annual Convention, Christ Apostolic Church North America";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const year = Number(/^cacna-(\d{4})$/.exec(slug)?.[1]);
  const cy = conventionYears.find((c) => c.year === year) ?? currentOrNextConvention();
  return new ImageResponse(
    await ogCard({
      kicker: "Annual Convention",
      title: `CACNA ${cy.year} National Convention`,
      detail: dateRangeLabel(cy),
      footer: `${CONVENTION_VENUE_SHORT} · cacna.org`,
    }),
    { ...size },
  );
}
