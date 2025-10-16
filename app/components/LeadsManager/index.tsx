"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { LeadsManagerProps } from "@/app/types";
import { cn } from "@/lib/utils";
import { Users, Trash2 } from "lucide-react";


import { useUndefinedResponseLeads } from "@/app/hooks/useUndefinedResponseLeads";

export function LeadsManager({ className }: LeadsManagerProps) {
  const { leads, isLoading, error, deleteLead } = useUndefinedResponseLeads();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Fonction pour détecter si c'est une réponse LinkedIn
  const isLinkedInResponse = (reponse: string | null) => {
    return reponse?.trim().toUpperCase() === "LINKEDIN";
  };

  // Fonction pour parser le HTML et extraire la réponse du prospect et l'email original
  const parseHtmlResponse = (reponse: string | null) => {
    if (!reponse)
      return { prospectResponse: "Non renseigné", originalEmail: null };

    // Créer un parser DOM temporaire
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${reponse}</div>`, "text/html");

    // Extraire la réponse du prospect (premier div avec dir="auto")
    const prospectDiv = doc.querySelector('div[dir="auto"]');
    const prospectResponse =
      prospectDiv?.textContent?.trim() || "Non renseigné";

    // Extraire l'email original (contenu de la blockquote)
    const blockquote = doc.querySelector("blockquote.gmail_quote");
    let originalEmail = null;

    if (blockquote) {
      // Récupérer aussi l'en-tête de l'email (gmail_attr)
      const emailHeader = doc.querySelector(".gmail_attr");
      const emailHeaderText = emailHeader?.textContent?.trim() || "";
      const emailContent = blockquote.textContent?.trim() || "";

      originalEmail = emailHeaderText + "\n\n" + emailContent;
    }

    return {
      prospectResponse,
      originalEmail,
    };
  };

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Header - fixe */}
      <div className="flex-shrink-0 px-6 py-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Human in the LOOP
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Candidats ayant répondu, intention non détectée par l&apos;IA
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal avec scroll */}
      <div className="flex-1 min-h-0 flex flex-col bg-gray-50 overflow-hidden">
        <div className="p-4 overflow-y-auto flex-1">
          {isLoading ? (
            <Card className="p-6 border border-gray-200 shadow-none bg-white">
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-100 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </Card>
          ) : error ? (
            <Card className="p-6 border border-gray-200 shadow-none bg-white">
              <p className="text-sm text-gray-700">
                Erreur: <span className="text-gray-900">{error}</span>
              </p>
            </Card>
          ) : leads.length === 0 ? (
            <Card className="p-12 border border-gray-200 shadow-none bg-white text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun candidat à qualifier
              </h3>
              <p className="text-gray-500">
                Les réponses indéfinies s’afficheront ici dès qu’elles seront
                détectées.
              </p>
            </Card>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-sm">
                      Type
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-sm">
                      Nom
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-sm">
                      Entreprise
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-sm">
                      Statut
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => {
                    const isLinkedIn = isLinkedInResponse(lead.Reponse);
                    const isExpanded = expandedId === lead.id;

                    return (
                      <React.Fragment key={lead.id}>
                        <tr 
                        className={`border-b transition-colors hover:bg-muted/50 ${
                          isLinkedIn ? 'bg-blue-50/30' : 'cursor-pointer'
                        }`}
                        onClick={!isLinkedIn ? () => toggleExpand(lead.id) : undefined}
                      >
                          <td className="p-4 align-middle">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              isLinkedIn
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {isLinkedIn ? "LinkedIn" : "Email"}
                          </span>
                        </td>
                          <td className="p-4 align-middle">
                          {isLinkedIn && lead.Linkedin ? (
                            <a
                              href={lead.Linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {lead.Prenom} {lead.Nom}
                            </a>
                          ) : (
                            <div className="font-medium text-sm">
                              {lead.Prenom} {lead.Nom}
                            </div>
                          )}
                        </td>
                          <td className="p-4 align-middle">
                            <div className="text-sm text-muted-foreground">
                              {lead.Entreprise}
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-green-700">
                                Répondu
                              </span>
                            </div>
                          </td>
                          <td className="p-4 align-middle" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Supprimer ${lead.Prenom} ${lead.Nom} ?`
                                  )
                                ) {
                                  deleteLead(lead.id);
                                }
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                              title="Supprimer le lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>

                        {!isLinkedIn && isExpanded && (
                          <tr className="border-b bg-muted/20">
                            <td colSpan={5} className="p-0">
                              <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <h5 className="font-medium text-foreground mb-2 text-sm flex items-center gap-2">
                                      📧 Email
                                    </h5>
                                    <div className="bg-background p-3 rounded-md border text-xs text-foreground leading-relaxed">
                                      {lead.Mail || "Aucun email trouvé"}
                                    </div>
                                  </div>

                                  <div>
                                    <h5 className="font-medium text-foreground mb-2 text-sm flex items-center gap-2">
                                      💼 LinkedIn
                                    </h5>
                                    <div className="bg-background p-3 rounded-md border text-xs text-foreground leading-relaxed">
                                      {lead.Linkedin ? (
                                        <a
                                          href={lead.Linkedin}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:text-blue-800 underline"
                                        >
                                          {lead.Linkedin}
                                        </a>
                                      ) : (
                                        "Aucun profil LinkedIn trouvé"
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <h5 className="font-medium text-foreground mb-2 text-sm flex items-center gap-2">
                                      📅 Créé le
                                    </h5>
                                    <div className="bg-background p-3 rounded-md border text-xs text-foreground leading-relaxed">
                                      {lead.created_at
                                        ? new Date(
                                            lead.created_at
                                          ).toLocaleDateString("fr-FR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })
                                        : "Non renseigné"}
                                    </div>
                                  </div>
                                </div>

                                {(() => {
                                  const { prospectResponse, originalEmail } =
                                    parseHtmlResponse(lead.Reponse);
                                  return (
                                    <div className="space-y-4 pt-4 border-t">
                                      <div>
                                        <h5 className="font-medium text-foreground mb-2 text-sm flex items-center gap-2">
                                          💬 Réponse du prospect
                                        </h5>
                                        <div className="bg-background p-3 rounded-md border text-xs text-foreground leading-relaxed">
                                          {prospectResponse ||
                                            "Aucune réponse du prospect trouvée"}
                                        </div>
                                      </div>

                                      {originalEmail && (
                                        <div>
                                          <h5 className="font-medium text-foreground mb-2 text-sm flex items-center gap-2">
                                            📧 Email original
                                          </h5>
                                          <div className="bg-muted/30 p-3 rounded-md border text-xs max-h-32 overflow-y-auto">
                                            <pre className="whitespace-pre-wrap font-mono text-xs text-muted-foreground leading-relaxed">
                                              {originalEmail}
                                            </pre>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
