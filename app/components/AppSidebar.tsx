import React from "react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Globe, Users, BarChart3 } from "lucide-react";
import { UserMenu } from "./UserMenu";
import type { User } from "../types";

interface AppSidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  user: User;
  onLogout: () => void;
}

const menuItems = [
  {
    icon: Globe,
    view: "pipelinelabs",
    label: "PipelineLabs Manager",
    description: "Gestion des campagnes",
  },
  {
    icon: BarChart3,
    view: "apercu",
    label: "Aperçu",
    description: "Tableau de bord",
  },
  {
    icon: Users,
    view: "leads",
    label: "Human in the Loop",
    description: "Réponses indéfinies à qualifier",
  },
];

export function AppSidebar({
  activeView,
  onNavigate,
  user,
  onLogout,
}: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8  rounded-lg flex items-center justify-center">
            <Image
              src="/logo_bgt.jpg"
              alt="BGT Logo"
              width={20}
              height={20}
              className="rounded-sm object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">BGT</span>
            <span className="text-xs text-muted-foreground">
              Automatisation
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.view;

                return (
                  <SidebarMenuItem key={item.view}>
                    <SidebarMenuButton
                      onClick={() => onNavigate(item.view)}
                      isActive={isActive}
                      className="w-full justify-start gap-3 px-3 py-2.5 h-auto"
                    >
                      <Icon className="h-4 w-4" />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <UserMenu user={user} onLogout={onLogout} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
