"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import {
  AudioLines,
  Cable,
  CreditCard,
  Inbox,
  LibraryBig,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const customerSupportItems = [
  {
    title: "Conversations",
    url: "/dashboard/conversations",
    icon: Inbox,
  },
  {
    title: "Knowledge Base",
    url: "/dashboard/files",
    icon: LibraryBig,
  },
];
const configurationItems = [
  {
    title: "Widget Customization",
    url: "/dashboard/customization",
    icon: Palette,
  },
  {
    title: "Integrations",
    url: "/dashboard/integrations",
    icon: Cable,
  },
  {
    title: "Voice Assistant",
    url: "/dashboard/plugins/vapi",
    icon: AudioLines,
  },
];
const accountItems = [
  {
    title: "Plans & Billing",
    url: "/dashboard/billing",
    icon: CreditCard,
  },
];

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(url);
  };
  // userButtonTrigger:"w-full! p-2! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
  return (
    <Sidebar className="group" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <OrganizationSwitcher
              hidePersonal
              skipInvitationScreen
              appearance={{
                elements: {
                  rootBox:
                    "w-full! h-8! border! rounded-md! group-data-[collapsible=icon]:border-none!",
                  avatarBox: " rounded-md!",
                  organizationSwitcherTrigger:
                    "w-full! justify-start! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
                  organizationPreview:
                    "group-data-[collapsible=icon]:justify-center! gap-2!",
                  organizationPreviewTextContainer:
                    "group-data-[collapsible=icon]:hidden! text-sm! font-medium! text-sidebar-foreground!",
                  organizationSwitcherTriggerIcon:
                    "group-data-[collapsible=icon]:hidden! ml-auto! text-sidebar-foreground!",
                },
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* customer support */}
        <SidebarGroup>
          <SidebarGroupLabel>Customer Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {customerSupportItems.map((item) => {
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-x-2"
                      >
                        <item.icon className="size-4" /> {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Configuration */}
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configurationItems.map((item) => {
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-x-2"
                      >
                        <item.icon className="size-4" /> {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Account */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => {
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-x-2"
                      >
                        <item.icon className="size-4" /> {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserButton
              showName
              appearance={{
                elements: {
                  rootBox:
                    "w-full! h-8! border-t!  group-data-[collapsible=icon]:border-none!",
                  userButtonTrigger:
                    "w-full! p-2! hover:text-sidebar-accent-foreground! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
                  userButtonBox:
                    "w-full! flex-row-reverse! justify-end! gap-2! group-data-[collapsible=icon]:justify-center! text-sidebar-foreground!",
                  userButtonOuterIdentifier:
                    "pl-0! group-data-[collapsible=icon]:hidden!",
                },
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
