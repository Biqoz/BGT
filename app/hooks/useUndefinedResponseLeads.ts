import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import type { LeadResponseIndefinie } from "../types";

export const useUndefinedResponseLeads = () => {
  const [leads, setLeads] = useState<LeadResponseIndefinie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("leads_avec_reponse_indefinie")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads((data || []) as LeadResponseIndefinie[]);
    } catch (err) {
      console.error("Erreur lors du chargement des leads indéfinis:", err);
      setError("Erreur lors du chargement des leads indéfinis");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteLead = useCallback(async (leadId: number) => {
    try {
      setError(null);

      const { error } = await supabase
        .from("leads_avec_reponse_indefinie")
        .delete()
        .eq("id", leadId);

      if (error) throw error;

      // Mise à jour optimiste de l'état local
      setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
    } catch (err) {
      console.error("Erreur lors de la suppression du lead:", err);
      setError("Erreur lors de la suppression du lead");
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // Realtime subscription (optionnel mais utile)
  useEffect(() => {
    const channel = supabase
      .channel("leads_indefinis")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads_avec_reponse_indefinie",
        },
        (payload) => {
          setLeads((prev) => {
            switch (payload.eventType) {
              case "INSERT":
                return [payload.new as LeadResponseIndefinie, ...prev];
              case "UPDATE":
                return prev.map((lead) =>
                  lead.id === (payload.new as LeadResponseIndefinie).id
                    ? (payload.new as LeadResponseIndefinie)
                    : lead
                );
              case "DELETE":
                return prev.filter(
                  (lead) => lead.id !== (payload.old as LeadResponseIndefinie).id
                );
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { leads, isLoading, error, reload: loadLeads, deleteLead };
};