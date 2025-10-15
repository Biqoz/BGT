import React, { useState, useCallback } from "react";
import { StepIndicator } from "./components/StepIndicator";
import { Step1Name } from "./steps/Step1Name";
import { Step2Type } from "./steps/Step2Type";
import { Step3Campaign } from "./steps/Step3Campaign";
import { Step4Json } from "./steps/Step4Json";
import { Step5Summary } from "./steps/Step5Summary";
import { MultiStepFormData } from "./types";
import type { PipelineFormData } from "@/app/types";

interface MultiStepPipelineFormProps {
  onSubmit: (data: PipelineFormData) => Promise<void>;
  isLoading?: boolean;
}

// Fonction de validation déplacée à l'extérieur du composant
const validateStep = (step: number, formData: MultiStepFormData): { isValid: boolean; errors: Record<string, string> } => {
  const newErrors: Record<string, string> = {};

  switch (step) {
    case 1:
      if (!formData.nom.trim()) {
        newErrors.nom = "Le nom du pipeline est requis";
      }
      break;
    case 3:
      if (formData.campaign_type === "email" && !formData.instantly_campaign_id) {
        newErrors.instantly_campaign_id = "Veuillez sélectionner une campagne";
      }
      break;
    case 4:
      if (!formData.criteresJson.trim()) {
        newErrors.criteresJson = "Les critères JSON sont requis";
      } else {
        try {
          const parsedCriteria = JSON.parse(formData.criteresJson);
          
          // Validation spécifique pour les campagnes email
          if (formData.campaign_type === "email") {
            if (!parsedCriteria.hasEmail || parsedCriteria.hasEmail !== true) {
              newErrors.criteresJson = "⚠️ Pour une campagne email, le champ 'hasEmail' doit être défini à 'true' dans les critères JSON";
            }
          }
        } catch {
          newErrors.criteresJson = "Le JSON n'est pas valide";
        }
      }
      break;
  }

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors
  };
};

export const MultiStepPipelineForm: React.FC<MultiStepPipelineFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MultiStepFormData>({
    nom: "",
    campaign_type: "email",
    instantly_campaign_id: "",
    criteresJson: "",
    consigne: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fonction mémorisée pour éviter les re-renders
  const updateFormData = useCallback((updates: Partial<MultiStepFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleNext = useCallback(() => {
    const validation = validateStep(currentStep, formData);
    setErrors(validation.errors);
    
    if (validation.isValid) {
      // Skip step 3 for LinkedIn campaigns
      if (currentStep === 2 && formData.campaign_type === "linkedin") {
        setCurrentStep(4);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  }, [currentStep, formData]);

  const handlePrev = useCallback(() => {
    // Skip step 3 when going back from step 4 if LinkedIn
    if (currentStep === 4 && formData.campaign_type === "linkedin") {
      setCurrentStep(2);
    } else {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep, formData.campaign_type]);

  const handleSubmit = useCallback(async () => {
    const validation = validateStep(4, formData);
    setErrors(validation.errors);
    
    if (validation.isValid) {
      try {
        const parsedCriteres = JSON.parse(formData.criteresJson);
        const finalFormData: PipelineFormData = {
          nom: formData.nom,
          criteres: parsedCriteres,
          consigne: formData.consigne || "",
          campaign_type: formData.campaign_type,
          instantly_campaign_id: formData.instantly_campaign_id
        };

        await onSubmit(finalFormData);

        // Reset form
        setFormData({
          nom: "",
          campaign_type: "email",
          instantly_campaign_id: "",
          criteresJson: "",
          consigne: ""
        });
        setCurrentStep(1);
        setErrors({});
      } catch (error) {
        console.error("Erreur lors de la soumission:", error);
      }
    }
  }, [formData, onSubmit]);

  const stepProps = {
    data: formData,
    onUpdate: updateFormData,
    onNext: handleNext,
    onPrev: handlePrev,
    isLoading,
    errors
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Name {...stepProps} />;
      case 2:
        return <Step2Type {...stepProps} />;
      case 3:
        return <Step3Campaign {...stepProps} />;
      case 4:
        return <Step4Json {...stepProps} />;
      case 5:
        return <Step5Summary {...stepProps} onSubmit={handleSubmit} />;
      default:
        return <Step1Name {...stepProps} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <StepIndicator currentStep={currentStep} />
      {renderStep()}
    </div>
  );
};
