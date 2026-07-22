import Image from "next/image";
import { Award } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Marquee } from "@/components/shared/Marquee";

// DB-driven: reflects only real award records. Renders nothing when there are none.
export async function TrustMarquee() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("awards")
    .select("id, year, title, image_url")
    .eq("is_active", true)
    .order("sort_order");
  const awards = data ?? [];

  if (awards.length === 0) return null;

  return (
    <section
      aria-label="Awards and recognition"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg-muted)] py-5"
    >
      <Marquee speedSeconds={44}>
        {awards.map((a) => (
          <div key={a.id} className="flex items-center gap-2.5 px-6 sm:px-9">
            {a.image_url ? (
              <span className="relative h-5 w-5 shrink-0">
                <Image src={a.image_url} alt="" fill sizes="20px" className="object-contain" />
              </span>
            ) : (
              <Award size={18} className="shrink-0 text-[var(--color-accent)]" />
            )}
            <span className="whitespace-nowrap text-sm font-medium text-[var(--color-text)]">
              {a.title}
              {a.year ? ` — ${a.year}` : ""}
            </span>
            <span className="text-[var(--color-text-muted)]/40" aria-hidden>
              •
            </span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
