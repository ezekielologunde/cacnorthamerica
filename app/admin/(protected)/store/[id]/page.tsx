import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";

type ProductRow = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price_display: string;
  price_cents: number;
  badge: string | null;
  image_url: string | null;
  image_alt: string | null;
  order_method: string;
  stripe_price_id: string | null;
  external_link: string | null;
  external_label: string | null;
  published: boolean;
  sort_order: number;
  is_digital: boolean;
  digital_file_url: string | null;
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const result = await supabase
    .from("products")
    .select("id, name, category, description, price_display, price_cents, badge, image_url, image_alt, order_method, stripe_price_id, external_link, external_label, published, sort_order, is_digital, digital_file_url")
    .eq("id", id)
    .single();

  const product = result.data as ProductRow | null;
  if (!product) notFound();

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <Link href="/admin/store" style={{ color: "var(--ink-soft)", fontSize: 13, textDecoration: "none" }}>
          ← Store
        </Link>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "8px 0 0" }}>Edit Product</h1>
          {product.published && (
            <Link
              href="/store"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, fontWeight: 600, color: "var(--red)", textDecoration: "none", whiteSpace: "nowrap" }}
            >
              View on site ↗
            </Link>
          )}
        </div>
      </div>
      <div style={{ background: "white", borderRadius: 12, padding: "32px 36px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <ProductForm product={product} />
      </div>
    </div>
  );
}
