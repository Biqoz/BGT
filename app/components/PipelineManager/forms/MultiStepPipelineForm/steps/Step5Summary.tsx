import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StepProps } from "../types";
import { useInstantlyCampaigns } from "@/app/hooks/useInstantlyCampaigns";

interface Step5SummaryProps extends StepProps {
  onSubmit: () => void;
}

export const Step5Summary: React.FC<Step5SummaryProps> = ({
  data,
  onPrev,
  onSubmit,
  isLoading
}) => {
  const { campaigns } = useInstantlyCampaigns();
  
  const selectedCampaign = campaigns.find(c => c.id === data.instantly_campaign_id);
  
  let parsedCriteria = null;
  try {
    parsedCriteria = JSON.parse(data.criteresJson);
  } catch {
    // Ignore parsing errors
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Résumé du pipeline</CardTitle>
        <CardDescription>
          Vérifiez les informations avant de créer votre pipeline.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Nom */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Nom :</span>
            <span className="text-sm">{data.nom}</span>
          </div>
          
          <Separator />

          {/* Type */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Type :</span>
            <Badge variant={data.campaign_type === "email" ? "default" : "secondary"}>
              {data.campaign_type === "email" ? "📧 Email" : "💼 LinkedIn"}
            </Badge>
          </div>

          {/* Campagne */}
          {data.campaign_type === "email" && selectedCampaign && (
            <>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Campagne :</span>
                <span className="text-sm">{selectedCampaign.name}</span>
              </div>
            </>
          )}

          <Separator />

          {/* Critères */}
          <div>
            <span className="text-sm font-medium block mb-2">Critères :</span>
            {parsedCriteria && (
              <div className="rounded-md bg-muted p-3 max-h-40 overflow-y-auto">
                <ul className="space-y-1">
                  {Object.entries(parsedCriteria).map(([key, value]) => (
                    <li key={key} className="text-xs">
                      <strong>{key}:</strong> {JSON.stringify(value)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="min-w-32"
          >
            {isLoading ? "Création..." : "Créer le pipeline"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};