'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { LeadsStatsProps } from '@/app/types';
import { 
  Users, 
  Mail, 
  MailOpen, 
  MessageCircle,
  TrendingUp
} from 'lucide-react';

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description,
  trend 
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  trend?: string;
}) {
  return (
    <Card className="p-6 border border-gray-200 hover:border-gray-300 transition-colors bg-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          )}
        </div>
        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4 text-sm">
          <TrendingUp className="w-4 h-4 text-gray-600 mr-1" />
          <span className="text-gray-700 font-medium">{trend}</span>
          <span className="text-gray-400 ml-1">vs mois dernier</span>
        </div>
      )}
    </Card>
  );
}

export function LeadsStats({ leads }: LeadsStatsProps) {
  const totalLeads = leads.length;
  const emailsSent = leads.filter(lead => lead.email_sent).length;
  const emailsOpened = leads.filter(lead => lead.email_open).length;
  const responses = leads.filter(lead => lead.answered).length;
  
  const openRate = emailsSent > 0 ? Math.round((emailsOpened / emailsSent) * 100) : 0;
  const responseRate = emailsSent > 0 ? Math.round((responses / emailsSent) * 100) : 0;
  
  const activeLeads = leads.filter(lead => 
    !['closed', 'unresponsive'].includes(lead.step_contact)
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <StatCard
        title="Total Leads"
        value={totalLeads}
        icon={Users}
        description={`${activeLeads} actifs`}
      />
      
      <StatCard
        title="Emails Envoyés"
        value={emailsSent}
        icon={Mail}
        description={`sur ${totalLeads} leads`}
      />
      
      <StatCard
        title="Ouvertures"
        value={`${openRate}%`}
        icon={MailOpen}
        description={`${emailsOpened} ouvertures`}
        trend={openRate > 20 ? "+5%" : undefined}
      />
      
      <StatCard
        title="Réponses"
        value={`${responseRate}%`}
        icon={MessageCircle}
        description={`${responses} réponses`}
        trend={responseRate > 10 ? "+3%" : undefined}
      />
      
      <StatCard
        title="Conversion"
        value={`${Math.round((responses / totalLeads) * 100)}%`}
        icon={TrendingUp}
        description="Lead vers réponse"
      />
    </div>
  );
}