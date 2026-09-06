import { NextResponse } from "next/server";
import { logToSheet } from "@/lib/sheetsWebhook";
import { rateLimit } from "@/lib/rateLimit";
import { sendMealRequestConfirmationEmail, type MealSlot } from "@/lib/mealRequestEmail";

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
  if (b.allergies !== undefined && b.allergies !== null && typeof b.allergies !== "string") {
    return "allergies must be a string";
  }
  return null;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validationError = validateRequestBody(rawBody);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const body = rawBody as MealRequestBody;

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
