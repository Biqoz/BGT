"use client";

import React, { useMemo } from "react";
import type { AperçuViewProps } from "../../types";
import { usePipelineManager } from "../../hooks/usePipelineManager";
import { CampaignsTab } from "./tabs/CampaignsTab";
import { BarChart3, Users } from "lucide-react";

const AperçuView: React.FC<AperçuViewProps> = () => {
  const { pipelines } = usePipelineManager();
  // Calcul des statistiques globales à partir de tous les pipelines
  const globalStats = useMemo(() => {
    let totalContacts = 0;
    let totalProcessed = 0;
    let totalPending = 0;

    pipelines.forEach((pipeline) => {
      // Utiliser les stats du hook pour chaque pipeline (logique unifiée)
      const pipelineStats = {
        total: pipeline.nombre_de_leads || 0,
        processed: pipeline.leads_a_scapper || 0,
      };

      totalContacts += pipelineStats.total;
      totalProcessed += pipelineStats.processed;
    });

    totalPending = totalContacts - totalProcessed;

    return {
      total: totalContacts,
      processed: totalProcessed,
      pending: totalPending,
    };
  }, [pipelines]);

  const contactStats = globalStats;

  // Statistiques des campagnes
  const campaignStats = useMemo(() => {
    const total = pipelines.length;
    const completed = pipelines.filter((p) => p.statut === "Terminé").length;
    const inProgress = pipelines.filter(
      (p) => p.statut === "Traitement en cours"
    ).length;
    const pending = pipelines.filter((p) => p.statut === "En attente").length;
    const error = pipelines.filter((p) => p.statut === "Erreur").length;

    return {
      total,
      completed,
      inProgress,
      pending,
      error,
    };
  }, [pipelines]);

  return (
    <div className="h-full flex flex-col bg-gray-50/30 overflow-hidden">
      {/* Header avec statistiques */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Aperçu des Campagnes
          </h1>
          <p className="text-sm text-gray-600">
            Vue d&apos;ensemble de vos campagnes de prospection et contacts
            extraits
          </p>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Campagnes
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {campaignStats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Contacts Traités
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {contactStats.processed}
                </p>
                <p className="text-xs text-gray-500">
                  sur {contactStats.total} total
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-amber-600 rounded-full"></div>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {contactStats.pending}
                </p>
                <p className="text-xs text-gray-500">icebreakers à générer</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Terminées</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {campaignStats.completed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Cours</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {campaignStats.inProgress}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 min-h-0 px-6 pb-6">
        <CampaignsTab campaigns={pipelines} />
      </div>
    </div>
  );
};

export default AperçuView;
