import { supabase } from "../../lib/supabase";
import type { JsonApifyPipelinelabs, PipelineFormData } from "../types";

export class PipelineService {
  // Validation des critères pour les campagnes email
  static validateEmailCriteria(formData: PipelineFormData): void {
    if (formData.campaign_type === "email") {
      if (!formData.criteres.hasEmail || formData.criteres.hasEmail !== true) {
        throw new Error("Pour une campagne email, le champ 'hasEmail' doit être défini à 'true' dans les critères");
      }
    }
  }

  // Récupérer tous les pipelines
  static async getAllPipelines(): Promise<JsonApifyPipelinelabs[]> {
    const { data, error } = await supabase
      .from("json_apify_pipelinelabs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Créer un nouveau pipeline
  static async createPipeline(formData: PipelineFormData): Promise<JsonApifyPipelinelabs> {
    // Validation
    this.validateEmailCriteria(formData);
    
    // Convertir les critères en JSON string
    const criteresJson = JSON.stringify(formData.criteres);
    
    // Extraire totalResults pour nombre_de_leads
    const nombreDeLeads = formData.criteres.totalResults || null;
    console.log(`📊 Extraction totalResults: ${nombreDeLeads} leads ciblés`);
    
    // Déterminer l'ID de campagne selon le type
    const idCampagne = formData.campaign_type === "email" 
      ? formData.instantly_campaign_id || ""
      : "";
    
    const { data, error } = await supabase
      .from("json_apify_pipelinelabs")
      .insert({
        nom: formData.nom,
        url: criteresJson,
        consigne: formData.consigne,
        statut: "En attente",
        etape: "Critères enregistrés",
        action: "Lancer la campagne ?",
        type_de_campagne: formData.campaign_type,
        id_campagne: idCampagne,
        nombre_de_leads: nombreDeLeads,
        leads_a_scapper: null, // Initialiser à null
      })
      .select()
      .single();
  
    if (error) throw error;
    return data;
  }

  // Mettre à jour le statut d'un pipeline
  static async updatePipelineStatus(
    id: string,
    statut: "En attente" | "Traitement en cours" | "Terminé"
  ): Promise<void> {
    const { error } = await supabase
      .from("json_apify_pipelinelabs")
      .update({ statut })
      .eq("id", id);

    if (error) throw error;
  }

  // Mettre à jour le statut et l'action d'un pipeline
  static async updatePipelineStatusAndAction(
    id: string,
    updates: Partial<Pick<JsonApifyPipelinelabs, 'statut' | 'action' | 'etape'>>
  ): Promise<void> {
    const { error } = await supabase
      .from("json_apify_pipelinelabs")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
  }

  // Supprimer un pipeline
  static async deletePipeline(id: string): Promise<void> {
    const { error } = await supabase
      .from("json_apify_pipelinelabs")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  // Envoyer le webhook
  static async sendWebhook(pipeline: JsonApifyPipelinelabs): Promise<void> {
    const response = await fetch("/api/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: pipeline.id,
        nom: pipeline.nom,
        url: pipeline.url,
        consigne: pipeline.consigne,
        type_de_campagne: pipeline.type_de_campagne,
        id_campagne: pipeline.id_campagne,
        timestamp: new Date().toISOString(),
        action: "process_pipeline_criteria",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
  }
}