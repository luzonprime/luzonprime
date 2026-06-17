import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/types";
import { PropertiesDataTable } from "@/components/dashboard/PropertiesDataTable";

export default async function AgentPropertiesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: properties } = user
    ? await supabase
        .from("properties")
        .select("*")
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-[var(--color-text)]">
          My Properties
        </h1>
        <Link
          href="/agent/properties/new"
          className="flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus size={16} /> New property
        </Link>
      </div>

      <div className="mt-6">
        <PropertiesDataTable
          properties={(properties ?? []) as Property[]}
          role="agent"
          basePath="/agent/properties"
        />
      </div>
    </div>
  );
}
