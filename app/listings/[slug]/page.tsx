import { notFound } from "next/navigation";
import { Check, BedDouble, Bath, Building2, Maximize, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Property, Profile } from "@/types";
import { ImageGallery } from "@/components/listings/ImageGallery";
import { PropertyLocationPin } from "@/components/listings/PropertyLocationPin";
import { AgentCard } from "@/components/listings/AgentCard";
import { AgentContactButtons } from "@/components/listings/AgentContactButtons";
import { PropertyEnquiryCTA } from "@/components/listings/PropertyEnquiryCTA";
import { PropertyCard } from "@/components/listings/PropertyCard";
import { LISTING_TYPE_LABELS, STATUS_LABELS } from "@/lib/utils";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://luzonprime.com";

export const revalidate = 3600;

export async function generateStaticParams() {
  const admin = createAdminClient();
  const { data } = await admin.from("properties").select("slug").eq("is_published", true);
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

async function getProperty(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data as Property | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) return { title: "Property not found | Luzon Prime Realtors" };

  const description =
    property.description?.replace(/\s+/g, " ").slice(0, 155) ??
    `${property.title} — available on Luzon Prime Realtors.`;

  return {
    title: `${property.title} | Luzon Prime Realtors`,
    description,
    alternates: { canonical: `/listings/${property.slug}` },
    openGraph: {
      title: property.title,
      description,
      url: `/listings/${property.slug}`,
      type: "website",
      images: property.images?.length ? [property.images[0]] : [],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) notFound();

  const supabase = await createClient();

  const [{ data: agent }, { data: related }] = await Promise.all([
    property.agent_id
      ? supabase.from("profiles").select("*").eq("id", property.agent_id).single()
      : Promise.resolve({ data: null }),
    supabase
      .from("properties")
      .select("*")
      .eq("is_published", true)
      .eq("area", property.area ?? "")
      .neq("id", property.id)
      .limit(3),
  ]);

  const relatedProperties = (related ?? []) as Property[];

  const canonicalUrl = `${siteUrl}/listings/${property.slug}`;
  const listingJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    url: canonicalUrl,
    description: property.description ?? undefined,
    image: property.images?.length ? property.images : undefined,
    datePosted: property.created_at,
    ...(property.area || property.city
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: property.area ?? property.city ?? undefined,
            addressRegion: property.city ?? undefined,
          },
        }
      : {}),
    ...(property.latitude != null && property.longitude != null
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: property.latitude,
            longitude: property.longitude,
          },
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Listings", item: `${siteUrl}/listings` },
      { "@type": "ListItem", position: 3, name: property.title, item: canonicalUrl },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-[1.125rem] lg:px-8 lg:pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ImageGallery
        images={property.images ?? []}
        title={property.title}
        videoUrl={property.video_url}
      />

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {property.listing_type && (
              <span className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-white">
                {LISTING_TYPE_LABELS[property.listing_type] ?? property.listing_type}
              </span>
            )}
            <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white">
              {STATUS_LABELS[property.status] ?? property.status}
            </span>
          </div>

          <h1 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            {property.title}
          </h1>
          {(property.area || property.city) && (
            <p className="mt-1 flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
              <MapPin size={14} />
              {[property.location, property.area, property.city].filter(Boolean).join(", ")}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-6 border-y border-[var(--color-border)] py-4 text-sm text-[var(--color-text)]">
            {property.bedrooms != null && (
              <span className="flex items-center gap-1.5">
                <BedDouble size={16} /> {property.bedrooms} Bedrooms
              </span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-1.5">
                <Bath size={16} /> {property.bathrooms} Bathrooms
              </span>
            )}
            {property.size_sqm != null && (
              <span className="flex items-center gap-1.5">
                <Maximize size={16} /> {property.size_sqm} m²
              </span>
            )}
          </div>

          {property.description && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Description</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[var(--color-text-muted)]">
                {property.description}
              </p>
            </div>
          )}

          {property.features && property.features.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Features</h2>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {property.features.map((feature) => (
                  <span key={feature} className="flex items-center gap-1.5 text-sm text-[var(--color-text)]">
                    <Check size={14} className="text-[var(--color-primary)] dark:text-[var(--color-accent)]" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {property.latitude != null && property.longitude != null && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Location</h2>
              <div className="mt-3">
                <PropertyLocationPin latitude={property.latitude} longitude={property.longitude} />
              </div>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Listed by</h2>
            <div className="mt-3">
              {agent ? (
                <AgentCard agent={agent as Profile} />
              ) : (
                <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-heading)]">
                    <Building2 size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--color-text)]">
                      Luzon Prime Realtors
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Official listing
                    </p>
                  </div>
                  <AgentContactButtons
                    phone="09066792730"
                    email="support@luzonprime.com"
                    name="Luzon Prime Realtors"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <PropertyEnquiryCTA property={property} />
      </div>

      {relatedProperties.length > 0 && (
        <div className="mt-14">
          <h2 className="font-heading text-xl font-bold text-[var(--color-text)]">
            Related listings
          </h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
