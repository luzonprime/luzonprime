import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Property, Profile } from "@/types";
import { PropertiesDataTable } from "@/components/dashboard/PropertiesDataTable";

export default async function AdminPropertiesPage() {
  const supabase = await createClient();

  const [{ data: properties }, { data: agents }] = await Promise.all([
    supabase.from("properties").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("*").eq("role", "agent"),
  ]);

  const agentNames = Object.fromEntries(
    ((agents ?? []) as Profile[]).map((a) => [a.id, a.full_name ?? a.id])
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-[var(--color-text)]">
          Properties
        </h1>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus size={16} /> New property
        </Link>
      </div>

      <div className="mt-6">
        <PropertiesDataTable
          properties={(properties ?? []) as Property[]}
          role="admin"
          basePath="/admin/properties"
          agentNames={agentNames}
        />
      </div>
    </div>
  );
}
