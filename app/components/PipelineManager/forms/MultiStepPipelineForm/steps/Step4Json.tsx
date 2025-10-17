import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepProps } from "../types";

export const Step4Json: React.FC<StepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
  errors,
  isLoading,
}) => {
  const [showLinkedInWarning, setShowLinkedInWarning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si c'est LinkedIn, afficher le warning avant de continuer
    if (data.campaign_type === "linkedin") {
      setShowLinkedInWarning(true);
      return;
    }
    
    onNext();
  };

  const handleLinkedInContinue = () => {
    setShowLinkedInWarning(false);
    onNext();
  };

  const handleLinkedInCancel = () => {
    setShowLinkedInWarning(false);
  };

  return (
    <>
      {/* Warning Modal pour LinkedIn */}
      {showLinkedInWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-900">
                  ⚠️ Attention - Limites LinkedIn
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p className="font-semibold">
                    Rappel des limites La Growth Machine :
                  </p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Maximum <strong>80 demandes/jour</strong></li>
                    <li>Maximum <strong>2400 demandes/mois</strong></li>
                  </ul>
                  <p className="mt-3 font-medium">
                    Voulez-vous continuer avec ces critères ?
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleLinkedInCancel}
                className="text-gray-700"
              >
                Modifier les critères
              </Button>
              <Button
                type="button"
                onClick={handleLinkedInContinue}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Continuer quand même
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Critères de recherche</CardTitle>
          <CardDescription>
            Collez le JSON contenant vos critères de recherche.
          </CardDescription>
        </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avertissement pour les campagnes email */}
          {data.campaign_type === "email" && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-amber-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    Important pour les campagnes email
                  </h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      Pour une campagne email, vous{" "}
                      <strong>devez absolument</strong> inclure{" "}
                      <code className="bg-amber-100 px-1 rounded">
                        &quot;hasEmail&quot;: true
                      </code>{" "}
                      dans vos critères JSON, sinon la campagne sera refusée.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Avertissement pour les campagnes LinkedIn */}
          {data.campaign_type === "linkedin" && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Limites LinkedIn - La Growth Machine
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      La Growth Machine conseille un maximum de{" "}
                      <strong>80 demandes de connexion par jour</strong>, soit{" "}
                      <strong>2400 connexions maximum par mois</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="criteres"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              JSON des critères *
            </label>
            <textarea
              id="criteres"
              value={data.criteresJson}
              onChange={(e) => onUpdate({ criteresJson: e.target.value })}
              rows={12}
              className={`flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-none ${
                errors?.criteresJson ? "border-destructive" : ""
              }`}
              placeholder={
                data.campaign_type === "email"
                  ? '{\n  "personTitle": ["manager"],\n  "seniority": ["Manager"],\n  "personCountry": ["France"],\n  "hasEmail": true,\n  "totalResults": 100\n}'
                  : '{"companyCountry": ["France"], "companyCity": ["Paris"]}'
              }
              disabled={isLoading}
              spellCheck={false}
              autoComplete="off"
            />
            {errors?.criteresJson && (
              <p className="text-sm text-destructive">{errors.criteresJson}</p>
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
            <Button type="submit" disabled={isLoading} className="min-w-24">
              Suivant
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </>
  );
};
