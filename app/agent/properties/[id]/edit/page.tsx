import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/types";
import { PropertyForm } from "@/components/dashboard/PropertyForm";
import { updateProperty } from "@/app/actions/properties";

export default async function EditAgentPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (!property || property.agent_id !== user?.id) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-[var(--color-text)]">
        Edit property
      </h1>
      <div className="mt-6 max-w-3xl">
        <PropertyForm
          role="agent"
          property={property as Property}
          action={updateProperty.bind(null, id)}
          redirectTo="/agent/properties"
        />
      </div>
    </div>
  );
}
