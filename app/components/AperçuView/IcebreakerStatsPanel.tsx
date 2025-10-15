import React from "react";
import { MessageSquare, Search, FileText, Clock } from "lucide-react";

interface IcebreakerStatsPanelProps {
  stats: {
    total: number;
    postLinkedin: number;
    deepSearch: number;
    generique: number;
    pending: number;
  };
  isPollingActive: boolean;
}

export const IcebreakerStatsPanel: React.FC<IcebreakerStatsPanelProps> = ({
  stats,
  isPollingActive,
}) => {
  const getPercentage = (value: number) => {
    return stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">
          Icebreakers générés
        </h4>
        {isPollingActive && (
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <div className="animate-spin rounded-full border-2 border-blue-600 border-t-transparent w-3 h-3"></div>
            <span>Génération en cours</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Post LinkedIn */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-blue-600">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs font-medium">LinkedIn</span>
          </div>
          <div className="text-xs text-gray-600">
            {stats.postLinkedin} ({getPercentage(stats.postLinkedin)}%)
          </div>
        </div>

        {/* Deep Search */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-orange-600">
            <Search className="w-4 h-4" />
            <span className="text-xs font-medium">Deep Search</span>
          </div>
          <div className="text-xs text-gray-600">
            {stats.deepSearch} ({getPercentage(stats.deepSearch)}%)
          </div>
        </div>

        {/* Générique */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-gray-600">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-medium">Générique</span>
          </div>
          <div className="text-xs text-gray-600">
            {stats.generique} ({getPercentage(stats.generique)}%)
          </div>
        </div>

        {/* En attente */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-yellow-600">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">En attente</span>
          </div>
          <div className="text-xs text-gray-600">
            {stats.pending} ({getPercentage(stats.pending)}%)
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Progression</span>
          <span>{stats.total - stats.pending}/{stats.total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 via-orange-500 to-gray-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${getPercentage(stats.total - stats.pending)}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};