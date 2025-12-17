// dashboard/layout.tsx
import { AuthGuard } from "@/services/auth/auth-guard";
import { OrganizationGuard } from "@/services/auth/organization-guard";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGuard loadingMessage="Loading your dashboard...">
      <OrganizationGuard>
        <main>{children}</main>
      </OrganizationGuard>
    </AuthGuard>
  );
}
