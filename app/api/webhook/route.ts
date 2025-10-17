import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ✅ Validation des données
    if (!body.id || !body.nom || !body.url) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    // ✅ Utiliser la variable d'environnement PRIVÉE
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("❌ Variable N8N_WEBHOOK_URL non configurée");
      return NextResponse.json(
        { error: "Configuration webhook manquante" },
        { status: 500 }
      );
    }

    console.log("📦 Webhook vers n8n:", {
      url: webhookUrl,
      id: body.id,
      nom: body.nom,
    });

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000), // 30 secondes timeout
    });

    if (!response.ok) {
      throw new Error(`n8n error: ${response.status}`);
    }

    const data = await response.text();
    console.log("✅ Webhook n8n réussi");

    return NextResponse.json({ success: true, data }, { headers: corsHeaders });
  } catch (error) {
    console.error("❌ Erreur webhook:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du webhook" },
      { status: 500, headers: corsHeaders }
    );
  }
}
