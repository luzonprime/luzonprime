import { ImageResponse } from "next/og";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const alt = "Luzon Prime Realtors property";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let title = "Luzon Prime Realtors";
  let location = "Prime real estate, anywhere";
  let priceLabel = "";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && anon) {
    try {
      const supabase = createSupabaseClient(url, anon, {
        auth: { persistSession: false },
      });
      const { data } = await supabase
        .from("properties")
        .select("title, area, city, price, price_label")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
      if (data) {
        title = data.title ?? title;
        location = [data.area, data.city].filter(Boolean).join(", ") || location;
        priceLabel =
          data.price_label ??
          (data.price != null ? `₦${Number(data.price).toLocaleString()}` : "");
      }
    } catch {
      // fall back to brand defaults
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #091f46 0%, #16306b 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 44,
              background: "#C9A84C",
              borderRadius: 999,
            }}
          />
          <div style={{ color: "#ffffff", fontSize: 30, fontWeight: 700 }}>
            Luzon Prime Realtors
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {priceLabel ? (
            <div style={{ color: "#C9A84C", fontSize: 40, fontWeight: 700 }}>
              {priceLabel}
            </div>
          ) : null}
          <div
            style={{
              color: "#ffffff",
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              marginTop: 12,
            }}
          >
            {title.length > 70 ? `${title.slice(0, 70)}…` : title}
          </div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 32, marginTop: 18 }}>
            {location}
          </div>
        </div>

        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 24 }}>
          luzonprime.com
        </div>
      </div>
    ),
    { ...size }
  );
}
