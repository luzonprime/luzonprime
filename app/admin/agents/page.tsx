import { createAdminClient } from "@/lib/supabase/admin";
import { UsersCardGrid, type UserRow } from "@/components/dashboard/UsersCardGrid";

export default async function AdminAgentsPage() {
  const admin = createAdminClient();

  const [{ data: authUsers }, { data: profiles }] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
    admin.from("profiles").select("*").eq("role", "agent"),
  ]);

  const emailById = new Map(authUsers.users.map((u) => [u.id, u.email ?? "—"]));

  const rows: UserRow[] = (profiles ?? []).map((p) => ({
    id: p.id,
    full_name: p.full_name,
    email: emailById.get(p.id) ?? "—",
    role: p.role,
    verified: p.verified,
    suspended: p.suspended ?? false,
    avatar_url: p.avatar_url ?? null,
    created_at: p.created_at,
  }));

  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
        {rows.length} agent{rows.length === 1 ? "" : "s"}.
      </p>
      <UsersCardGrid users={rows} />
    </div>
  );
}
