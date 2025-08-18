'use client';
import { Bot, Brain, TrendingUp, Video } from 'lucide-react';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';
import NavMain from './nav-main';
import NavUser from './nav-user';

const sidebarLinks = [
  {
    title: 'Meetings',
    url: '/dashboard/meetings',
    icon: Video,
  },
  {
    title: 'Agents',
    url: '/dashboard/agents',
    icon: Bot,
  },
  {
    title: 'Upgrade',
    url: '/dashboard/upgrade',
    icon: TrendingUp,
  },
];

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { data: session } = authClient.useSession();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link className="flex items-center gap-2" href="/dashboard">
              <Brain className="!size-5" />
              <span className="font-bold text-lg text-primary">Cogni Inc.</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarLinks} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session?.user.name || '',
            email: session?.user.email || '',
            avatar:
              session?.user.image ||
              `https://avatar.vercel.sh/${session?.user.email}`,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
};
export default AppSidebar;
