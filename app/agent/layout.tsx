import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getDashboardUser } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/agent/properties", label: "My Properties" },
  { href: "/agent/settings", label: "Settings" },
];

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  const user = await getDashboardUser();
  return (
    <DashboardShell title="Agent" navItems={NAV_ITEMS} user={user}>
      {children}
    </DashboardShell>
  );
}
