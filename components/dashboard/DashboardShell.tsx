import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";

export function DashboardShell({
  title,
  navItems,
  notificationCount,
  children,
}: {
  title: string;
  navItems: { href: string; label: string }[];
  notificationCount?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-6">
      <Sidebar title={title} navItems={navItems} />

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <TopBar pageTitle={title} notificationCount={notificationCount} />
        {children}
      </div>
    </div>
  );
}
