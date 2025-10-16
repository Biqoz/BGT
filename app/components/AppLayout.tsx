import React from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { User } from "../types";

interface AppLayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: string) => void;
  user: User;
  onLogout: () => void;
}

const viewLabels: Record<string, string> = {
  pipelinelabs: "PipelineLabs Manager",
  apercu: "Aperçu",
  leads: "Human in the Loop",
};

export function AppLayout({
  children,
  activeView,
  onNavigate,
  user,
  onLogout,
}: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar
        activeView={activeView}
        onNavigate={onNavigate}
        user={user}
        onLogout={onLogout}
      />
      <SidebarInset className="flex flex-col h-screen">
        {/* Header avec hauteur fixe */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">BGT Automatisation</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {viewLabels[activeView] || "Dashboard"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        {/* Contenu qui prend l'espace restant (100vh - 64px) */}
        <div className="flex-1 min-h-0 p-4 overflow-hidden">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
