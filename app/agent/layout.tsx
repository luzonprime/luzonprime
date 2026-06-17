import { DashboardShell } from "@/components/dashboard/DashboardShell";

const NAV_ITEMS = [{ href: "/agent/properties", label: "My Properties" }];

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Agent" navItems={NAV_ITEMS}>
      {children}
    </DashboardShell>
  );
}
