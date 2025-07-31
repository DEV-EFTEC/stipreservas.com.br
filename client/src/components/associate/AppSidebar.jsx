"use client"

import * as React from "react"
import {
  Settings,
  SquareTerminal,
  Users,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar"
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
      url: "/home",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Histórico",
          url: "#",
        },
        {
          title: "Pagamentos",
          url: "#",
        },
      ],
    },
    {
      title: "Acompanhantes",
      url: "/associado/acompanhantes",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "Dependentes",
          url: "/associado/acompanhantes/dependentes",
        },
        {
          title: "Convidados",
          url: "/associado/acompanhantes/convidados",
        },
        {
          title: "Crianças",
          url: "/associado/acompanhantes/criancas"
        }
      ],
    },
  ],
  projects: [
    {
      name: "Configurações",
      url: "/associado/config",
      icon: Settings,
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
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
