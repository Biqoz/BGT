export interface PipelineFormStep {
  id: number;
  title: string;
  description: string;
}

export interface MultiStepFormData {
  nom: string;
  campaign_type: "email" | "linkedin";
  instantly_campaign_id: string;
  criteresJson: string;
  consigne: string;
}

export interface StepProps {
  data: MultiStepFormData;
  onUpdate: (updates: Partial<MultiStepFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
  errors: Record<string, string>;
  onSubmit?: () => void;
}