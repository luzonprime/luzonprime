import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/types";
import { PropertiesCardGrid } from "@/components/dashboard/PropertiesCardGrid";

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
    <PropertiesCardGrid
      properties={(properties ?? []) as Property[]}
      role="agent"
      basePath="/agent/properties"
      action={
        <Link
          href="/agent/properties/new"
          className="flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus size={16} /> New property
        </Link>
      }
    />
  );
}
