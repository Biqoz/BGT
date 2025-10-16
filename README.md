# PipelineLabs Manager 🚀

Une application web moderne de gestion de campagnes de prospection automatisée avec génération de leads intelligente et intégration email.

## 📋 Description

PipelineLabs Manager est une plateforme complète qui automatise le processus de prospection B2B en combinant :

- **Génération de leads** via Apify avec critères de recherche avancés
- **Enrichissement automatique** des données de contact
- **Génération d'ice breakers** personnalisés par IA
- **Intégration email** avec Instantly.ai pour l'envoi de campagnes
- **Suivi en temps réel** des performances et réponses

## ✨ Fonctionnalités principales

### 🎯 PipelineLabs Manager

- Création de campagnes avec critères de recherche personnalisés
- Suivi en temps réel de la génération de leads
- Gestion des statuts et étapes de campagne
- Intégration avec Instantly.ai pour les campagnes email
- Tableau de bord avec statistiques détaillées

### 📊 Aperçu & Analytics

- Vue d'ensemble des performances
- Métriques de conversion en temps réel
- Suivi des taux d'ouverture et de réponse

### 🤖 Human in the Loop

- Qualification manuelle des réponses indéfinies
- Interface de validation des leads
- Gestion des réponses ambiguës

## 🛠️ Stack Technique

- **Frontend**: [Next.js 15](https://nextjs.org/) avec App Router
- **Backend**: [n8n](https://n8n.io/) (orchestration et automatisation)
- **UI**: [Tailwind CSS](https://tailwindcss.com/)
- **Base de données**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentification**: Supabase Auth
- **Intégrations**:
  - Apify (génération de leads)
  - Instantly.ai (campagnes email)
  - La Growth Machine (campagnes linkedin)
  - n8n (workflows automatisés)
- **Langage**: TypeScript

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm, yarn, pnpm ou bun
- Compte Supabase
- Instance n8n (self-hosted ou cloud)
- Clés API Apify et Instantly.ai et La Growth Machine

### Configuration

1. **Cloner le projet**

```bash
git clone <url-du-repo>
cd starter-bgt
```

2. **Installer les dépendances**

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configuration des variables d'environnement**
   Créer un fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
APIFY_API_KEY=your_apify_api_key
INSTANTLY_API_KEY=your_instantly_api_key
```

4. **Configuration Supabase**

- Créer les tables nécessaires (voir `/sql/schema.sql`)
- Configurer les politiques RLS
- Activer l'authentification

### Démarrage

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du projet

```
├── app/
│   ├── api/                 # Routes API
│   ├── components/          # Composants React
│   │   ├── PipelineManager/ # Gestion des campagnes
│   │   ├── LeadsManager/    # Gestion des leads
│   │   └── AperçuView/      # Tableau de bord
│   ├── hooks/               # Hooks personnalisés
│   ├── services/            # Services API
│   └── types/               # Types TypeScript
├── components/ui/           # Composants UI réutilisables
├── lib/                     # Utilitaires et configuration
└── public/                  # Assets statiques
```

## 🔧 Scripts disponibles

- `npm run dev` - Démarrage en mode développement
- `npm run build` - Build de production
- `npm run start` - Démarrage du serveur de production
- `npm run lint` - Vérification du code

## 🌐 Déploiement

### Vercel (Recommandé)

1. Connecter le repo à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Autres plateformes

Compatible avec toutes les plateformes supportant Next.js :

- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :

- Ouvrir une issue sur GitHub
- Consulter la documentation
- Contacter l'équipe de développement

---

**Développé avec ❤️ par l'équipe BGT**
