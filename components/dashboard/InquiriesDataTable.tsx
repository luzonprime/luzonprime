"use client";

import { useState, useTransition } from "react";
import { assignInquiry, updateInquiryStatus } from "@/app/actions/inquiries";
import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import type { Inquiry } from "@/types";

const STATUS_OPTIONS: Inquiry["status"][] = ["new", "contacted", "closed"];

const STATUS_STYLES: Record<Inquiry["status"], string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  closed: "bg-gray-100 text-gray-600",
};

export function InquiriesDataTable({
  inquiries,
  propertyTitles,
  agents,
}: {
  inquiries: Inquiry[];
  propertyTitles: Record<string, string>;
  agents: { id: string; full_name: string | null }[];
}) {
  const [rows, setRows] = useState(inquiries);
  const [, startTransition] = useTransition();

  function handleStatusChange(id: string, status: Inquiry["status"]) {
    setRows((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    startTransition(async () => {
      await updateInquiryStatus(id, status);
    });
  }

  function handleAssignChange(id: string, agentId: string) {
    const assigned_agent = agentId || null;
    setRows((prev) => prev.map((i) => (i.id === id ? { ...i, assigned_agent } : i)));
    startTransition(async () => {
      await assignInquiry(id, assigned_agent);
    });
  }

  const columns: DataTableColumn<Inquiry>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email", sortable: true },
    {
      key: "property_id",
      header: "Property",
      render: (i) => (i.property_id && propertyTitles[i.property_id]) ?? "—",
    },
    { key: "inquiry_type", header: "Type", render: (i) => i.inquiry_type ?? "—" },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (i) => (
        <select
          value={i.status}
          onChange={(e) => handleStatusChange(i.id, e.target.value as Inquiry["status"])}
          className={`rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none ${STATUS_STYLES[i.status]}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "assigned_agent",
      header: "Assigned to",
      render: (i) => (
        <select
          value={i.assigned_agent ?? ""}
          onChange={(e) => handleAssignChange(i.id, e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-xs text-[var(--color-text)] outline-none"
        >
          <option value="">Unassigned</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.full_name ?? a.id}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      searchPlaceholder="Search inquiries..."
      emptyMessage="No inquiries yet."
    />
  );
}
