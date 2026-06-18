import { DashboardShell } from "@/components/dashboard/DashboardShell";

const NAV_ITEMS = [
  { href: "/client", label: "Overview" },
  { href: "/client/settings", label: "Settings" },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="My Account" navItems={NAV_ITEMS}>
      {children}
    </DashboardShell>
  );
}
