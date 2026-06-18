import { createAdminClient } from "@/lib/supabase/admin";
import { UsersDataTable, type UserRow } from "@/components/dashboard/UsersDataTable";

export default async function AdminUsersPage() {
  const admin = createAdminClient();

  const [{ data: authUsers }, { data: profiles }] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
    admin.from("profiles").select("*"),
  ]);

  const emailById = new Map(authUsers.users.map((u) => [u.id, u.email ?? "—"]));

  const rows: UserRow[] = (profiles ?? []).map((p) => ({
    id: p.id,
    full_name: p.full_name,
    email: emailById.get(p.id) ?? "—",
    role: p.role,
    verified: p.verified,
    suspended: p.suspended ?? false,
    created_at: p.created_at,
  }));

  return (
    <div>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">
        {rows.length} user{rows.length === 1 ? "" : "s"} across all roles.
      </p>
      <UsersDataTable users={rows} />
    </div>
  );
}
