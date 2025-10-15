import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepProps } from "../types";
import { useInstantlyCampaigns } from "@/app/hooks/useInstantlyCampaigns";

export const Step3Campaign: React.FC<StepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
  errors,
  isLoading
}) => {
  const { campaigns, isLoading: campaignsLoading, error } = useInstantlyCampaigns();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.instantly_campaign_id) {
      onNext();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sélection de la campagne</CardTitle>
        <CardDescription>
          Choisissez la campagne Instantly.ai à utiliser pour ce pipeline.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="campaign" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Campagne Instantly.ai *
            </label>
            
            {campaignsLoading && (
              <div className="flex h-9 w-full items-center justify-center rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground">
                Chargement des campagnes...
              </div>
            )}
            
            {error && (
              <div className="flex h-9 w-full items-center rounded-md border border-destructive bg-destructive/10 px-3 py-1 text-sm text-destructive">
                Erreur: {error}
              </div>
            )}
            
            {!campaignsLoading && !error && (
              <select
                id="campaign"
                value={data.instantly_campaign_id}
                onChange={(e) => onUpdate({ instantly_campaign_id: e.target.value })}
                className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors?.instantly_campaign_id ? "border-destructive" : ""
                }`}
                disabled={isLoading}
                aria-invalid={!!errors?.instantly_campaign_id}
              >
                <option value="">Sélectionnez une campagne</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name} {campaign.status === 1 ? "(Active)" : "(Inactive)"}
                  </option>
                ))}
              </select>
            )}
            
            {errors?.instantly_campaign_id && (
              <p className="text-sm text-destructive">{errors.instantly_campaign_id}</p>
            )}
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onPrev}
              disabled={isLoading}
            >
              Précédent
            </Button>
            <Button
              type="submit"
              disabled={!data.instantly_campaign_id || isLoading}
              className="min-w-24"
            >
              Suivant
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};