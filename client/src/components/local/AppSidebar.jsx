"use client"

import * as React from "react"
import {
  PartyPopper,
  Shield,
  SquareTerminal,
  Users,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/local/sidebar"
import logo from "../../assets/stip-logo.svg"
import { useAuth } from "@/hooks/useAuth"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Solicitações",
      url: "/local/home",
      icon: SquareTerminal,
      isActive: true,
      items: [,
        {
          title: "Criar solicitação",
          url: "/local/criar-reserva",
        },
        {
          title: "Agenda",
          url: "/local/calendario",
        }
      ],
    },
  ],
}

export function AppSidebar({ ...props }) {
  const { user } = useAuth()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className={"flex items-center justify-center"}>
        <img src={logo} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
