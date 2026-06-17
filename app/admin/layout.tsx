import { DashboardShell } from "@/components/dashboard/DashboardShell";

const NAV_ITEMS = [{ href: "/admin/properties", label: "Properties" }];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Admin" navItems={NAV_ITEMS}>
      {children}
    </DashboardShell>
  );
}
