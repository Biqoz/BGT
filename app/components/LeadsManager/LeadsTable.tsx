'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LeadsTableProps, Lead } from '@/app/types';
import { cn } from '@/lib/utils';
import { 
  Mail, 
  MailOpen, 
  MousePointer, 
  MessageCircle, 
  ExternalLink,
  User,
  Building2,
  MapPin
} from 'lucide-react';

const stepLabels: Record<Lead['step_contact'], string> = {
  initial: 'Initial',
  follow_up_1: 'Suivi 1',
  follow_up_2: 'Suivi 2', 
  follow_up_3: 'Suivi 3',
  closed: 'Fermé',
  unresponsive: 'Non réactif'
};

const stepColors: Record<Lead['step_contact'], string> = {
  initial: 'bg-gray-100 text-gray-800 border-gray-200',
  follow_up_1: 'bg-gray-100 text-gray-800 border-gray-200',
  follow_up_2: 'bg-gray-200 text-gray-900 border-gray-300',
  follow_up_3: 'bg-gray-800 text-white border-gray-800',
  closed: 'bg-black text-white border-black',
  unresponsive: 'bg-gray-50 text-gray-500 border-gray-200'
};

function TrackingIndicators({ lead }: { lead: Lead }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "flex items-center justify-center w-7 h-7 rounded-md text-xs transition-all border",
        lead.email_sent ? "bg-gray-800 text-white border-gray-800" : "bg-gray-50 text-gray-400 border-gray-200"
      )}>
        <Mail className="w-3.5 h-3.5" />
      </div>
      
      <div className={cn(
        "flex items-center justify-center w-7 h-7 rounded-md text-xs transition-all border",
        lead.email_open ? "bg-gray-800 text-white border-gray-800" : "bg-gray-50 text-gray-400 border-gray-200"
      )}>
        <MailOpen className="w-3.5 h-3.5" />
      </div>
      
      <div className={cn(
        "flex items-center justify-center w-7 h-7 rounded-md text-xs transition-all border",
        lead.link_clicked ? "bg-gray-800 text-white border-gray-800" : "bg-gray-50 text-gray-400 border-gray-200"
      )}>
        <MousePointer className="w-3.5 h-3.5" />
      </div>
      
      <div className={cn(
        "flex items-center justify-center w-7 h-7 rounded-md text-xs transition-all border",
        lead.answered ? "bg-black text-white border-black" : "bg-gray-50 text-gray-400 border-gray-200"
      )}>
        <MessageCircle className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}

function LeadRow({ lead, onLeadSelect, isSelected }: {
  lead: Lead;
  onLeadSelect: (leadId: string) => void;
  isSelected: boolean;
}) {
  // Utiliser full_name en priorité, sinon construire à partir de first_name + last_name
  const fullName = lead.full_name || 
    [lead.first_name, lead.last_name].filter(Boolean).join(' ') || 
    'Sans nom';
  
  // Construire la localisation
  const location = [lead.city, lead.country].filter(Boolean).join(', ') || 'Non spécifié';
  
  return (
    <tr 
      className={cn(
        "group border-b border-gray-100 cursor-pointer transition-all duration-150",
        "hover:bg-gray-50",
        isSelected && "bg-gray-100 border-gray-200"
      )}
      onClick={() => onLeadSelect(lead.id)}
    >
      {/* Contact */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center group-hover:bg-gray-200 transition-colors">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{fullName}</div>
            {lead.email && (
              <div className="text-sm text-gray-500">{lead.email}</div>
            )}
          </div>
        </div>
      </td>
      
      {/* Localisation */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{location}</span>
        </div>
      </td>
      
      {/* Organisation */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {lead.org_name || 'Non spécifié'}
          </span>
        </div>
      </td>
      
      {/* Étape */}
      <td className="px-6 py-4">
        <Badge className={cn("text-xs border font-medium", stepColors[lead.step_contact])}>
          {stepLabels[lead.step_contact]}
        </Badge>
      </td>
      
      {/* Tracking */}
      <td className="px-6 py-4">
        <TrackingIndicators lead={lead} />
      </td>
      
      {/* LinkedIn */}
      <td className="px-6 py-4">
        {lead.linkedin_url && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              window.open(lead.linkedin_url!, '_blank');
            }}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        )}
      </td>
    </tr>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-6 w-20" />
          <div className="flex space-x-2">
            {[...Array(4)].map((_, j) => (
              <Skeleton key={j} className="h-7 w-7 rounded-md" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function LeadsTable({ 
  leads, 
  isLoading, 
  onLeadSelect, 
  selectedLeadId 
}: LeadsTableProps) {
  if (isLoading) {
    return (
      <Card className="m-6 border border-gray-200 shadow-none bg-white">
        <div className="p-6">
          <LoadingSkeleton />
        </div>
      </Card>
    );
  }

  if (leads.length === 0) {
    return (
      <Card className="m-6 border border-gray-200 shadow-none bg-white">
        <div className="p-12 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun lead trouvé
          </h3>
          <p className="text-gray-500">
            Commencez par ajouter des leads à votre pipeline.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="m-6 border border-gray-200 shadow-none bg-white">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Localisation
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Organisation
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Étape
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Tracking
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              LinkedIn
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {leads.map((lead) => (
            <LeadRow
              key={lead.id}
              lead={lead}
              onLeadSelect={onLeadSelect || (() => {})}
              isSelected={selectedLeadId === lead.id}
            />
          ))}
        </tbody>
      </table>
    </Card>
  );
}