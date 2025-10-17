import { useState, useCallback } from "react";
import { Lead } from "../types";

interface UseLeadsReturn {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  selectedLead: Lead | null;
  loadLeads: () => Promise<void>;
  selectLead: (leadId: string | null) => void;
}

export function useLeads(): UseLeadsReturn {
  const [leads] = useState<Lead[]>([]);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Fonction vide pour maintenir la compatibilité
  const loadLeads = useCallback(async () => {
    // Fonctionnalité désactivée - sera remplacée par LinkedIn
  }, []);

  // Sélectionner un lead
  const selectLead = useCallback((leadId: string | null) => {
    // Fonctionnalité désactivée - leadId ignoré pour le moment
    void leadId; // Utilisation explicite pour éviter l'erreur TypeScript strict
    setSelectedLead(null);
  }, []);

  return {
    leads,
    isLoading,
    error,
    selectedLead,
    loadLeads,
    selectLead,
  };
}
