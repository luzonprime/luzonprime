import { createClient } from "@/lib/supabase/server";
import { InquiriesDataTable } from "@/components/dashboard/InquiriesDataTable";
import type { Inquiry, Profile, Property } from "@/types";

export default async function AdminInquiriesPage() {
  const supabase = await createClient();

  const [{ data: inquiries }, { data: properties }, { data: agents }] = await Promise.all([
    supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
    supabase.from("properties").select("id, title"),
    supabase.from("profiles").select("*").eq("role", "agent"),
  ]);

  const propertyTitles = Object.fromEntries(
    ((properties ?? []) as Pick<Property, "id" | "title">[]).map((p) => [p.id, p.title])
  );

  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
        {(inquiries ?? []).length} total inquiries.
      </p>
      <InquiriesDataTable
        inquiries={(inquiries ?? []) as Inquiry[]}
        propertyTitles={propertyTitles}
        agents={(agents ?? []) as Profile[]}
      />
    </div>
  );
}
