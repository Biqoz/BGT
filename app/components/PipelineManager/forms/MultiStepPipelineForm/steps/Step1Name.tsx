import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StepProps } from "../types";

export const Step1Name: React.FC<StepProps> = ({
  data,
  onUpdate,
  onNext,
  errors,
  isLoading
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nom du pipeline</CardTitle>
        <CardDescription>
          Donnez un nom descriptif à votre pipeline de prospection.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="nom" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Nom du pipeline *
            </label>
            <Input
              id="nom"
              type="text"
              value={data.nom}
              onChange={(e) => onUpdate({ nom: e.target.value })}
              placeholder="Ex: Prospection Tech Paris Q1 2024"
              disabled={isLoading}
              className={errors?.nom ? "border-destructive" : ""}
            />
            {errors?.nom && (
              <p className="text-sm text-destructive">{errors.nom}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-24"
            >
              Suivant
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};