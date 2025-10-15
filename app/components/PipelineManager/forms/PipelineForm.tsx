import React from "react";
import { MultiStepPipelineForm } from "./MultiStepPipelineForm";
import type { PipelineFormProps } from "@/app/types";

export const PipelineForm: React.FC<PipelineFormProps> = (props) => {
  return <MultiStepPipelineForm {...props} />;
};
