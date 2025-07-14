"use client"

import {
    Calendar, CheckSquare, Command, FileText, LayoutDashboard, LifeBuoy, Send, Users
} from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
// import { NavProjects } from '@/components/nav-projects';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthProvider';

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/manage/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Clients",
      url: "/manage/clients",
      icon: Users,
    },
    {
      title: "Events",
      url: "/manage/events",
      icon: Calendar,
    },
    {
      title: "RSVPS",
      url: "/manage/rsvps",
      icon: CheckSquare,
    },
    {
      title: "Templates",
      url: "/manage/templates",
      icon: FileText,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const authCtx = useAuth()

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Sweet Invites CUU</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ email: authCtx.session?.user.email }} />
      </SidebarFooter>
    </Sidebar>
  )
}
