import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import {
  CONVENTION_VENUE_SHORT,
  activePricing,
  currentOrNextConvention,
  dateRangeLabel,
  hasExternalRegistrationUrl,
  priceForCategory,
  type PricingTier,
} from "@/lib/conventions";
import "./home-mobile.css";
import "./home-refresh.css";

function usd(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(cents / 100);
}

function shortDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));
}

function feeLine(tiers: PricingTier[], category: "adult" | "young_adult"): string | null {
  const tier = tiers.find((t) => t.category === category);
  const cents = priceForCategory(tiers, category);
  if (!tier || cents === null) return null;
  return `${usd(cents)} through ${shortDate(tier.endsOn)}`;
}

type Path = {
  key: string;
  title: string;
  ages: string;
  fee: string | null;
  href?: string;
  external?: boolean;
  tone: "ink" | "red";
};

/**
 * Convention registration, split by age the same way the Youth microsite
 * splits it: adults (30+) use the main form at registrationUrl; children,
 * youth and young adults (under 30) use registrationUrl + "/youth". The
 * youth form only exists for an on-site registration path, so an external
 * registrationUrl (or none) falls back to "registration opens soon".
 */
export function ConventionRegister() {
  const cy = currentOrNextConvention();
  const dates = dateRangeLabel(cy);
  const venue = cy.venue ?? CONVENTION_VENUE_SHORT;
  const external = hasExternalRegistrationUrl(cy);
  const internalReg = cy.registrationUrl && cy.registrationUrl.startsWith("/") ? cy.registrationUrl : undefined;
  const tiers = activePricing(cy);

  const adultFee = feeLine(tiers, "adult");
  const youngAdultFee = feeLine(tiers, "young_adult");
  const childFree = tiers.some((t) => t.category === "child" && t.priceCents === 0);

  const paths: Path[] = [
    {
      key: "adult",
      title: "Adults",
      ages: "Ages 30 and over",
      fee: adultFee,
      href: cy.registrationUrl,
      external,
      tone: "ink",
    },
    {
      key: "youth",
      title: "Children, Youth & Young Adults",
      ages: "Under 30",
      fee: [childFree ? "Free for ages 1–19" : null, youngAdultFee ? `ages 20–29 ${youngAdultFee}` : null].filter(Boolean).join(" · ") || null,
      href: internalReg ? `${internalReg}/youth` : undefined,
      tone: "red",
    },
  ];
  const anyOpen = paths.some((p) => p.href);

  return (
    <section aria-labelledby="convention-register-heading" className="hm-section" style={{ background: "var(--cream)", padding: "clamp(64px,8vw,110px) clamp(20px,5vw,64px)" }}>
      <div className="r2c hm-conv-grid" style={{ maxWidth: 1200, margin: "0 auto", gap: "clamp(32px,5vw,72px)" }}>
        <figure className="hm-conv-photo" style={{ margin: 0, position: "relative", aspectRatio: "4 / 3", borderRadius: 28, overflow: "hidden", boxShadow: "0 28px 60px rgba(18,20,30,.22)", background: "var(--ink)" }}>
          <Image
            src="/photos/gallery-archive/whatsapp-image-2018-07-23-at-10-11-01-pm-1524.jpg"
            alt="Worshipers in matching light-blue shirts raising their hands in praise in a crowded hall, with a speaker at a clear pulpit in the foreground"
            fill
            sizes="(max-width: 860px) 100vw, 580px"
            style={{ objectFit: "cover", objectPosition: "center 55%" }}
          />
        </figure>

        <div>
          <h2 id="convention-register-heading" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(34px,4.6vw,60px)", letterSpacing: "-1.5px", lineHeight: 1, margin: "0 0 18px", textWrap: "balance" }}>
            CACNA {cy.year} Annual Convention
          </h2>
          {cy.theme && (
            <p style={{ fontSize: 17, fontWeight: 700, color: "var(--red)", margin: "0 0 14px" }}>
              Theme: {cy.theme}
            </p>
          )}
          <ul style={{ listStyle: "none", margin: "0 0 26px", padding: 0, display: "flex", flexWrap: "wrap", gap: "10px 24px", fontSize: 15.5, color: "var(--ink)" }}>
            <li style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <CalendarDays size={18} strokeWidth={2} color="var(--red)" aria-hidden /> {dates}
            </li>
            <li style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <MapPin size={18} strokeWidth={2} color="var(--red)" aria-hidden /> {venue}
            </li>
          </ul>

          <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.65, margin: "0 0 22px", maxWidth: 520 }}>
            {anyOpen
              ? "Registration has two forms. Choose the one that matches the age of the person you are registering."
              : "Registration opens soon. Check back here for the adult and under-30 forms."}
          </p>

          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {paths.map((p) => {
              const inner = (
                <>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(19px,1.9vw,23px)", letterSpacing: "-.3px", lineHeight: 1.2 }}>
                      {p.title}
                    </span>
                    <span style={{ display: "block", fontSize: 14.5, fontWeight: 700, marginTop: 4, color: p.tone === "ink" ? "var(--gold)" : "#fff" }}>
                      {p.ages}
                    </span>
                    {p.href && p.fee && (
                      <span style={{ display: "block", fontSize: 14, marginTop: 4, color: "rgba(255,255,255,.82)" }}>{p.fee}</span>
                    )}
                    {!p.href && (
                      <span style={{ display: "block", fontSize: 14, marginTop: 4, color: "rgba(255,255,255,.82)" }}>Registration opens soon</span>
                    )}
                  </span>
                  {p.href && (
                    <span className="hm-reg-arrow" aria-hidden style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 999, display: "grid", placeItems: "center", background: p.tone === "ink" ? "var(--gold)" : "#fff", color: p.tone === "ink" ? "var(--ink)" : "var(--red)" }}>
                      <ArrowRight size={22} strokeWidth={2.5} />
                    </span>
                  )}
                </>
              );
              const rowStyle = {
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18,
                padding: "18px 18px 18px 24px", borderRadius: 20, textDecoration: "none", color: "#fff",
                background: p.tone === "ink" ? "var(--ink)" : "var(--red)",
                boxShadow: p.tone === "ink" ? "0 14px 30px rgba(18,20,30,.22)" : "0 14px 30px rgba(200,30,58,.28)",
              } as const;
              return (
                <li key={p.key}>
                  {p.href ? (
                    p.external ? (
                      <a href={p.href} target="_blank" rel="noopener noreferrer" className="press hm-reg-row" style={rowStyle} aria-label={`Register: ${p.title}, ${p.ages} (opens in a new tab)`}>
                        {inner}
                      </a>
                    ) : (
                      <Link href={p.href} className="press hm-reg-row" style={rowStyle} aria-label={`Register: ${p.title}, ${p.ages}`}>
                        {inner}
                      </Link>
                    )
                  ) : (
                    <div style={rowStyle}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 28px", marginTop: 20 }}>
            <Link href="/youth" className="hm-link hm-text-link" style={{ display: "inline-flex", alignItems: "center", gap: 7, minHeight: 44, fontWeight: 700, fontSize: 15, color: "var(--red)", textDecoration: "none" }}>
              Youth & Young Adult Ministry site <ArrowRight size={16} strokeWidth={2.5} aria-hidden />
            </Link>
            <Link href={cy.href} className="hm-link hm-text-link" style={{ display: "inline-flex", alignItems: "center", gap: 7, minHeight: 44, fontWeight: 700, fontSize: 15, color: "var(--ink)", textDecoration: "none" }}>
              Convention details <ArrowRight size={16} strokeWidth={2.5} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
