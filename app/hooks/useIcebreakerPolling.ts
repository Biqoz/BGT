import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { PipelineService } from "../services/pipelineService";

export const useIcebreakerPolling = (pipelineId: string) => {
  const [icebreakerStats, setIcebreakerStats] = useState({
    total: 0,
    postLinkedin: 0,
    deepSearch: 0,
    generique: 0,
    pending: 0,
  });
  const [isPollingActive, setIsPollingActive] = useState(false);

  // Références pour le polling
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingActiveRef = useRef(false);
  const pollingCountRef = useRef(0);

  // Fonction pour vérifier si le polling est nécessaire
  const shouldPoll = useCallback(async () => {
    if (!pipelineId) return false;

    const { data, error } = await supabase
      .from("json_apify_pipelinelabs")
      .select("statut")
      .eq("id", pipelineId)
      .single();

    if (error) return false;

    // Continuer le polling tant que le pipeline n'est pas terminé
    return data.statut !== "Terminé";
  }, [pipelineId]);

  // Vérifier si l'étape est "Ice breakers Ready" et mettre à jour le statut
  const checkAndUpdatePipelineCompletion = useCallback(async () => {
    if (!pipelineId) {
      console.log("🔍 checkAndUpdatePipelineCompletion: Pas de pipelineId");
      return;
    }

    try {
      console.log(`🔍 Vérification pipeline ${pipelineId}...`);
      
      // Vérifier le statut et l'étape actuels du pipeline
      const { data: pipelineData, error: pipelineError } = await supabase
        .from("json_apify_pipelinelabs")
        .select("statut, etape")
        .eq("id", pipelineId)
        .single();

      if (pipelineError) {
        console.error("❌ Erreur lors de la récupération du pipeline:", pipelineError);
        return;
      }

      console.log(`📊 Pipeline actuel - Statut: "${pipelineData.statut}", Étape: "${pipelineData.etape}"`);

      // Si l'étape est "Ice breakers Ready" mais le statut n'est pas "Terminé"
      if (pipelineData.etape === "Ice breakers Ready" && pipelineData.statut !== "Terminé") {
        console.log("🎯 Conditions remplies ! Mise à jour du statut...");
        
        await PipelineService.updatePipelineStatusAndAction(pipelineId, {
          statut: "Terminé",
          action: "Campagne terminée !"
        });
        
        console.log("✅ Pipeline automatiquement marqué comme Terminé - Étape 'Ice breakers Ready' détectée");
      } else {
        console.log("⏳ Conditions non remplies pour la mise à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de completion:", error);
    }
  }, [pipelineId]);

  // Charger les statistiques des icebreakers
  const loadIcebreakerStats = useCallback(async () => {
    if (!pipelineId) return;

    try {
      const { data, error } = await supabase
        .from("apify_pipelinelabs_contacts")
        .select("is_post_linkedin, is_deepsearch, is_generique, ice_breaker")
        .eq("json_apify_pipelinelabs_id", pipelineId);

      if (error) throw error;

      const postLinkedin = data.filter(
        (c) => c.is_post_linkedin === true
      ).length;
      const deepSearch = data.filter((c) => c.is_deepsearch === true).length;
      const generique = data.filter((c) => c.is_generique === true).length;
      const processed = postLinkedin + deepSearch + generique;

      const stats = {
        total: data.length,
        postLinkedin,
        deepSearch,
        generique,
        pending: data.length - processed,
      };

      setIcebreakerStats(stats);

      // Vérifier si le pipeline doit être marqué comme terminé
      await checkAndUpdatePipelineCompletion();
    } catch (error) {
      console.error("Erreur lors du chargement des stats icebreakers:", error);
    }
  }, [pipelineId, checkAndUpdatePipelineCompletion]);

  // Arrêter le polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    isPollingActiveRef.current = false;
    setIsPollingActive(false);
    pollingCountRef.current = 0;
  }, []);

  // Démarrer le polling
  const startPolling = useCallback(async () => {
    if (isPollingActiveRef.current || !pipelineId) return;

    const needsPolling = await shouldPoll();
    if (!needsPolling) return;

    isPollingActiveRef.current = true;
    setIsPollingActive(true);
    pollingCountRef.current = 0;

    pollingIntervalRef.current = setInterval(async () => {
      pollingCountRef.current += 1;
      console.log(`🔄 Polling actif - Cycle ${pollingCountRef.current} pour pipeline ${pipelineId}`);

      try {
        await loadIcebreakerStats();

        // Vérifier si on doit continuer le polling
        const stillNeedsPolling = await shouldPoll();
        console.log(`🔍 Polling nécessaire: ${stillNeedsPolling}`);
        
        if (!stillNeedsPolling) {
          console.log("⏹️ Arrêt du polling - Pipeline terminé");
          stopPolling();
        }
      } catch (error) {
        console.error("Erreur lors du polling icebreakers:", error);
      }
    }, 5000); // 5 secondes
  }, [pipelineId, shouldPoll, loadIcebreakerStats, stopPolling]);

  // Effet pour charger les stats initiales et démarrer le polling si nécessaire
  useEffect(() => {
    if (pipelineId) {
      loadIcebreakerStats();
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [pipelineId, loadIcebreakerStats, startPolling, stopPolling]);

  return {
    icebreakerStats,
    isPollingActive,
    loadIcebreakerStats,
    startPolling,
    stopPolling,
  };
};
