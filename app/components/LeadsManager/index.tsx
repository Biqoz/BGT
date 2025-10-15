"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { LeadsManagerProps } from "@/app/types";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

export function LeadsManager({ className }: LeadsManagerProps) {
  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Header - fixe */}
      <div className="flex-shrink-0 px-6 py-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
            <p className="text-sm text-gray-600 mt-1">
              Suivi LinkedIn - Fonctionnalité à venir
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 min-h-0 flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-12 border border-gray-200 shadow-none bg-white max-w-md mx-auto">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                LinkedIn Lead Management
              </h3>
              <p className="text-gray-500 mb-4">
                Cette section sera dédiée au suivi des leads LinkedIn.
              </p>
              <p className="text-sm text-gray-400">
                Le suivi des emails se fait maintenant directement dans Instantly.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
