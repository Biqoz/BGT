import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration des headers pour CORS
  async headers() {
    // En production, utilise VERCEL_URL depuis les variables d'environnement
    // En développement, autorise toutes les origines
    const corsOrigin = process.env.NODE_ENV === "production" 
      ? process.env.VERCEL_URL || "*"
      : "*";

    return [
      {
        // Appliquer ces headers à toutes les routes API
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: corsOrigin,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },
        ],
      },
    ];
  },
  
  // Configuration pour les domaines externes autorisés
  async rewrites() {
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    
    // Seulement ajouter le rewrite si l'URL n8n est configurée
    if (!n8nUrl) {
      return [];
    }

    return [
      // Proxy pour n8n si nécessaire
      {
        source: "/api/n8n/:path*",
        destination: `${n8nUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
