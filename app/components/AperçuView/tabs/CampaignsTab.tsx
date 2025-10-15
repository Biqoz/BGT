import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JsonApifyPipelinelabs } from "../../../types";
import { CampaignContactsList } from "./CampaignContactsList";
import { CampaignTypeLabel } from "../../PipelineManager/CampaignTypeLabel";

interface CampaignsTabProps {
  campaigns: JsonApifyPipelinelabs[];
}

export const CampaignsTab: React.FC<CampaignsTabProps> = ({ campaigns }) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null
  );

  const getStatusLabel = (campaign: JsonApifyPipelinelabs) => {
    if (campaign.statut === "Terminé") return "Terminé";
    if (campaign.statut === "Traitement en cours") return "Traitement en cours";
    if (campaign.statut === "Erreur") return "Erreur";
    return "En attente";
  };

  const getStatusColor = (campaign: JsonApifyPipelinelabs) => {
    if (campaign.statut === "Terminé")
      return "text-green-600 bg-green-50 border-green-200";
    if (campaign.statut === "Traitement en cours")
      return "text-blue-600 bg-blue-50 border-blue-200";
    if (campaign.statut === "Erreur")
      return "text-red-600 bg-red-50 border-red-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Contenu principal avec hauteur calculée */}
      <div className="flex-1 min-h-0 flex gap-6">
        {/* Liste des pipelines - largeur fixe */}
        <div className="w-80 flex-shrink-0">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">
                Liste des pipelines
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-3 pt-0">
              {/* Zone scrollable pour les pipelines */}
              <div className="h-full overflow-y-auto pr-2 space-y-3">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    onClick={() => setSelectedCampaignId(campaign.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedCampaignId === campaign.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <h4
                          className="font-medium text-gray-900 text-sm truncate"
                          title={campaign.nom}
                        >
                          {campaign.nom}
                        </h4>
                        <CampaignTypeLabel
                          type={campaign.type_de_campagne}
                          size="sm"
                          showText={false}
                        />
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(
                          campaign
                        )}`}
                      >
                        {getStatusLabel(campaign)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contacts extraits  */}
        <div className="flex-1 min-w-0">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">
                Contacts extraits
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-3 pt-0">
              {selectedCampaignId ? (
                <CampaignContactsList
                  campaignId={selectedCampaignId}
                  campaignName={
                    campaigns.find((c) => c.id === selectedCampaignId)?.nom ||
                    ""
                  }
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">📊</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      Sélectionnez un pipeline
                    </h3>
                    <p className="text-sm text-gray-600">
                      Cliquez sur un pipeline pour voir les contacts extraits
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
