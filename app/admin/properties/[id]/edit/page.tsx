import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Property, Profile } from "@/types";
import { PropertyForm } from "@/components/dashboard/PropertyForm";
import { updateProperty } from "@/app/actions/properties";

export default async function EditAdminPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: property }, { data: agents }] = await Promise.all([
    supabase.from("properties").select("*").eq("id", id).single(),
    supabase.from("profiles").select("*").eq("role", "agent"),
  ]);

  if (!property) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-[var(--color-text)]">
        Edit property
      </h1>
      <div className="mt-6 max-w-3xl">
        <PropertyForm
          role="admin"
          property={property as Property}
          agents={(agents ?? []) as Profile[]}
          action={updateProperty.bind(null, id)}
          redirectTo="/admin/properties"
        />
      </div>
    </div>
  );
}
