export type OrderMethod = "stripe" | "external" | "email";
export type ProductCategory = "apparel" | "bibles" | "music" | "prints";

export interface ProductVariant {
  label: string;
  options: string[];
}

export interface StoreProduct {
  id: string;
  name: string;
  category: ProductCategory;
  desc: string;
  priceDisplay: string;
  priceCents?: number;
  badge?: string;
  orderMethod: OrderMethod;
  externalLink?: string;
  externalLabel?: string;
  accent: string;
  variants?: ProductVariant;
  isDigital?: boolean;
  image?: string;
  imageAlt?: string;
}

export const PRODUCTS: StoreProduct[] = [
  // ── APPAREL ──────────────────────────────────────────────────────────────
  {
    id: "hoodie",
    name: "Salvation Center Hoodie",
    category: "apparel",
    desc: "Premium heavyweight hoodie. Embroidered church logo on chest. Available in Black and Navy.",
    priceDisplay: "$48",
    priceCents: 4800,
    badge: "Best seller",
    orderMethod: "stripe",
    accent: "linear-gradient(135deg,#1B130E,#3A2518)",
    variants: { label: "Size", options: ["S", "M", "L", "XL", "2XL", "3XL"] },
  },
  {
    id: "tshirt",
    name: "Classic Logo T-Shirt",
    category: "apparel",
    desc: "100% cotton crew-neck. Screen-printed Salvation Center shield on the front. Black, White, or Burgundy.",
    priceDisplay: "$28",
    priceCents: 2800,
    orderMethod: "stripe",
    accent: "linear-gradient(135deg,#D62828,#9E1B1B)",
    variants: { label: "Size", options: ["S", "M", "L", "XL", "2XL"] },
  },
  {
    id: "cap",
    name: "Embroidered Dad Cap",
    category: "apparel",
    desc: "Unstructured six-panel cap with a vintage CAC crest embroidered on the front. One size fits most.",
    priceDisplay: "$22",
    priceCents: 2200,
    orderMethod: "stripe",
    accent: "linear-gradient(135deg,#2C1F14,#4A2C18)",
  },
  {
    id: "tote",
    name: "Canvas Tote Bag",
    category: "apparel",
    desc: "Durable natural canvas tote with the Salvation Center motto printed large. Perfect for Sundays and daily carry.",
    priceDisplay: "$16",
    priceCents: 1600,
    orderMethod: "stripe",
    accent: "linear-gradient(135deg,#6B4226,#9E5C32)",
  },
  {
    id: "mug",
    name: "Morning Devotion Mug",
    category: "apparel",
    desc: "15 oz ceramic mug. Psalm 127:1 on one side, church address on the other. Dishwasher safe.",
    priceDisplay: "$14",
    priceCents: 1400,
    orderMethod: "stripe",
    accent: "linear-gradient(135deg,#E8A33D,#C87E20)",
  },

  // ── BIBLES & BOOKS ───────────────────────────────────────────────────────
  {
    id: "kjv-reference",
    name: "KJV Giant Print Reference Bible",
    category: "bibles",
    desc: "Large-print King James Version with cross-references, concordance, and maps. Genuine leather. Recommended for pulpit and study.",
    priceDisplay: "$55",
    badge: "Recommended",
    orderMethod: "external",
    externalLink: "https://www.amazon.com/s?k=KJV+giant+print+reference+Bible+leather",
    externalLabel: "View on Amazon",
    accent: "linear-gradient(135deg,#1B130E,#9E1B1B)",
  },
  {
    id: "niv-study",
    name: "NIV Study Bible (Hardcover)",
    category: "bibles",
    desc: "The classic NIV Study Bible with 20,000+ notes, book introductions, and full-color maps. Used in midweek Bible study.",
    priceDisplay: "$48",
    orderMethod: "external",
    externalLink: "https://www.amazon.com/s?k=NIV+Study+Bible+hardcover",
    externalLabel: "View on Amazon",
    accent: "linear-gradient(135deg,#D62828,#9E1B1B)",
  },
  {
    id: "childrens-bible",
    name: "Children's Illustrated Bible",
    category: "bibles",
    desc: "Full-color illustrated Bible stories for ages 4–12. Over 200 stories in read-aloud language.",
    priceDisplay: "$24",
    orderMethod: "external",
    externalLink: "https://www.amazon.com/s?k=children+illustrated+Bible+stories",
    externalLabel: "View on Amazon",
    accent: "linear-gradient(135deg,#F15F22,#E8A33D)",
  },
  {
    id: "devotional-book",
    name: "Our Daily Bread Devotional",
    category: "bibles",
    desc: "Full-year daily devotional. One page per day: Scripture, reflection, and prayer prompt. Ideal for commuters.",
    priceDisplay: "$18",
    orderMethod: "external",
    externalLink: "https://www.amazon.com/s?k=Our+Daily+Bread+devotional",
    externalLabel: "View on Amazon",
    accent: "linear-gradient(135deg,#9E1B1B,#6B1414)",
  },

  // ── MUSIC ────────────────────────────────────────────────────────────────
  {
    id: "wakati-cd",
    name: "Wakati Itusile — Vol. 1 (CD)",
    category: "music",
    desc: "Debut worship album from the Salvation Center choir. 12 original Yoruba praise and worship tracks. Physical CD.",
    priceDisplay: "$15",
    priceCents: 1500,
    badge: "Church original",
    orderMethod: "stripe",
    accent: "linear-gradient(135deg,#1B130E,#4A2208)",
  },
  {
    id: "wakati-digital",
    name: "Wakati Itusile — Vol. 1 (Digital)",
    category: "music",
    desc: "Download link delivered via email within 24 hours. Full 12-track Yoruba worship album in MP3 and FLAC.",
    priceDisplay: "$10",
    priceCents: 1000,
    badge: "Instant download",
    orderMethod: "stripe",
    accent: "linear-gradient(135deg,#4A2208,#7A3E10)",
    isDigital: true,
  },
  {
    id: "praise-mix",
    name: "Sunday Praise Mix — Live Sessions",
    category: "music",
    desc: "Live worship recordings from Sunday services. Raw, Spirit-led worship. Digital download, link emailed after purchase.",
    priceDisplay: "$8",
    priceCents: 800,
    orderMethod: "stripe",
    accent: "linear-gradient(135deg,#D62828,#6B1414)",
    isDigital: true,
  },
  {
    id: "instrumental",
    name: "Instrumental Worship Backing Tracks",
    category: "music",
    desc: "High-quality instrumental versions of our most-sung hymns. Perfect for prayer and meditation. 20 tracks, link emailed.",
    priceDisplay: "$12",
    priceCents: 1200,
    orderMethod: "stripe",
    accent: "linear-gradient(135deg,#E8A33D,#9E5C32)",
    isDigital: true,
  },

  // ── CUSTOM PRINTS ────────────────────────────────────────────────────────
  {
    id: "scripture-print",
    name: "Custom Scripture Art Print",
    category: "prints",
    desc: "Your chosen Bible verse, beautifully typeset on premium matte cardstock. Sizes: 5×7, 8×10, 11×14. Choose your own verse.",
    priceDisplay: "From $18",
    badge: "Fully custom",
    orderMethod: "email",
    accent: "linear-gradient(135deg,#1B130E,#9E1B1B)",
  },
  {
    id: "anniversary-print",
    name: "2026 Good Women Anniversary Poster",
    category: "prints",
    desc: "Official commemorative print of the 2026 Good Women Anniversary. Archival ink on heavy cardstock. Limited edition.",
    priceDisplay: "From $20",
    badge: "Limited",
    orderMethod: "email",
    accent: "linear-gradient(135deg,#9E1B1B,#D62828)",
  },
  {
    id: "framed-photo",
    name: "Framed Congregation Photo",
    category: "prints",
    desc: "Professionally printed and framed photo from a service or special event. Custom sizes and frame options.",
    priceDisplay: "From $45",
    orderMethod: "email",
    accent: "linear-gradient(135deg,#4A2208,#8B4513)",
  },
  {
    id: "custom-flyer",
    name: "Custom Event Flyer / Bulletin",
    category: "prints",
    desc: "We design and print custom flyers, bulletins, or programs for your ministry event. Fast turnaround, church branding.",
    priceDisplay: "Quote on request",
    orderMethod: "email",
    accent: "linear-gradient(135deg,#E8A33D,#D62828)",
  },
];

export const CATEGORIES: { key: "all" | ProductCategory; label: string }[] = [
  { key: "all",     label: "All"           },
  { key: "apparel", label: "Apparel"       },
  { key: "bibles",  label: "Books & Bibles"},
  { key: "music",   label: "Music"         },
  { key: "prints",  label: "Custom Prints" },
];
