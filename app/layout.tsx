import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SITE, SITE_URL, churchJsonLd } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleTags } from "@/components/analytics/GoogleTags";
import { SiteOverlays } from "@/components/ui/SiteOverlays";
import { createServiceClient } from "@/lib/supabase/server";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Christ Apostolic Church North America (CACNA)",
  description: "CACNA unites Christ Apostolic Church member churches across the United States and Canada under 16 DCCs/Zones, preaching the whole Gospel in a clear and undiluted manner.",
  keywords: [
    "CACNA", "Christ Apostolic Church North America", "Christ Apostolic Church",
    "Nigerian church USA", "Yoruba church", "Aladura church USA",
    "CAC Village", "Blue Ridge Summit convention", "CAC member church",
    "Annual Convention", "online church", "prayer line",
  ],
  applicationName: SITE.shortName,
  alternates: { canonical: "/" },
  icons: { icon: "/images/logo.png", shortcut: "/images/logo.png", apple: "/images/logo.png" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "Christ Apostolic Church North America — Welcome Home",
    description: SITE.description,
    url: SITE_URL,
    locale: "en_US",
    images: [{ url: "/images/congregation.jpg", width: 1200, height: 630, alt: "CACNA congregation in worship" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Christ Apostolic Church North America — Welcome Home",
    description: SITE.description,
    images: ["/images/congregation.jpg"],
  },
  verification: {
    // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in Vercel to emit the Search
    // Console <meta> tag; omitted automatically when unset.
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: "#178055",
  colorScheme: "light",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let bannerAnn: { id: string; title: string; cta_text: string | null; cta_url: string | null; bg_color: string; text_color: string } | null = null;
  try {
    const service = createServiceClient();
    const { data } = await service
      .from("announcements")
      .select("id, title, cta_text, cta_url, bg_color, text_color")
      .eq("active", true)
      .in("placement", ["banner", "both"])
      .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
      .order("sort_order")
      .limit(1)
      .maybeSingle();
    bannerAnn = data ?? null;
  } catch { /* non-blocking */ }
  return (
    <html lang="en" className={`${bricolage.variable} ${jakarta.variable}`}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        {/* Preload hero background so the browser fetches it before CSS is parsed */}
        <link rel="preload" as="image" href="https://img.youtube.com/vi/RX1NjOYtDxo/maxresdefault.jpg" />
      </head>
      <body>
        <script
          type="application/ld+json"
          // Static, app-controlled data only. `<` is escaped so no value can
          // ever break out of the <script> element (JSON-LD hardening).
          dangerouslySetInnerHTML={{ __html: JSON.stringify(churchJsonLd()).replace(/</g, "\\u003c") }}
        />
        <SiteOverlays bannerAnn={bannerAnn} />
        <ScrollProgress />
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
        <SpeedInsights />
        <GoogleTags />
      </body>
    </html>
  );
}
