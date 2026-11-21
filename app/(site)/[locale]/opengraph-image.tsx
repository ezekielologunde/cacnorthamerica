import { ImageResponse } from "next/og";
import { CONVENTION_VENUE_SHORT, currentOrNextConvention, dateRangeLabel } from "@/lib/conventions";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/ogCard";

// The default social image for every page that does not have its own.
export const alt = "Christ Apostolic Church North America, CACNA";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const cy = currentOrNextConvention();
  return new ImageResponse(
    await ogCard({
      kicker: "CACNA",
      title: "Christ Apostolic Church North America",
      detail: `CACNA ${cy.year} Convention: ${dateRangeLabel(cy)}, ${CONVENTION_VENUE_SHORT}`,
      footer: "cacna.org",
    }),
    { ...size },
  );
}
