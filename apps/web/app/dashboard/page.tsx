import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="flex items-center gap-x-4">
      <UserButton />
      <OrganizationSwitcher />
    </div>
  );
}
