import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, Mail, Phone, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile, Property } from "@/types";
import { AgentContactButtons } from "@/components/listings/AgentContactButtons";
import { AgentListings } from "@/components/agents/AgentListings";

async function getAgent(id: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "agent")
    .single();
  return (data as Profile) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const agent = await getAgent(id);
  if (!agent) return { title: "Agent not found | Luzon Prime Realtors" };
  const name = agent.full_name ?? "Luzon Prime Realtors agent";
  return {
    title: `${name} | Luzon Prime Realtors`,
    description: agent.bio ?? `Meet ${name}, an agent at Luzon Prime Realtors.`,
    alternates: { canonical: `/agents/${agent.id}` },
  };
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = await getAgent(id);
  if (!agent) notFound();

  const supabase = await createClient();
  const { data: listingData } = await supabase
    .from("properties")
    .select("*")
    .eq("agent_id", agent.id)
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  const properties = (listingData ?? []) as Property[];

  let email: string | null = null;
  try {
    const admin = createAdminClient();
    const { data } = await admin.auth.admin.getUserById(agent.id);
    email = data.user?.email ?? null;
  } catch {
    // email is optional on the public profile
  }

  const name = agent.full_name ?? "Luzon Prime Agent";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-[1.125rem] lg:px-8">
      <div className="grid gap-6 sm:grid-cols-[220px_1fr]">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[var(--color-bg-muted)] sm:w-[220px]">
          {agent.avatar_url ? (
            <Image
              src={agent.avatar_url}
              alt={`${name} headshot`}
              fill
              sizes="220px"
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
              <User size={56} />
            </div>
          )}
        </div>

        <div>
          <h1 className="font-heading flex items-center gap-2 text-3xl font-bold text-[var(--color-text)]">
            {name}
            {agent.verified && (
              <BadgeCheck size={22} className="text-[var(--color-accent)]" aria-label="Verified agent" />
            )}
          </h1>
          <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">
            Luzon Prime Realtors Agent
          </p>
          {agent.bio && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
              {agent.bio}
            </p>
          )}
          <div className="mt-5">
            <AgentContactButtons phone={agent.phone} email={email} name={name} />
          </div>
        </div>
      </div>

      {(agent.phone || email) && (
        <section className="mt-10">
          <h2 className="font-heading text-xl font-bold text-[var(--color-text)]">
            Contact me
          </h2>
          <dl className="mt-3 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {agent.phone && (
              <div className="flex items-center justify-between gap-4 py-3 text-sm">
                <dt className="flex items-center gap-2 text-[var(--color-text-muted)]">
                  <Phone size={15} /> Phone
                </dt>
                <dd>
                  <a href={`tel:${agent.phone.replace(/\s+/g, "")}`} className="font-medium text-[var(--color-text)] hover:text-[var(--color-primary)]">
                    {agent.phone}
                  </a>
                </dd>
              </div>
            )}
            {email && (
              <div className="flex items-center justify-between gap-4 py-3 text-sm">
                <dt className="flex items-center gap-2 text-[var(--color-text-muted)]">
                  <Mail size={15} /> Email
                </dt>
                <dd>
                  <a href={`mailto:${email}`} className="font-medium text-[var(--color-text)] hover:text-[var(--color-primary)]">
                    {email}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold text-[var(--color-text)]">
          Agent listings
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Explore properties currently listed and managed by this agent.
        </p>
        <div className="mt-6">
          <AgentListings properties={properties} />
        </div>
      </section>
    </div>
  );
}
