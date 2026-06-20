import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getDashboardUser } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/client", label: "Overview" },
  { href: "/client/favourites", label: "Favourites" },
  { href: "/client/settings", label: "Settings" },
];

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const user = await getDashboardUser();
  return (
    <DashboardShell title="My Account" navItems={NAV_ITEMS} user={user}>
      {children}
    </DashboardShell>
  );
}
