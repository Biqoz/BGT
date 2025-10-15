import React from "react";
import { FORM_STEPS } from "../constants";

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {FORM_STEPS.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step.id <= currentStep
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step.id}
            </div>
            <div className="mt-2 text-center">
              <div className="text-xs font-medium text-gray-900">{step.title}</div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
          </div>
          {index < FORM_STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-4 transition-colors ${
                step.id < currentStep ? "bg-gray-900" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};