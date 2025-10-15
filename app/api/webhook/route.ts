import { NextRequest, NextResponse } from "next/server";

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

    // ✅ Utiliser la variable d'environnement
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("❌ Variable NEXT_PUBLIC_N8N_WEBHOOK_URL non configurée");
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

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("❌ Erreur webhook:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du webhook" },
      { status: 500 }
    );
  }
}
