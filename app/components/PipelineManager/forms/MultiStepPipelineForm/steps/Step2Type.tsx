import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepProps } from "../types";

export const Step2Type: React.FC<StepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
  isLoading
}) => {
  const handleTypeSelect = (type: "email" | "linkedin") => {
    onUpdate({ campaign_type: type });
  };

  const handleNext = () => {
    if (data.campaign_type === "linkedin") {
      // Skip step 3 for LinkedIn campaigns
      onNext();
      setTimeout(onNext, 0); // Skip to step 4
    } else {
      onNext();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Type de campagne</CardTitle>
        <CardDescription>
          Sélectionnez le type de campagne que vous souhaitez créer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleTypeSelect("email")}
            disabled={isLoading}
            className={`p-6 border-2 rounded-lg text-left transition-all hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
              data.campaign_type === "email"
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-accent"
            }`}
          >
            <div className="text-lg font-medium mb-2">📧 Email</div>
            <div className="text-sm text-muted-foreground">
              Campagne d&apos;emailing avec Instantly.ai
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleTypeSelect("linkedin")}
            disabled={isLoading}
            className={`p-6 border-2 rounded-lg text-left transition-all hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
              data.campaign_type === "linkedin"
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-accent"
            }`}
          >
            <div className="text-lg font-medium mb-2">💼 LinkedIn</div>
            <div className="text-sm text-muted-foreground">
              Campagne de prospection LinkedIn
            </div>
          </button>
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
            onClick={handleNext}
            disabled={!data.campaign_type || isLoading}
            className="min-w-24"
          >
            Suivant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};