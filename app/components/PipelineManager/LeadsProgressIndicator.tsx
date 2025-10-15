import React from "react";
import { Target, TrendingUp, Clock, Activity } from "lucide-react";

interface LeadsProgressIndicatorProps {
  nombreDeLeads: number;
  leadsAScapper: number; // Nombre de leads traités
  isExpanded: boolean;
}

export const LeadsProgressIndicator: React.FC<LeadsProgressIndicatorProps> = ({
  nombreDeLeads,
  leadsAScapper,
  isExpanded,
}) => {
  const leadsTraites = leadsAScapper;
  const leadsRestants = nombreDeLeads - leadsAScapper;
  const progressPercentage =
    nombreDeLeads > 0 ? (leadsAScapper / nombreDeLeads) * 100 : 0;
  const isCompleted = leadsRestants <= 0;

  return (
    <div
      className={`transition-all duration-700 ease-out overflow-hidden ${
        isExpanded ? "max-h-96 opacity-100 py-6" : "max-h-0 opacity-0 py-0"
      }`}
    >
      <div className="mx-4 bg-white border border-gray-200/60 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Header minimaliste */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200/50">
                  <Activity className="w-5 h-5 text-gray-700" />
                </div>
                {!isCompleted && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm">
                  Lead Generation
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isCompleted ? "Completed" : "In Progress"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
          </div>
        </div>

        {/* Barre de progression moderne */}
        <div className="px-6 py-4">
          <div className="relative">
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  isCompleted
                    ? "bg-emerald-500"
                    : "bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"
                }`}
                style={{ width: `${Math.min(100, progressPercentage)}%` }}
              />
            </div>
            {!isCompleted && (
              <div
                className="absolute top-0 h-1.5 w-8 bg-white/40 rounded-full animate-pulse"
                style={{
                  left: `${Math.max(0, Math.min(92, progressPercentage - 4))}%`,
                  animationDuration: "2s",
                }}
              />
            )}
          </div>
        </div>

        {/* Métriques en grid moderne */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-3 gap-4">
            {/* Objectif */}
            <div className="group">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Target
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900">
                {nombreDeLeads.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">leads</div>
            </div>

            {/* Traités */}
            <div className="group">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Generated
                </span>
              </div>
              <div className="text-xl font-bold text-emerald-600">
                {leadsTraites.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">processed</div>
            </div>

            {/* Restants */}
            <div className="group">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Remaining
                </span>
              </div>
              <div className="text-xl font-bold text-amber-600">
                {Math.max(0, leadsRestants).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">pending</div>
            </div>
          </div>
        </div>

        {/* Footer avec statut */}
        <div className="px-6 py-3 bg-gray-50/50 rounded-b-xl border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isCompleted
                    ? "bg-emerald-500"
                    : "bg-emerald-500 animate-pulse"
                }`}
              />
              <span className="text-xs text-gray-600">
                {isCompleted ? "Generation completed" : "Processing..."}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 font-mono">
                {leadsTraites}/{nombreDeLeads}
              </span>
              <div
                className={`px-2 py-1 rounded-md text-xs font-medium ${
                  isCompleted
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-blue-100 text-blue-700 border border-blue-200"
                }`}
              >
                {isCompleted ? "Done" : "Active"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
