// ===== TYPES DE BASE =====
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

export interface BaseRawEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// ===== NOUVEAUX TYPES PIPELINE LABS =====

// Critères de recherche JSON pour Apify
export interface PipelineSearchCriteria {
  companyCity?: string[];
  companyCountry?: string[];
  companyDomain?: string[];
  companyEmployeeSize?: string[];
  companyIndustry?: string[];
  companyKeyword?: string[];
  companyState?: string[];
  contactEmailStatus?: string[];
  functional?: string[];
  hasEmail?: boolean;
  hasPhone?: boolean;
  personCity?: string[];
  personCountry?: string[];
  personState?: string[];
  seniority?: string[];
  totalResults?: number;
}

// Types de campagne
export type CampaignType = "email" | "linkedin";

// Campagne Instantly.ai
export interface InstantlyCampaign {
  id: string;
  name: string;
  status: number;
}

// Statuts et étapes
export type PipelineStatus =
  | "En attente"
  | "Traitement en cours"
  | "Terminé"
  | "Erreur";

export type PipelineEtape =
  | "Critères enregistrés"
  | "Leads en cours de génération"
  | "Leads générés"
  | "Données enrichies"
  | "Ice breakers Ready"
  | "Emails envoyés";

export type PipelineAction = "Lancer la campagne ?" | "Campagne lancée !" | "Campagne terminée !";

// Table principale : json_apify_pipelinelabs
// Table principale : json_apify_pipelinelabs
export interface JsonApifyPipelinelabs extends BaseEntity {
  url: string; // Maintenant contient le JSON des critères
  consigne: string | null;
  statut: PipelineStatus | null;
  nom: string;
  action: PipelineAction | null;
  etape: PipelineEtape | null;
  type_de_campagne: CampaignType; // Nouvelle colonne
  id_campagne: string; // Nouvelle colonne
  nombre_de_leads?: number | null; // Nouvelle colonne pour le nombre total de leads
  leads_a_scapper?: number | null; // Nouvelle colonne pour les leads restants à scrapper
}

// Contact Pipeline Labs
export interface ApifyPipelinelabsContact extends BaseEntity {
  json_apify_pipelinelabs_id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  email_status: string | null;
  linkedin_url: string | null;
  position: string | null;
  seniority: string | null;
  functional: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  person_id: string | null;
  phone: string | null;
  phone_raw: string | null;
  org_name: string | null;
  org_id: string | null;
  org_industry: string | null;
  org_size: string | null;
  org_city: string | null;
  org_state: string | null;
  org_country: string | null;
  org_website: string | null;
  org_linkedin_url: string | null;
  org_description: string | null;
  org_founded_year: string | null;
  org_specialities: string | null;
  infos_leads: string | null;
  ice_breaker: string | null;
  is_post_linkedin: boolean | null;
  is_deepsearch: boolean | null;
  is_generique: boolean | null;
}

// Lead simplifié basé sur les contacts
export interface Lead extends BaseEntity {
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  linkedin_url: string | null;
  city: string | null;
  country: string | null;
  org_name: string | null;
  infos_leads: string | null;
  ice_breaker: string | null;
  step_contact: StepContact;
  email_sent: boolean;
  email_open: boolean;
  link_clicked: boolean;
  answered: boolean;
  last_contact_date?: string;
}

export type StepContact =
  | "initial"
  | "follow_up_1"
  | "follow_up_2"
  | "follow_up_3"
  | "closed"
  | "unresponsive";

// ===== PROPS DE BASE =====

export interface SelectableItemProps<T> {
  item: T;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export interface BaseTableProps<T> {
  items: T[];
  isLoading?: boolean;
  onItemSelect?: (id: string) => void;
  selectedItemId?: string | null;
}

export interface BaseManagerProps {
  className?: string;
}

// ===== TYPES SPÉCIFIQUES AUX COMPOSANTS =====

// User
export interface User {
  id: string;
  email: string;
  name: string;
}

// Forms
export interface PipelineFormData {
  nom: string;
  criteres: PipelineSearchCriteria;
  consigne: string;
  campaign_type: CampaignType;
  instantly_campaign_id?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ===== PROPS DE COMPOSANTS =====

export interface PipelineTableProps {
  pipelines: JsonApifyPipelinelabs[];
  onWebhookSend: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onViewContacts?: (id: string) => void;
  onPipelineSelect?: (id: string) => void;
  selectedPipelineId?: string | null;
  isLoadingSend?: boolean;
  isLoadingDelete?: boolean;
}

export type PipelineManagerProps = BaseManagerProps;

// Contacts
export interface ContactsTableProps {
  contacts: ApifyPipelinelabsContact[];
  isLoading?: boolean;
  onContactSelect?: (contactId: string) => void;
  selectedContactId?: string | null;
}

export type ContactTableRowProps =
  SelectableItemProps<ApifyPipelinelabsContact>;

// Leads
export interface LeadsTableProps {
  leads: Lead[];
  isLoading?: boolean;
  onLeadSelect?: (leadId: string) => void;
  selectedLeadId?: string | null;
}

export type LeadTableRowProps = SelectableItemProps<Lead>;
export type LeadsManagerProps = BaseManagerProps;

export interface LeadsStatsProps {
  leads: Lead[];
}

export interface LeadTrackingIndicatorProps {
  lead: Lead;
  size?: "sm" | "md" | "lg";
}

export interface LeadStepBadgeProps {
  step: StepContact;
  size?: "sm" | "md" | "lg";
}

// UI Components
export interface ModernSidebarProps {
  className?: string;
  activeView: string;
  onNavigate: (view: string) => void;
}

export interface AperçuViewProps {
  pipelineUrl?: string;
  isProcessing?: boolean;
}

export interface PipelineFormProps {
  onSubmit: (data: PipelineFormData) => Promise<void>;
  isLoading?: boolean;
}

export interface LoginProps {
  onLogin: (credentials: LoginCredentials) => Promise<void>;
}

export interface UserMenuProps {
  user: User;
  onLogout: () => void;
}
