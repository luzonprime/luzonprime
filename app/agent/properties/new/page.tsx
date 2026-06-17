import { PropertyForm } from "@/components/dashboard/PropertyForm";
import { createProperty } from "@/app/actions/properties";

export default function NewAgentPropertyPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-[var(--color-text)]">
        New property
      </h1>
      <div className="mt-6 max-w-3xl">
        <PropertyForm role="agent" action={createProperty} redirectTo="/agent/properties" />
      </div>
    </div>
  );
}
