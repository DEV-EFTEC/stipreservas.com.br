"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PartyPopper,
  PieChart,
  Plus,
  Settings,
  Settings2,
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
} from "../ui/admin/sidebar"
import logo from "../../assets/stip-logo.svg"
import { useAuth } from "@/hooks/useAuth"

// This is sample data.
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
          title: "Ver todas",
          url: "/admin/solicitacoes",
        },
        {
          title: "Criar solicitação",
          url: "/admin/criar-reserva",
        },
        {
          title: "Agenda",
          url: "/admin/calendario",
        }
      ],
    },
    {
      title: "Associados",
      url: "/admin/associados",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "Ver todos",
          url: "/admin/associados",
        },
        {
          title: "Cadastrar",
          url: "/admin/associados/novo-associado",
        },
        {
          title: "Editar",
          url: "/admin/associados/editar-associado",
        }
      ],
    },
    {
      title: "Sorteios",
      url: "/admin/sorteios",
      icon: PartyPopper,
      isActive: true,
      items: [
        {
          title: "Ver inscrições",
          url: "/admin/sorteios/inscritos",
        },
        {
          title: "Sorteador",
          url: "/admin/sorteios/run",
        },
        {
          title: "Gerenciar",
          url: "/admin/sorteios",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Configurações",
      url: "/admin/config",
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
