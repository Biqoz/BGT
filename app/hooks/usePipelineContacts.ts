import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import type { ApifyPipelinelabsContact } from "../types";

export const usePipelineContacts = (pipelineId: string) => {
  const [contacts, setContacts] = useState<ApifyPipelinelabsContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("apify_pipelinelabs_contacts")
        .select("*")
        .eq("json_apify_pipelinelabs_id", pipelineId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (err) {
      console.error("Erreur lors du chargement des contacts:", err);
      setError("Erreur lors du chargement des contacts");
    } finally {
      setIsLoading(false);
    }
  }, [pipelineId]);

  useEffect(() => {
    if (pipelineId) {
      loadContacts();
    }
  }, [pipelineId, loadContacts]);

  // Realtime subscription
  useEffect(() => {
    if (!pipelineId) return;

    const channel = supabase
      .channel(`apify_contacts_${pipelineId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "apify_pipelinelabs_contacts",
          filter: `json_apify_pipelinelabs_id=eq.${pipelineId}`,
        },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              setContacts((prev) => [payload.new as ApifyPipelinelabsContact, ...prev]);
              break;
            case "UPDATE":
              setContacts((prev) =>
                prev.map((contact) =>
                  contact.id === payload.new.id
                    ? (payload.new as ApifyPipelinelabsContact)
                    : contact
                )
              );
              break;
            case "DELETE":
              setContacts((prev) =>
                prev.filter((contact) => contact.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pipelineId]);

  return {
    contacts,
    isLoading,
    error,
    loadContacts,
  };
};