import type { RegistrationSummary } from "@/lib/checkoutSummary";
import type { RegistrantCategory } from "@/lib/conventions";
import { describeMeals, describeYouthRegistrant } from "@/lib/youthRegistration";
import { checkinCodesFor } from "@/lib/checkinCode";

const CATEGORY_LABEL: Record<RegistrantCategory, string> = {
  adult: "Adult",
  young_adult: "Young Adult",
  child: "Child",
};

/** The confirmation page's list of registrants. The check-in code is the
 *  only check-in method, so each person's code sits large on its own line
 *  straight under their name. A separate component so
 *  scripts/check-confirmation-codes.mjs can render it on its own. */
export function RegistrantCheckinList({ summary, startIso }: { summary: RegistrationSummary; startIso?: string }) {
  const codes = checkinCodesFor(summary);
  return (
    <ul style={{ margin: "16px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
      {summary.registrants.map((r, i) => {
        // Youth & Child registrants show their age group and meals;
        // adult individual-mode registrants show their meals.
        const youth = describeYouthRegistrant(r, startIso);
        const meals = youth ? youth.meals : describeMeals(r.m, startIso);
        return (
          <li key={i} style={{ fontSize: 14.5, paddingBottom: 12, borderBottom: "1px solid rgba(245,246,250,.1)" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", columnGap: 12, rowGap: 2 }}>
              <span style={{ color: "var(--cream)", fontWeight: 700, minWidth: 0, overflowWrap: "anywhere" }}>{r.n}</span>
              <span style={{ color: "rgba(245,246,250,.6)" }}>{youth ? youth.ageGroup : (CATEGORY_LABEL[r.c] ?? "Adult")}</span>
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(245,246,250,.7)", margin: "8px 0 4px" }}>
              Check-in code
            </p>
            <code
              data-checkin-code
              style={{
                display: "inline-block",
                maxWidth: "100%",
                fontFamily: "ui-monospace, Consolas, Menlo, monospace",
                fontSize: 28,
                lineHeight: 1.2,
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: "#fff",
                background: "rgba(245,246,250,.08)",
                border: "1px solid rgba(245,246,250,.22)",
                borderRadius: 8,
                padding: "4px 8px 4px 14px",
                userSelect: "all",
                overflowWrap: "anywhere",
              }}
            >
              {codes[i]}
            </code>
            {meals && (
              <p style={{ fontSize: 12.5, color: "rgba(245,246,250,.55)", margin: "8px 0 0", lineHeight: 1.5 }}>
                Meals: {meals.length > 0 ? meals.join(", ") : "None"}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
