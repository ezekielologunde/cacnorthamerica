// Cache the homepage for 60 s — eliminates cold-start DB round-trips that
// push server response past 1000 ms. Announcements refresh within a minute.
export const revalidate = 60;

import dynamic from "next/dynamic";
import { Nav } from "@/components/navigation/Nav";
import { Hero } from "@/components/sections/Hero";
import { createServiceClient } from "@/lib/supabase/server";

// Below-fold sections split into separate JS chunks — browser parses them
// incrementally instead of one blocking task, cutting TBT significantly.
const Watchword     = dynamic(() => import("@/components/sections/Watchword").then(m => ({ default: m.Watchword })));
const Testimonials  = dynamic(() => import("@/components/sections/Testimonials").then(m => ({ default: m.Testimonials })));
const PastorWelcome = dynamic(() => import("@/components/sections/PastorWelcome").then(m => ({ default: m.PastorWelcome })));
const WhatToExpect  = dynamic(() => import("@/components/sections/WhatToExpect").then(m => ({ default: m.WhatToExpect })));
const Impact        = dynamic(() => import("@/components/sections/Impact").then(m => ({ default: m.Impact })));
const GrowResources = dynamic(() => import("@/components/sections/Youth").then(m => ({ default: m.Youth })));
const Events        = dynamic(() => import("@/components/sections/Events").then(m => ({ default: m.Events })));
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
      name: "What time is Sunday service at CAC Salvation Center?",
      acceptedAnswer: { "@type": "Answer", text: "Sunday worship begins at 10:30 AM ET at 10710 Marriottsville Rd, Randallstown, MD 21133. All are welcome — in person or online." },
    },
    {
      "@type": "Question",
      name: "Where is CAC Salvation Center located?",
      acceptedAnswer: { "@type": "Answer", text: "10710 Marriottsville Rd, Randallstown, MD 21133 — part of the Christ Apostolic Church Baltimore-Maryland District." },
    },
    {
      "@type": "Question",
      name: "Can I watch the Sunday service online?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Every Sunday at 10:30 AM ET we stream live on YouTube, Facebook, and Zoom. Visit cacsalvationcenter.org/online for the links." },
    },
    {
      "@type": "Question",
      name: "How do I contact CAC Salvation Center?",
      acceptedAnswer: { "@type": "Answer", text: "Call or WhatsApp +1 443-272-6794, or email info@cacsalvationcenter.org. Address: 10710 Marriottsville Rd, Randallstown, MD 21133." },
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
      <Watchword />
      <Testimonials />
      <PastorWelcome />
      <WhatToExpect />
      <Impact />
      <GrowResources />
      <Events />
      <GlobalChurches />
      <PlanVisit />
      <InstagramFeed />
      <FooterExperience />
    </main>
  );
}
