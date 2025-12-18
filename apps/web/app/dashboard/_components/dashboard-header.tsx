import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";

export const DashboardHeader = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <SidebarTrigger />
    </header>
  );
};
