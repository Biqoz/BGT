import React, { useState, useEffect, useRef } from "react";
import type { PipelineTableProps, JsonApifyPipelinelabs } from "@/app/types";
import { LeadsProgressIndicator } from "../LeadsProgressIndicator";
import { ChevronDown, ChevronUp, Mail } from "lucide-react";
import { CampaignTypeLabel } from "../CampaignTypeLabel";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const PipelineTable = ({
  pipelines,
  onWebhookSend,
  onDelete,
  onPipelineSelect,
  selectedPipelineId,
  isLoadingSend = false,
  isLoadingDelete = false,
}: PipelineTableProps) => {
  // État pour gérer l'affichage des animations par pipeline
  const [expandedPipelines, setExpandedPipelines] = useState<Set<string>>(
    new Set()
  );

  // Référence pour suivre les IDs des pipelines précédents
  const previousPipelineIds = useRef<Set<string>>(new Set());

  // Fonction pour déterminer si un pipeline doit afficher l'indicateur de leads
  const shouldShowLeadsIndicator = (pipeline: JsonApifyPipelinelabs) => {
    return (
      pipeline.nombre_de_leads &&
      (pipeline.etape === "Leads en cours de génération" ||
        pipeline.etape === "Leads générés" ||
        pipeline.statut === "Traitement en cours" ||
        // Afficher aussi pour les campagnes terminées avec Ice breakers Ready
        (pipeline.statut === "Terminé" && pipeline.etape === "Ice breakers Ready"))
    );
  };

  // Effet pour détecter les nouvelles campagnes et afficher automatiquement l'animation
  useEffect(() => {
    const currentPipelineIds = new Set(pipelines.map((p) => p.id));
    const newPipelineIds = new Set<string>();

    // Identifier les nouveaux pipelines
    currentPipelineIds.forEach((id) => {
      if (!previousPipelineIds.current.has(id)) {
        newPipelineIds.add(id);
      }
    });

    // Ajouter automatiquement les nouvelles campagnes qui doivent afficher l'animation
    if (newPipelineIds.size > 0) {
      setExpandedPipelines((prev) => {
        const newSet = new Set(prev);
        newPipelineIds.forEach((id) => {
          const pipeline = pipelines.find((p) => p.id === id);
          if (pipeline && shouldShowLeadsIndicator(pipeline)) {
            newSet.add(id);
          }
        });
        return newSet;
      });
    }

    // Mettre à jour la référence des IDs précédents
    previousPipelineIds.current = currentPipelineIds;
  }, [pipelines]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleWebhookSend = async (id: string) => {
    try {
      await onWebhookSend(id);
      // Afficher automatiquement l'animation quand une campagne est lancée
      setExpandedPipelines((prev) => new Set(prev).add(id));
    } catch (error) {
      console.error("Erreur lors de l'envoi du webhook:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce pipeline ?")) {
      try {
        await onDelete(id);
        // Nettoyer l'état d'expansion pour ce pipeline
        setExpandedPipelines((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleRowClick = (id: string) => {
    if (onPipelineSelect) {
      onPipelineSelect(id);
    }
  };

  const toggleLeadsAnimation = (
    pipelineId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setExpandedPipelines((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pipelineId)) {
        newSet.delete(pipelineId);
      } else {
        newSet.add(pipelineId);
      }
      return newSet;
    });
  };

  if (pipelines.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">Aucun pipeline enregistré</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex-1 flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Nom
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Étape
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {pipelines.map((pipeline) => (
                <React.Fragment key={pipeline.id}>
                  {/* Ligne principale */}
                  <tr
                    className={`hover:bg-gray-50 cursor-pointer border-b border-gray-200 ${
                      selectedPipelineId === pipeline.id
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : ""
                    }`}
                    onClick={() => handleRowClick(pipeline.id)}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div
                            className="text-sm font-medium text-gray-900 truncate"
                            title={pipeline.nom}
                          >
                            {pipeline.nom}
                          </div>
                          <CampaignTypeLabel
                            type={pipeline.type_de_campagne}
                            size="sm"
                            showText={false}
                          />
                        </div>
                        {/* Bouton toggle pour l'animation des leads */}
                        {shouldShowLeadsIndicator(pipeline) && (
                          <button
                            onClick={(e) =>
                              toggleLeadsAnimation(pipeline.id, e)
                            }
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title={
                              expandedPipelines.has(pipeline.id)
                                ? "Masquer les détails"
                                : "Afficher les détails"
                            }
                          >
                            {expandedPipelines.has(pipeline.id) ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Colonne Statut */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            pipeline.statut === "Terminé"
                              ? "bg-green-100 text-green-800"
                              : pipeline.statut === "Traitement en cours"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {pipeline.statut}
                        </span>
                        
                        {/* Badge Instantly pour les campagnes email terminées avec Ice breakers Ready */}
                        {pipeline.statut === "Terminé" && 
                         pipeline.etape === "Ice breakers Ready" && 
                         pipeline.type_de_campagne === "email" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 cursor-help">
                                <Mail className="w-3 h-3" />
                                Instantly
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Séquence mail configurée sur Instantly.ai</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </td>

                    {/* Colonne Étape */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          pipeline.etape === "Leads générés"
                            ? "bg-green-100 text-green-800"
                            : pipeline.etape === "Leads en cours de génération"
                            ? "bg-blue-100 text-blue-800"
                            : pipeline.etape === "Emails envoyés"
                            ? "bg-purple-100 text-purple-800"
                            : pipeline.etape === "Ice breakers Ready"
                            ? "bg-orange-100 text-orange-800"
                            : pipeline.etape === "Données enrichies"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {pipeline.etape || "Critères enregistrés"}
                      </span>
                    </td>

                    {/* Colonne Date */}
                    <td className="px-2 py-4">
                      <div className="text-xs text-gray-900">
                        {formatDate(pipeline.created_at)}
                      </div>
                    </td>

                    {/* Colonne Action */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {pipeline.action === "Lancer la campagne ?" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWebhookSend(pipeline.id);
                            }}
                            disabled={isLoadingSend}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isLoadingSend ? "Envoi..." : "Lancer"}
                          </button>
                        )}

                        {pipeline.action === "Campagne lancée !" && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">
                            Lancée
                          </span>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(pipeline.id);
                          }}
                          disabled={isLoadingDelete}
                          className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Supprimer"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Animation de progression des leads - avec toggle */}
                  {shouldShowLeadsIndicator(pipeline) && (
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="px-4 py-0">
                        <LeadsProgressIndicator
                          nombreDeLeads={pipeline.nombre_de_leads || 0}
                          leadsAScapper={pipeline.leads_a_scapper || 0}
                          isExpanded={expandedPipelines.has(pipeline.id)}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
