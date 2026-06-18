"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Property, Profile } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { ImageDropzone } from "@/components/dashboard/ImageDropzone";
import { MediaDropzone } from "@/components/dashboard/MediaDropzone";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Term = { slug: string; label: string };

// Fallbacks until admin-managed taxonomy_terms load.
const DEFAULT_PROPERTY_TYPES: Term[] = [
  { slug: "apartment", label: "Apartment" },
  { slug: "duplex", label: "Duplex" },
  { slug: "land", label: "Land" },
  { slug: "commercial", label: "Commercial" },
];
const DEFAULT_LISTING_TYPES: Term[] = [
  { slug: "for_sale", label: "For Sale" },
  { slug: "for_rent", label: "For Rent" },
  { slug: "off_plan", label: "Off-Plan" },
];
const DEFAULT_STATUSES: Term[] = [
  { slug: "available", label: "Available" },
  { slug: "sold", label: "Sold" },
  { slug: "rented", label: "Rented" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
      {children}
    </div>
  );
}

const selectClass =
  "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]";

export function PropertyForm({
  role,
  property,
  agents = [],
  action,
  redirectTo,
}: {
  role: "agent" | "admin";
  property?: Property;
  agents?: Profile[];
  action: (formData: FormData) => Promise<{ id: string; slug: string }>;
  redirectTo: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<Term[]>(DEFAULT_PROPERTY_TYPES);
  const [listingTypes, setListingTypes] = useState<Term[]>(DEFAULT_LISTING_TYPES);
  const [statuses, setStatuses] = useState<Term[]>(DEFAULT_STATUSES);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("taxonomy_terms")
      .select("kind, slug, label")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (!data) return;
        const by = (kind: string) =>
          data.filter((t) => t.kind === kind).map((t) => ({ slug: t.slug, label: t.label }));
        const pt = by("property_type");
        const lt = by("listing_type");
        const st = by("status");
        if (pt.length) setPropertyTypes(pt);
        if (lt.length) setListingTypes(lt);
        if (st.length) setStatuses(st);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      await action(formData);
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <Input name="title" required defaultValue={property?.title} placeholder="3-Bedroom Duplex in Lekki" />
        </Field>
        <Field label="Location (street/estate)">
          <Input name="location" defaultValue={property?.location ?? ""} />
        </Field>
        <Field label="Area / Neighbourhood">
          <Input name="area" defaultValue={property?.area ?? ""} />
        </Field>
        <Field label="City">
          <Input name="city" defaultValue={property?.city ?? "Lagos"} />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          name="description"
          rows={4}
          defaultValue={property?.description ?? ""}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Property type">
          <select name="property_type" defaultValue={property?.property_type ?? ""} className={selectClass}>
            <option value="">Select type</option>
            {propertyTypes.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Listing type">
          <select name="listing_type" defaultValue={property?.listing_type ?? ""} className={selectClass}>
            <option value="">Select listing type</option>
            {listingTypes.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={property?.status ?? "available"} className={selectClass}>
            {statuses.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Price (₦)">
          <Input type="number" name="price" min={0} defaultValue={property?.price ?? ""} />
        </Field>
        <Field label="Price label (optional)">
          <Input name="price_label" defaultValue={property?.price_label ?? ""} placeholder="Price on Request" />
        </Field>
        <Field label="Size (sqm)">
          <Input type="number" name="size_sqm" min={0} defaultValue={property?.size_sqm ?? ""} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Bedrooms">
          <Input type="number" name="bedrooms" min={0} defaultValue={property?.bedrooms ?? ""} />
        </Field>
        <Field label="Bathrooms">
          <Input type="number" name="bathrooms" min={0} step="0.5" defaultValue={property?.bathrooms ?? ""} />
        </Field>
        <Field label="Latitude">
          <Input type="number" name="latitude" step="any" defaultValue={property?.latitude ?? ""} />
        </Field>
        <Field label="Longitude">
          <Input type="number" name="longitude" step="any" defaultValue={property?.longitude ?? ""} />
        </Field>
      </div>

      <Field label="Features (comma-separated)">
        <Input name="features" defaultValue={property?.features?.join(", ") ?? ""} placeholder="Pool, Gym, Elevator" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Videos">
          <MediaDropzone
            name="videos"
            accept="video/mp4,video/webm,video/quicktime,video/ogg"
            label="Add property videos"
            existing={property?.videos ?? []}
          />
        </Field>
        <Field label="Virtual tours">
          <MediaDropzone
            name="tours"
            accept="video/mp4,video/webm,video/quicktime,image/jpeg,image/png,image/webp"
            label="Add virtual tour files"
            existing={property?.virtual_tours ?? []}
          />
        </Field>
      </div>

      {role === "admin" && (
        <div className="grid gap-4 rounded-xl border border-[var(--color-border)] p-4 sm:grid-cols-3">
          <Field label="Assign to agent">
            <select name="agent_id" defaultValue={property?.agent_id ?? ""} className={selectClass}>
              <option value="">Unassigned</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.full_name ?? a.id}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-[var(--color-text)]">
            <input type="checkbox" name="is_published" defaultChecked={property?.is_published} />
            Published
          </label>
          <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-[var(--color-text)]">
            <input type="checkbox" name="is_featured" defaultChecked={property?.is_featured} />
            Featured
          </label>
        </div>
      )}

      <Field label="Images">
        <ImageDropzone existingImages={property?.images ?? []} />
      </Field>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : property ? "Save changes" : "Create property"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(redirectTo)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
