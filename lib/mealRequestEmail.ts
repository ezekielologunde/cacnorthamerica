import { Resend } from "resend";
import { escapeHtml } from "@/lib/html";
import { emailShell, EMAIL_FROM } from "@/lib/email";

export type MealSlot =
  | "tue_lunch" | "tue_dinner"
  | "wed_lunch" | "wed_dinner"
  | "thu_lunch" | "thu_dinner"
  | "fri_lunch" | "fri_dinner";

const MEAL_LABEL: Record<MealSlot, string> = {
  tue_lunch: "Tuesday Lunch",
  tue_dinner: "Tuesday Dinner",
  wed_lunch: "Wednesday Lunch",
  wed_dinner: "Wednesday Dinner",
  thu_lunch: "Thursday Lunch",
  thu_dinner: "Thursday Dinner",
  fri_lunch: "Friday Lunch",
  fri_dinner: "Friday Dinner",
};

export type MealRequestConfirmationInput = {
  firstName: string;
  lastName: string;
  email: string;
  churchName: string;
  dccZone: string;
  meals: MealSlot[];
  allergies: string | null;
};

function buildHtml(input: MealRequestConfirmationInput): string {
  const mealRows = input.meals
    .map((m) => `<li style="padding:6px 0;font-size:14.5px;color:#12141E;border-bottom:1px solid #ECE9E4">${MEAL_LABEL[m] ?? m}</li>`)
    .join("");

  const bodyHtml = `<div style="background:#fff;border:1px solid #ECE9E4;border-radius:16px;padding:24px 26px">
    <p style="margin:0 0 4px;font-weight:700;font-size:16px;color:#12141E">${escapeHtml(input.churchName)}</p>
    <p style="margin:0 0 16px;font-size:13.5px;color:#8a8983">${escapeHtml(input.dccZone)}</p>
    <ul style="margin:0;padding:0;list-style:none">${mealRows}</ul>
    ${
      input.allergies
        ? `<p style="margin:16px 0 0;font-size:13px;color:#5f5e5a"><strong style="color:#12141E">Allergies/dietary notes:</strong> ${escapeHtml(input.allergies)}</p>`
        : ""
    }
  </div>`;

  return emailShell({
    heading: "Meal RSVP received!",
    subheading: `Hi ${escapeHtml(input.firstName)}, we've got your meal selections for the CACNA Youth &amp; Young Adult Convention.`,
    bodyHtml,
  });
}

/** Never throws -- mirrors lib/registrationEmail.ts's contract so the
 *  meal-request route can call this without its own try/catch, alongside
 *  the existing fire-and-forget logToSheet() call. */
export async function sendMealRequestConfirmationEmail(input: MealRequestConfirmationInput): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: input.email,
      subject: "Your CACNA Youth Convention meal RSVP",
      html: buildHtml(input),
    });
    if (error) {
      console.error("[meal request email] Resend error:", error);
    }
  } catch (err) {
    console.error("[meal request email] send failed:", err);
  }
}
