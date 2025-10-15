"use client";

import React, { useState, useMemo, useCallback } from "react";
import { PipelineForm } from "./forms";
import { PipelineTable } from "./tables";
import { usePipelineManager } from "@/app/hooks/usePipelineManager";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  X,
  RefreshCw,
} from "lucide-react";
import type { PipelineFormData } from "@/app/types";

const PipelineManager = () => {
  const {
    pipelines,
    isLoadingAdd,
    isLoadingSend,
    isLoadingDelete,
    isRefreshing,
    error,
    addPipeline,
    sendWebhook,
    deletePipeline,
    refreshPipelines,
    isPollingActive,
  } = usePipelineManager();

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  // Filtrage des pipelines
  const filteredPipelines = useMemo(() => {
    return pipelines.filter((pipeline) => {
      const matchesSearch = pipeline.nom
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || pipeline.statut === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [pipelines, searchTerm, statusFilter]);

  // Statistiques - utilisation des vrais statuts
  const stats = useMemo(() => {
    const total = pipelines.length;
    const enAttente = pipelines.filter((p) => p.statut === "En attente").length;
    const enCours = pipelines.filter(
      (p) => p.statut === "Traitement en cours"
    ).length;
    const termines = pipelines.filter((p) => p.statut === "Terminé").length;

    // Compter les campagnes avec génération de leads en cours
    const generationEnCours = pipelines.filter(
      (p) =>
        p.statut === "Traitement en cours" &&
        (p.etape === "Leads en cours de génération" ||
          (p.etape === "Leads générés" &&
            p.nombre_de_leads &&
            p.leads_a_scapper !== null &&
            p.leads_a_scapper !== undefined &&
            p.leads_a_scapper < p.nombre_de_leads))
    ).length;

    return { total, enAttente, enCours, termines, generationEnCours };
  }, [pipelines]);

  // CORRECTION : Mémoriser handleSubmit avec useCallback
  const handleSubmit = useCallback(
    async (formData: PipelineFormData) => {
      try {
        await addPipeline(formData);
        setShowForm(false); // Fermer le formulaire après création
      } catch (error) {
        console.error("Erreur lors de la création du pipeline:", error);
      }
    },
    [addPipeline]
  ); // addPipeline comme dépendance

  // CORRECTION : Mémoriser handleDeleteAll avec useCallback
  const handleDeleteAll = useCallback(async () => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer tous les pipelines ?")
    ) {
      try {
        await Promise.all(pipelines.map((p) => deletePipeline(p.id)));
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  }, [pipelines, deletePipeline]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all";

  // Si le formulaire est affiché, on ne montre que le formulaire
  if (showForm) {
    return (
      <div className="space-y-6">
        {/* Header avec bouton Annuler */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Nouveau Pipeline
            </h2>
            <p className="text-gray-600 mt-1">
              Créez un nouveau pipeline de prospection
            </p>
          </div>
          <button
            onClick={() => setShowForm(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Annuler
          </button>
        </div>

        {/* Formulaire */}
        <PipelineForm onSubmit={handleSubmit} isLoading={isLoadingAdd} />
      </div>
    );
  }

  // Sinon, on affiche le tableau avec les contrôles
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gestion des Pipelines
          </h2>
          <div className="text-gray-600 mt-1">
            Gérez vos campagnes de prospection Apollo
            {isPollingActive && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse inline-block"></span>
                Mise à jour automatique
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshPipelines}
            disabled={isRefreshing}
            className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            title="Actualiser"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Statistiques - avec les vrais statuts */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.enAttente}
          </div>
          <div className="text-sm text-gray-600">En attente</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {stats.enCours}
          </div>
          <div className="text-sm text-gray-600">En cours</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {stats.termines}
          </div>
          <div className="text-sm text-gray-600">Terminés</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {stats.generationEnCours}
          </div>
          <div className="text-sm text-gray-600">Génération active</div>
        </div>
      </div>

      {/* Contrôles de recherche et filtres */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un pipeline..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          {/* Filtres de statut - avec les vrais statuts */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
            >
              <option value="all">Tous les statuts</option>
              <option value="En attente">En attente</option>
              <option value="Traitement en cours">En cours</option>
              <option value="Terminé">Terminés</option>
              <option value="Erreur">Erreur</option>
            </select>
          </div>

          {/* Menu actions */}
          <div className="relative ">
            <button
              onClick={() => setShowActionsMenu(!showActionsMenu)}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-600" />
            </button>
            {showActionsMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    handleDeleteAll();
                    setShowActionsMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer tout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filtres actifs */}
        {hasActiveFilters && (
          <div className="flex items-center space-x-2 mt-3">
            <span className="text-sm text-gray-600">Filtres actifs:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Recherche: &ldquo;{searchTerm}&rdquo;
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Statut: {statusFilter}
                <button
                  onClick={() => setStatusFilter("all")}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Effacer tous les filtres
            </button>
          </div>
        )}
      </div>

      {/* Tableau des pipelines - avec les bonnes props */}
      <PipelineTable
        pipelines={filteredPipelines}
        onWebhookSend={sendWebhook}
        onDelete={deletePipeline}
        isLoadingSend={isLoadingSend}
        isLoadingDelete={isLoadingDelete}
      />

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}
    </div>
  );
};

export default PipelineManager;
