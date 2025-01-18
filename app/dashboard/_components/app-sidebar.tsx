"use client"

import * as React from "react"
import {
  AudioLines,
  AudioWaveform,
  BookOpen,
  Bot,
  CircleDollarSign,
  Command,
  Cuboid,
  Fingerprint,
  Frame,
  GalleryVerticalEnd,
  GitFork,
  Home,
  Key,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Workflow,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { NavLogo } from "./nav-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  // company: {
  //   name: "Scrape.io",
  //   logo: AudioLines,
  //   plan: "Free",
  // },
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Bot,
      isActive: true,
      items: [],
    },
    {
      title: "Workflows",
      url: "/dashboard/workflows",
      icon: GitFork,
      items: [],
    },
    {
      title: "Credentials",
      url: "/dashboard/credentials",
      icon: Key,
      items: [],
    },
    {
      title: "Billing",
      url: "/dashboard/billing",
      icon: CircleDollarSign,
      items: [],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Platform" items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
