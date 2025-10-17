import { PipelineFormStep } from "./types";

export const FORM_STEPS: PipelineFormStep[] = [
  {
    id: 1,
    title: "Nom de la campagne",
    description: "Donnez un nom à votre pipeline",
  },
  {
    id: 2,
    title: "Type de campagne",
    description: "Choisissez le type de campagne",
  },
  {
    id: 3,
    title: "Sélection campagne",
    description: "Sélectionnez votre campagne Instantly.ai",
  },
  {
    id: 4,
    title: "Critères JSON",
    description: "Définissez vos critères de recherche",
  },
  {
    id: 5,
    title: "Confirmation",
    description: "Vérifiez et confirmez votre pipeline",
  },
];
