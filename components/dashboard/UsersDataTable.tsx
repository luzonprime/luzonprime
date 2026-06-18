"use client";

import { useState, useTransition } from "react";
import { Ban, CheckCircle2, ShieldCheck, ShieldOff } from "lucide-react";
import { setAgentVerified, setUserSuspended } from "@/app/actions/users";
import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";

export interface UserRow {
  id: string;
  full_name: string | null;
  email: string;
  role: "client" | "agent" | "admin";
  verified: boolean;
  suspended: boolean;
  created_at: string;
}

const ROLE_LABELS: Record<string, string> = { client: "Client", agent: "Agent", admin: "Admin" };

export function UsersDataTable({ users }: { users: UserRow[] }) {
  const [rows, setRows] = useState(users);
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  function handleToggleSuspend(id: string, next: boolean) {
    setPendingId(id);
    startTransition(async () => {
      try {
        await setUserSuspended(id, next);
        setRows((prev) => prev.map((u) => (u.id === id ? { ...u, suspended: next } : u)));
      } finally {
        setPendingId(null);
      }
    });
  }

  function handleToggleVerified(id: string, next: boolean) {
    setPendingId(id);
    startTransition(async () => {
      try {
        await setAgentVerified(id, next);
        setRows((prev) => prev.map((u) => (u.id === id ? { ...u, verified: next } : u)));
      } finally {
        setPendingId(null);
      }
    });
  }

  const columns: DataTableColumn<UserRow>[] = [
    { key: "full_name", header: "Name", sortable: true, render: (u) => u.full_name ?? "—" },
    { key: "email", header: "Email", sortable: true },
    { key: "role", header: "Role", sortable: true, render: (u) => ROLE_LABELS[u.role] ?? u.role },
    {
      key: "verified",
      header: "Verified",
      render: (u) =>
        u.role === "agent" ? (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              u.verified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
            }`}
          >
            {u.verified ? "Verified" : "Unverified"}
          </span>
        ) : (
          "—"
        ),
    },
    {
      key: "suspended",
      header: "Status",
      render: (u) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            u.suspended ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {u.suspended ? "Suspended" : "Active"}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      searchPlaceholder="Search users..."
      emptyMessage="No users yet."
      rowActions={(u) => (
        <>
          {u.role === "agent" && (
            <button
              type="button"
              title={u.verified ? "Unverify agent" : "Verify agent"}
              disabled={isPending && pendingId === u.id}
              onClick={() => handleToggleVerified(u.id, !u.verified)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)]"
            >
              {u.verified ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}
            </button>
          )}
          <button
            type="button"
            title={u.suspended ? "Unsuspend user" : "Suspend user"}
            disabled={isPending && pendingId === u.id}
            onClick={() => handleToggleSuspend(u.id, !u.suspended)}
            className={`flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--color-bg-muted)] ${
              u.suspended ? "text-green-600" : "text-red-500"
            }`}
          >
            {u.suspended ? <CheckCircle2 size={15} /> : <Ban size={15} />}
          </button>
        </>
      )}
    />
  );
}
