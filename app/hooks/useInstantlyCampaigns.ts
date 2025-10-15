import { useState, useEffect } from 'react';
import type { InstantlyCampaign } from '@/app/types';

export const useInstantlyCampaigns = () => {
  const [campaigns, setCampaigns] = useState<InstantlyCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Créer un endpoint API pour récupérer les campagnes Instantly.ai
      const response = await fetch('/api/instantly/campaigns');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des campagnes');
      }
      
      const data = await response.json();
      setCampaigns(data.campaigns || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    isLoading,
    error,
    refetch: fetchCampaigns,
  };
};