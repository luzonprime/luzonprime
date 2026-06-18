import { Building2, Inbox, Mail, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/StatCard";
import { LineChartCard } from "@/components/dashboard/charts/LineChartCard";
import { BarChartCard } from "@/components/dashboard/charts/BarChartCard";
import { PieChartCard } from "@/components/dashboard/charts/PieChartCard";
import { LISTING_TYPE_LABELS, STATUS_LABELS } from "@/lib/utils";
import type { Property, Inquiry } from "@/types";

function lastNDays(n: number) {
  const days: { key: string; label: string }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return days;
}

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [{ data: properties }, { data: inquiries }, { count: subscriberCount }, { count: agentCount }] =
    await Promise.all([
      supabase.from("properties").select("*"),
      supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
      supabase.from("subscribers").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "agent"),
    ]);

  const allProperties = (properties ?? []) as Property[];
  const allInquiries = (inquiries ?? []) as Inquiry[];

  const days = lastNDays(7);
  const inquiriesByDay = days.map((day) => ({
    label: day.label,
    inquiries: allInquiries.filter((i) => i.created_at.slice(0, 10) === day.key).length,
  }));

  const statusCounts = new Map<string, number>();
  for (const p of allProperties) {
    statusCounts.set(p.status, (statusCounts.get(p.status) ?? 0) + 1);
  }
  const listingsByStatus = Array.from(statusCounts.entries()).map(([status, count]) => ({
    label: STATUS_LABELS[status] ?? status,
    count,
  }));

  const typeCounts = new Map<string, number>();
  for (const p of allProperties) {
    const key = p.listing_type ?? "unspecified";
    typeCounts.set(key, (typeCounts.get(key) ?? 0) + 1);
  }
  const listingsByType = Array.from(typeCounts.entries()).map(([type, count]) => ({
    label: LISTING_TYPE_LABELS[type] ?? type,
    count,
  }));

  const newInquiries = allInquiries.filter((i) => i.status === "new").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Building2} label="Total listings" value={allProperties.length} />
        <StatCard icon={Inbox} label="Open inquiries" value={newInquiries} />
        <StatCard icon={Mail} label="Subscribers" value={subscriberCount ?? 0} />
        <StatCard icon={ShieldCheck} label="Active agents" value={agentCount ?? 0} />
      </div>

      <LineChartCard title="Inquiries — last 7 days" data={inquiriesByDay} dataKey="inquiries" />

      <div className="grid gap-6 sm:grid-cols-2">
        <BarChartCard title="Listings by status" data={listingsByStatus} dataKey="count" />
        <PieChartCard title="Listings by type" data={listingsByType} dataKey="count" />
      </div>
    </div>
  );
}
