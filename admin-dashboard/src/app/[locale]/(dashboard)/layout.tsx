import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AdminAuthGuard } from "@/components/auth/admin-auth-guard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AdminAuthGuard>
  );
}
