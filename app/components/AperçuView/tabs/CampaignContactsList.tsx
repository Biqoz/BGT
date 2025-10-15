import React, { useState } from "react";
import { usePipelineContacts } from "../../../hooks/usePipelineContacts";
import { useIcebreakerPolling } from "../../../hooks/useIcebreakerPolling";
import { IcebreakerTypeBadge } from "../IcebreakerTypeBadge";
import { IcebreakerStatsPanel } from "../IcebreakerStatsPanel";

interface CampaignContactsListProps {
  campaignId: string;
  campaignName: string;
}

export const CampaignContactsList: React.FC<CampaignContactsListProps> = ({
  campaignId,
  campaignName,
}) => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const { contacts, isLoading } = usePipelineContacts(campaignId);
  const { icebreakerStats, isPollingActive } = useIcebreakerPolling(campaignId);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header fixe */}
      <div className="flex items-center justify-between flex-shrink-0 mb-4">
        <h3 className="font-semibold text-gray-900">{campaignName}</h3>
        <span className="text-sm bg-gray-900 text-white px-2 py-1 rounded-full">
          {contacts.length} contacts
        </span>
      </div>

      {/* Panneau de stats des icebreakers */}
      <div className="flex-shrink-0 mb-4">
        <IcebreakerStatsPanel 
          stats={icebreakerStats} 
          isPollingActive={isPollingActive} 
        />
      </div>

      {/* Zone scrollable optimisée */}
      <div className="flex-1 min-h-0">
        {contacts.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">📭</span>
              </div>
              <p className="text-gray-600">
                Aucun contact trouvé pour ce pipeline
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto pr-2">
            <div className="divide-y divide-gray-100">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() =>
                    setSelectedContact(
                      selectedContact === contact.id ? null : contact.id
                    )
                  }
                  className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {contact.first_name} {contact.last_name}
                        </h4>
                        {contact.linkedin_url && (
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full"
                            title="LinkedIn disponible"
                          ></div>
                        )}
                        <IcebreakerTypeBadge
                          isPostLinkedin={contact.is_post_linkedin}
                          isDeepsearch={contact.is_deepsearch}
                          isGenerique={contact.is_generique}
                          size="sm"
                        />
                      </div>
                      <p className="text-xs text-gray-600 truncate mt-1">
                        {contact.position || "Poste non spécifié"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {contact.org_name || "Entreprise non spécifiée"}
                      </p>
                      {(contact.city || contact.country) && (
                        <p className="text-xs text-gray-500 truncate">
                          {[contact.city, contact.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedContact === contact.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Email:
                          </span>
                          <p className="text-gray-600">
                            {contact.email || "Non disponible"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Téléphone:
                          </span>
                          <p className="text-gray-600">
                            {contact.phone || "Non disponible"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            LinkedIn:
                          </span>
                          <p className="text-gray-600 truncate">
                            {contact.linkedin_url ? (
                              <a
                                href={contact.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Voir le profil
                              </a>
                            ) : (
                              "Non disponible"
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Localisation:
                          </span>
                          <p className="text-gray-600">
                            {[contact.city, contact.country].filter(Boolean).join(', ') || "Non spécifiée"}
                          </p>
                        </div>
                      </div>
                      
                      {/* Section Icebreaker */}
                      {contact.ice_breaker && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">
                                Icebreaker:
                              </span>
                              <IcebreakerTypeBadge
                                isPostLinkedin={contact.is_post_linkedin}
                                isDeepsearch={contact.is_deepsearch}
                                isGenerique={contact.is_generique}
                                size="sm"
                              />
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm text-gray-700 italic">
                                &ldquo;{contact.ice_breaker}&rdquo;
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
