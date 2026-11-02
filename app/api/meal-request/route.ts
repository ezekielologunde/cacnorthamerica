import { NextResponse } from "next/server";
import { logToSheet } from "@/lib/sheetsWebhook";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { FORM_HEADER, HONEYPOT_FIELD, looksLikeSpam } from "@/lib/spam";
import { sendMealRequestConfirmationEmail, type MealSlot } from "@/lib/mealRequestEmail";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 200;
const MAX_LONG_FIELD_LENGTH = 1_000;

type MealRequestBody = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ageRange: "0-12" | "13-19" | "20-29" | "30+";
  churchName: string;
  youthLeaderName: string;
  childrenNames: string | null;
  dccZone: string;
  meals: MealSlot[];
  allergies: string | null;
};

const VALID_AGE_RANGES: MealRequestBody["ageRange"][] = ["0-12", "13-19", "20-29", "30+"];
const VALID_MEALS: MealSlot[] = [
  "tue_lunch", "tue_dinner", "wed_lunch", "wed_dinner",
  "thu_lunch", "thu_dinner", "fri_lunch", "fri_dinner",
];

function validateRequestBody(body: unknown): string | null {
  if (!body || typeof body !== "object") {
    return "Request body must be a JSON object";
  }

  const b = body as Partial<MealRequestBody>;
  const requiredStrings: (keyof MealRequestBody)[] = [
    "firstName", "lastName", "email", "phone", "churchName", "youthLeaderName", "dccZone",
  ];
  for (const field of requiredStrings) {
    if (typeof b[field] !== "string" || (b[field] as string).trim() === "") {
      return `${field} is required`;
    }
    if ((b[field] as string).length > MAX_FIELD_LENGTH) {
      return `${field} is too long`;
    }
  }
  if (!EMAIL_RE.test((b.email as string).trim())) {
    return "Please enter a valid email address";
  }
  if (typeof b.ageRange !== "string" || !VALID_AGE_RANGES.includes(b.ageRange as MealRequestBody["ageRange"])) {
    return "ageRange must be one of 0-12, 13-19, 20-29, 30+";
  }
  if (!Array.isArray(b.meals) || b.meals.length === 0) {
    return "meals must be a non-empty array";
  }
  for (const meal of b.meals) {
    if (typeof meal !== "string" || !VALID_MEALS.includes(meal as MealSlot)) {
      return `Invalid meal: ${String(meal)}`;
    }
  }
  if (b.childrenNames !== undefined && b.childrenNames !== null && typeof b.childrenNames !== "string") {
    return "childrenNames must be a string";
  }
  if (typeof b.childrenNames === "string" && b.childrenNames.length > MAX_LONG_FIELD_LENGTH) {
    return "childrenNames is too long";
  }
  if (b.allergies !== undefined && b.allergies !== null && typeof b.allergies !== "string") {
    return "allergies must be a string";
  }
  if (typeof b.allergies === "string" && b.allergies.length > MAX_LONG_FIELD_LENGTH) {
    return "allergies is too long";
  }
  return null;
}

export async function POST(request: Request) {
  if (!rateLimit(clientIp(request.headers), 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Direct API posts that skip our own form code are bots: fake success, drop.
  if (!request.headers.get(FORM_HEADER)) {
    return NextResponse.json({ ok: true });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Honeypot: bots fill every input, people never see this one.
  if (rawBody && typeof rawBody === "object" && (rawBody as Record<string, unknown>)[HONEYPOT_FIELD]) {
    return NextResponse.json({ ok: true });
  }

  const validationError = validateRequestBody(rawBody);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const body = rawBody as MealRequestBody;
  body.email = body.email.trim();

  // Link-stuffed submissions are spam: same quiet fake success as /api/contact.
  const textFields = [
    body.firstName, body.lastName, body.phone, body.churchName, body.youthLeaderName,
    body.dccZone, body.childrenNames ?? "", body.allergies ?? "",
  ];
  if (looksLikeSpam(textFields)) {
    return NextResponse.json({ ok: true });
  }

  logToSheet("YYAM Meal Request", {
    "First Name": body.firstName,
    "Last Name": body.lastName,
    "Email": body.email,
    "Phone": body.phone,
    "Age Range": body.ageRange,
    "Church Name": body.churchName,
    "Youth Leader": body.youthLeaderName,
    "Children Traveling": body.childrenNames || "",
    "DCC / Zone": body.dccZone,
    "Meals": body.meals.join(", "),
    "Allergies": body.allergies || "",
  });

  // The confirmation goes to an unverified address, so cap it per recipient
  // (in-memory, per instance; the row is still logged either way).
  if (!rateLimit(`meal-confirm:${body.email.toLowerCase()}`, 3, 24 * 60 * 60 * 1000)) {
    return NextResponse.json({ ok: true });
  }

  await sendMealRequestConfirmationEmail({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    churchName: body.churchName,
    dccZone: body.dccZone,
    meals: body.meals,
    allergies: body.allergies,
  });

  return NextResponse.json({ ok: true });
}
