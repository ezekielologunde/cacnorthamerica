import { Star } from "lucide-react";

const phrases = [
  "Welcome Home",
  "Come As You Are",
  "Real Worship",
  "Onsite & Online",
  "Every Sunday 10:30 AM",
  "Undiluted Gospel",
  "Real Community",
  "Prayer Changes Things",
];

export function Testimonials() {
  const doubled = [...phrases, ...phrases];

  return (
    <div
      style={{ background: "var(--ink)", color: "var(--cream)", padding: "20px 0", overflow: "hidden", whiteSpace: "nowrap" }}
      aria-hidden
    >
      <div style={{
        display: "inline-block",
        animation: "marquee-run 28s linear infinite",
        fontFamily: "var(--font-display)", fontWeight: 800,
        fontSize: "clamp(22px,3.2vw,32px)", letterSpacing: "-.4px",
      }}>
        {doubled.map((phrase, i) => (
          <span key={i}>
            <span style={{ margin: "0 24px" }}>{phrase}</span>
            <Star size={16} fill="var(--gold)" color="var(--gold)" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 24 }} aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
