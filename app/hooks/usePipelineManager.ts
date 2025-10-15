import { useState, useEffect, useCallback, useRef } from "react";
import { PipelineService } from "../services/pipelineService";
import type {
  JsonApifyPipelinelabs,
  PipelineFormData,
  PipelineStatus,
  PipelineAction,
  PipelineEtape,
} from "../types";

export const usePipelineManager = () => {
  const [pipelines, setPipelines] = useState<JsonApifyPipelinelabs[]>([]);
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [isLoadingSend, setIsLoadingSend] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Références pour le polling
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingActiveRef = useRef(false);
  const pollingCountRef = useRef(0);

  // Charger les pipelines
  const loadPipelines = useCallback(async () => {
    try {
      const data = await PipelineService.getAllPipelines();
      setPipelines(data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des pipelines:", err);
      setError("Erreur lors du chargement des pipelines");
    }
  }, []);

  // Fonction pour vérifier si le polling est nécessaire (sans logs)
  const shouldPoll = useCallback((pipelinesList: JsonApifyPipelinelabs[]) => {
    return pipelinesList.some(
      (pipeline) =>
        pipeline.statut === "Traitement en cours" &&
        (pipeline.etape === "Leads en cours de génération" ||
          (pipeline.etape === "Leads générés" &&
            pipeline.nombre_de_leads &&
            pipeline.leads_a_scapper !== null &&
            pipeline.leads_a_scapper !== undefined &&
            pipeline.leads_a_scapper < pipeline.nombre_de_leads))
    );
  }, []);

  // Démarrer le polling
  const startPolling = useCallback(() => {
    if (isPollingActiveRef.current) return;

    console.log("🔄 DÉMARRAGE DU POLLING - Vérification toutes les 3 secondes");
    isPollingActiveRef.current = true;
    pollingCountRef.current = 0;

    pollingIntervalRef.current = setInterval(async () => {
      pollingCountRef.current += 1;
      const timestamp = new Date().toLocaleTimeString();

      console.log(
        `⏰ [${timestamp}] POLLING #${pollingCountRef.current} - Vérification des campagnes...`
      );

      try {
        const data = await PipelineService.getAllPipelines();

        // Analyser les campagnes actives (avec logs détaillés)
        const activeCampaigns = data.filter(
          (pipeline) =>
            pipeline.statut === "Traitement en cours" &&
            (pipeline.etape === "Leads en cours de génération" ||
              (pipeline.etape === "Leads générés" &&
                pipeline.nombre_de_leads &&
                pipeline.leads_a_scapper !== null &&
                pipeline.leads_a_scapper !== undefined &&
                pipeline.leads_a_scapper < pipeline.nombre_de_leads))
        );

        if (activeCampaigns.length > 0) {
          console.log(
            `📊 [${timestamp}] ${activeCampaigns.length} campagne(s) en cours:`
          );
          activeCampaigns.forEach((campaign) => {
            if (campaign.etape === "Leads en cours de génération") {
              console.log(
                `   🔄 "${campaign.nom}" - Génération de leads en cours...`
              );
            } else if (campaign.etape === "Leads générés") {
              const processed =
                campaign.nombre_de_leads! - campaign.leads_a_scapper!;
              const total = campaign.nombre_de_leads!;
              const percentage = Math.round((processed / total) * 100);
              console.log(
                `   📈 "${campaign.nom}" - Progression: ${processed}/${total} leads (${percentage}%)`
              );
            }
          });
        } else {
          console.log(
            `✅ [${timestamp}] Aucune campagne active - Arrêt du polling`
          );
        }

        setPipelines((prevPipelines) => {
          // Détecter les pipelines qui viennent de passer à "Terminé"
          const newlyCompleted = data.filter(pipeline => {
            const prevPipeline = prevPipelines.find(p => p.id === pipeline.id);
            return prevPipeline && 
                   prevPipeline.statut !== "Terminé" && 
                   pipeline.statut === "Terminé" &&
                   pipeline.etape === "Ice breakers Ready";
          });

          // Notifier pour chaque pipeline terminé
          newlyCompleted.forEach(pipeline => {
            console.log(`🎉 PIPELINE TERMINÉ: "${pipeline.nom}" - Tous les icebreakers sont ready !`);
          });

          // Vérifier si on doit continuer le polling (sans logs)
          if (!shouldPoll(data)) {
            console.log(
              "⏹️ ARRÊT DU POLLING - Toutes les campagnes sont terminées"
            );
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
              isPollingActiveRef.current = false;
              pollingCountRef.current = 0;
            }
          }
          return data;
        });
      } catch (error) {
        console.error(
          `❌ [${timestamp}] Erreur lors du polling #${pollingCountRef.current}:`,
          error
        );
      }
    }, 3000); // 1 seconde
  }, [shouldPoll]);

  // Arrêter le polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      console.log("⏹️ ARRÊT MANUEL DU POLLING");
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      isPollingActiveRef.current = false;
      pollingCountRef.current = 0;
    }
  }, []);

  // Effet pour gérer le polling automatique
  useEffect(() => {
    if (shouldPoll(pipelines) && !isPollingActiveRef.current) {
      startPolling();
    } else if (!shouldPoll(pipelines) && isPollingActiveRef.current) {
      stopPolling();
    }
  }, [pipelines, shouldPoll, startPolling, stopPolling]);

  // Chargement initial
  useEffect(() => {
    loadPipelines();

    // Cleanup au démontage
    return () => {
      stopPolling();
    };
  }, [loadPipelines, stopPolling]);

  // Ajouter un pipeline
  const addPipeline = useCallback(
    async (formData: PipelineFormData) => {
      setIsLoadingAdd(true);
      try {
        setError(null);

        const newPipeline = await PipelineService.createPipeline(formData);

        // Mise à jour optimiste
        setPipelines((prev) => [newPipeline, ...prev]);
      } catch (err) {
        console.error("Erreur lors de la création:", err);
        setError("Erreur lors de la création du pipeline");

        // En cas d'erreur, recharger pour s'assurer de l'état correct
        await loadPipelines();
        throw err;
      } finally {
        setIsLoadingAdd(false);
      }
    },
    [loadPipelines]
  );

  // Supprimer un pipeline
  const deletePipeline = useCallback(
    async (id: string) => {
      setIsLoadingDelete(true);
      try {
        setError(null);

        // Mise à jour optimiste
        setPipelines((prev) => prev.filter((pipeline) => pipeline.id !== id));

        await PipelineService.deletePipeline(id);
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        setError("Erreur lors de la suppression du pipeline");

        // En cas d'erreur, recharger pour s'assurer de l'état correct
        await loadPipelines();
        throw err;
      } finally {
        setIsLoadingDelete(false);
      }
    },
    [loadPipelines]
  );

  // Actualiser manuellement
  const refreshPipelines = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await loadPipelines();
    } finally {
      setIsRefreshing(false);
    }
  }, [loadPipelines]);

  // Envoyer un webhook
  const sendWebhook = useCallback(
    async (id: string) => {
      setIsLoadingSend(true);
      try {
        setError(null);

        console.log("🚀 Début sendWebhook pour pipeline:", id);

        // Mise à jour optimiste immédiate avec l'étape
        setPipelines((prev) => {
          const updated = prev.map((pipeline) =>
            pipeline.id === id
              ? {
                  ...pipeline,
                  statut: "Traitement en cours" as PipelineStatus,
                  action: "Campagne lancée !" as PipelineAction,
                  etape: "Leads en cours de génération" as PipelineEtape,
                }
              : pipeline
          );
          console.log(
            "✅ Mise à jour optimiste appliquée - Le polling va démarrer automatiquement"
          );
          return updated;
        });

        // Récupérer le pipeline pour l'envoyer au webhook
        const pipeline = pipelines.find((p) => p.id === id);
        if (!pipeline) throw new Error("Pipeline non trouvé");

        console.log("📝 Mise à jour en base de données...");
        // Changer le statut, l'action ET l'étape
        await PipelineService.updatePipelineStatusAndAction(id, {
          statut: "Traitement en cours" as PipelineStatus,
          action: "Campagne lancée !" as PipelineAction,
          etape: "Leads en cours de génération" as PipelineEtape,
        });
        console.log("✅ Base de données mise à jour");

        console.log("🌐 Envoi du webhook...");
        // Envoyer au webhook
        await PipelineService.sendWebhook(pipeline);
        console.log(
          "✅ Webhook envoyé avec succès - Le polling surveille maintenant la progression"
        );
      } catch (err) {
        console.error("❌ Erreur lors de l'envoi du webhook:", err);
        setError("Erreur lors de l'envoi du webhook");

        // En cas d'erreur, remettre le statut à "En attente" et recharger
        try {
          await PipelineService.updatePipelineStatusAndAction(id, {
            statut: "En attente" as PipelineStatus,
            action: "Lancer la campagne ?" as PipelineAction,
            etape: "Critères enregistrés" as PipelineEtape,
          });
          await loadPipelines();
        } catch (rollbackError) {
          console.error("Erreur lors du rollback:", rollbackError);
          await loadPipelines();
        }

        throw err;
      } finally {
        setIsLoadingSend(false);
      }
    },
    [pipelines, loadPipelines]
  );

  return {
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
    isPollingActive: isPollingActiveRef.current,
  };
};
