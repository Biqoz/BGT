import React from "react";
import { Mail, Linkedin } from "lucide-react";
import type { CampaignType } from "../../types";

interface CampaignTypeLabelProps {
  type: CampaignType;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const CampaignTypeLabel: React.FC<CampaignTypeLabelProps> = ({
  type,
  size = "sm",
  showText = true,
}) => {
  const isEmail = type === "email";
  
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-5 h-5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} ${
        isEmail
          ? "bg-blue-100 text-blue-800 border border-blue-200"
          : "bg-purple-100 text-purple-800 border border-purple-200"
      }`}
    >
      {isEmail ? (
        <Mail className={iconSizes[size]} />
      ) : (
        <Linkedin className={iconSizes[size]} />
      )}
      {showText && (
        <span className="whitespace-nowrap">
          {isEmail ? "Email" : "LinkedIn"}
        </span>
      )}
    </span>
  );
};