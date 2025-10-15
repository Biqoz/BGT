import React from "react";
import { MessageSquare, Search, FileText } from "lucide-react";

interface IcebreakerTypeBadgeProps {
  isPostLinkedin: boolean | null;
  isDeepsearch: boolean | null;
  isGenerique: boolean | null;
  size?: "sm" | "md";
}

export const IcebreakerTypeBadge: React.FC<IcebreakerTypeBadgeProps> = ({
  isPostLinkedin,
  isDeepsearch,
  isGenerique,
  size = "sm",
}) => {
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
  };

  // Déterminer le type d'icebreaker
  if (isPostLinkedin === true) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} bg-blue-100 text-blue-800 border border-blue-200`}
        title="Icebreaker basé sur un post LinkedIn"
      >
        <MessageSquare className={iconSizes[size]} />
        <span className="whitespace-nowrap">Post LinkedIn</span>
      </span>
    );
  }

  if (isDeepsearch === true) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} bg-orange-100 text-orange-800 border border-orange-200`}
        title="Icebreaker basé sur une recherche approfondie"
      >
        <Search className={iconSizes[size]} />
        <span className="whitespace-nowrap">Deep Search</span>
      </span>
    );
  }

  if (isGenerique === true) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} bg-gray-100 text-gray-800 border border-gray-200`}
        title="Icebreaker générique"
      >
        <FileText className={iconSizes[size]} />
        <span className="whitespace-nowrap">Générique</span>
      </span>
    );
  }

  // En cours de traitement
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} bg-yellow-100 text-yellow-800 border border-yellow-200`}
      title="Icebreaker en cours de génération"
    >
      <div className="animate-spin rounded-full border-2 border-yellow-600 border-t-transparent w-3 h-3"></div>
      <span className="whitespace-nowrap">En cours...</span>
    </span>
  );
};