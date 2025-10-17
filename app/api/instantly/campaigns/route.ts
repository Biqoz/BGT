import { NextResponse } from 'next/server';

// Headers CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handler pour les requêtes OPTIONS (preflight)
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// Type pour les données de campagne reçues de l'API Instantly.ai
interface InstantlyApiCampaign {
  id: string;
  name: string;
  status: number;
  timestamp_created?: string;
  timestamp_updated?: string;
}

// Type pour la réponse de l'API Instantly.ai
interface InstantlyApiResponse {
  items?: InstantlyApiCampaign[];
  next_starting_after?: string;
}

export async function GET() {
  try {
    // Récupérer la clé API depuis les variables d'environnement
    const apiKey = process.env.INSTANTLY_API_KEY;
    
    if (!apiKey) {
      console.error('Clé API Instantly.ai manquante');
      return NextResponse.json(
        { error: 'Clé API Instantly.ai non configurée' },
        { status: 500 }
      );
    }

    console.log('Tentative de récupération des campagnes Instantly.ai...');

    // Appeler l'API Instantly.ai pour récupérer les campagnes avec des paramètres
    const url = new URL('https://api.instantly.ai/api/v2/campaigns');
    url.searchParams.append('limit', '100'); // Limiter à 100 campagnes
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur API Instantly.ai: ${response.status} - ${errorText}`);
      throw new Error(`Erreur API Instantly.ai: ${response.status} - ${errorText}`);
    }

    const data: InstantlyApiResponse = await response.json();
    console.log('Données reçues de l\'API:', data);

    // Récupérer les campagnes depuis la propriété 'items'
    const campaigns = data.items || [];
    console.log('Campagnes trouvées:', campaigns.length);

    // Transformer les données pour ne garder que ce dont on a besoin
    const transformedCampaigns = campaigns.map((campaign: InstantlyApiCampaign) => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
    }));

    console.log('Campagnes transformées:', transformedCampaigns);

    return NextResponse.json({ campaigns: transformedCampaigns }, { headers: corsHeaders });
  } catch (error) {
    console.error('Erreur lors de la récupération des campagnes Instantly.ai:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des campagnes',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}