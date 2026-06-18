import { DashboardShell } from "@/components/dashboard/DashboardShell";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/properties", label: "Properties" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/agents", label: "Agents" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/taxonomies", label: "Taxonomies" },
  { href: "/admin/navigation", label: "Navigation" },
  { href: "/admin/awards", label: "Awards" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Admin" navItems={NAV_ITEMS}>
      {children}
    </DashboardShell>
  );
}
