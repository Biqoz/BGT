"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, LogOut, ChevronDown } from "lucide-react";
import type { UserMenuProps } from "../types";

export function UserMenu({
  user,
  onLogout,
}: UserMenuProps & { onLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  // Fonction pour tronquer le texte
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="relative w-full">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start gap-3 px-3 py-2.5 h-auto hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4" />
        </div>
        <div className="flex flex-col items-start min-w-0 flex-1">
          <span className="text-sm font-medium truncate w-full">
            {truncateText(user.name || "Utilisateur", 15)}
          </span>
          <span className="text-xs text-muted-foreground truncate w-full">
            {truncateText(user.email || "", 20)}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 flex-shrink-0" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 w-full min-w-[200px] bg-popover rounded-md shadow-lg border border-border z-20">
            <div className="py-1">
              <div className="px-3 py-2 text-sm border-b border-border">
                <div className="font-medium text-foreground break-words">
                  {user.name}
                </div>
                <div className="text-muted-foreground break-words">
                  {user.email}
                </div>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
