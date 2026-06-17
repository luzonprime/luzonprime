import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";
import { PropertyForm } from "@/components/dashboard/PropertyForm";
import { createProperty } from "@/app/actions/properties";

export default async function NewAdminPropertyPage() {
  const supabase = await createClient();
  const { data: agents } = await supabase.from("profiles").select("*").eq("role", "agent");

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-[var(--color-text)]">
        New property
      </h1>
      <div className="mt-6 max-w-3xl">
        <PropertyForm
          role="admin"
          agents={(agents ?? []) as Profile[]}
          action={createProperty}
          redirectTo="/admin/properties"
        />
      </div>
    </div>
  );
}
