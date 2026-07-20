// Cache the homepage for 60 s — eliminates cold-start DB round-trips that
// push server response past 1000 ms. Announcements refresh within a minute.
export const revalidate = 60;

import dynamic from "next/dynamic";
import { Nav } from "@/components/navigation/Nav";
import { Hero } from "@/components/sections/Hero";
import { ConventionSpotlight } from "@/components/sections/ConventionSpotlight";
import { createServiceClient } from "@/lib/supabase/server";

// Below-fold sections split into separate JS chunks — browser parses them
// incrementally instead of one blocking task, cutting TBT significantly.
const Watchword     = dynamic(() => import("@/components/sections/Watchword").then(m => ({ default: m.Watchword })));
const PastorWelcome = dynamic(() => import("@/components/sections/PastorWelcome").then(m => ({ default: m.PastorWelcome })));
const WhatToExpect  = dynamic(() => import("@/components/sections/WhatToExpect").then(m => ({ default: m.WhatToExpect })));
const Impact        = dynamic(() => import("@/components/sections/Impact").then(m => ({ default: m.Impact })));
const Events        = dynamic(() => import("@/components/sections/Events").then(m => ({ default: m.Events })));
const LatestNews    = dynamic(() => import("@/components/sections/LatestNews").then(m => ({ default: m.LatestNews })));
const GlobalChurches = dynamic(() => import("@/components/sections/GlobalChurches").then(m => ({ default: m.GlobalChurches })));
const PlanVisit     = dynamic(() => import("@/components/sections/PlanVisit").then(m => ({ default: m.PlanVisit })));
const InstagramFeed = dynamic(() => import("@/components/sections/InstagramFeed").then(m => ({ default: m.InstagramFeed })));
const FooterExperience = dynamic(() => import("@/components/sections/FooterExperience").then(m => ({ default: m.FooterExperience })));

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Christ Apostolic Church North America (CACNA)?",
      acceptedAnswer: { "@type": "Answer", text: "CACNA is the regional body uniting Christ Apostolic Church member churches across the United States, Canada, and South America, organized under 16 DCCs (District Church Councils)/Zones, each led by a Zonal Superintendent." },
    },
    {
      "@type": "Question",
      name: "Where is the CACNA Annual Convention held?",
      acceptedAnswer: { "@type": "Answer", text: "At CAC Village, 14051 Stahley Road, Blue Ridge Summit, PA 17214." },
    },
    {
      "@type": "Question",
      name: "Can I watch CACNA services and the convention online?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Services and the Annual Convention are streamed on YouTube, and a Zoom option is available for the convention. Visit the Watch & Grow page for links." },
    },
    {
      "@type": "Question",
      name: "How do I contact CACNA?",
      acceptedAnswer: { "@type": "Answer", text: "Call (305) 469-0346, or email info@cacnorthamerica.com. Address: 14051 Stahley Road, Blue Ridge Summit, PA 17214." },
    },
  ],
};

export default async function Home() {
  const service = createServiceClient();
  const { data: announcements } = await service
    .from("announcements")
    .select("id, title, body, cta_text, cta_url, bg_color, text_color")
    .eq("active", true)
    .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
    .in("placement", ["homepage", "both"])
    .order("sort_order");

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      <Nav heroDark />
      {announcements?.map((ann) => (
        <div key={ann.id} style={{
          background: ann.bg_color,
          color: ann.text_color,
          padding: "14px clamp(20px,5vw,64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          flexWrap: "wrap",
          textAlign: "center",
        }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{ann.title}</span>
          {ann.body && <span style={{ opacity: 0.85, fontSize: 14 }}>{ann.body}</span>}
          {ann.cta_text && ann.cta_url && (
            <a href={ann.cta_url} style={{
              background: "rgba(255,255,255,0.2)",
              color: ann.text_color,
              fontWeight: 800,
              fontSize: 13,
              padding: "6px 16px",
              borderRadius: 20,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.35)",
              whiteSpace: "nowrap",
            }}>
              {ann.cta_text}
            </a>
          )}
        </div>
      ))}
      <Hero />
      <ConventionSpotlight />
      <Watchword />
      <PastorWelcome />
      <WhatToExpect />
      <Impact />
      <Events />
      <LatestNews />
      <GlobalChurches />
      <PlanVisit />
      <InstagramFeed />
      <FooterExperience />
    </main>
  );
}
