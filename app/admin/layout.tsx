import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getDashboardUser } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/properties", label: "Properties" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/agents", label: "Agents" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/interior-projects", label: "Interior Projects" },
  { href: "/admin/shop-items", label: "Shop Items" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/buy-ability", label: "Buy-Ability" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/taxonomies", label: "Taxonomies" },
  { href: "/admin/navigation", label: "Navigation" },
  { href: "/admin/awards", label: "Awards" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getDashboardUser();
  return (
    <DashboardShell title="Admin" navItems={NAV_ITEMS} user={user}>
      {children}
    </DashboardShell>
  );
}
