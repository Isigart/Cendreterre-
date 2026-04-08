# 🍳 BatchChef — Ton Coach Batch Cooking dans la Poche

> **20 recettes validées par un chef chaque semaine. Moins de 3€ par repas. Ton planning organisé par l'IA. Un coach qui te guide étape par étape.**

> 9€/mois. Deux semaines d'essai gratuit.

## Stack Technique

- **Frontend** — Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend** — Next.js API Routes
- **Base de données** — Upstash Redis (serverless)
- **IA** — Claude API (côté chef uniquement)
- **Auth** — NextAuth.js
- **Paiements** — Stripe
- **Hébergement** — Vercel

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.local

# Remplir les variables dans .env.local :
# - UPSTASH_REDIS_REST_URL
# - UPSTASH_REDIS_REST_TOKEN
# - NEXTAUTH_SECRET
# - STRIPE_SECRET_KEY
# etc.

# Seed les recettes de démo
npm run seed

# Lancer en dev
npm run dev
```

## Structure du projet

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # NextAuth
│   │   ├── recipes/       # Recettes de la semaine
│   │   ├── sessions/      # Sessions batch cooking
│   │   └── stripe/        # Webhooks Stripe
│   ├── connexion/         # Page auth
│   ├── profil/            # Profil utilisateur
│   ├── recettes/          # Sélection des recettes
│   ├── session/           # Session de cuisine guidée
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Landing page
├── components/            # Composants React
│   ├── Header.tsx
│   ├── RecipeCard.tsx
│   ├── RecipeSelector.tsx
│   ├── SessionTimer.tsx
│   ├── StepView.tsx
│   └── PriceBadge.tsx
├── data/
│   └── seed-recipes.ts    # Recettes de démo
└── lib/
    ├── auth.ts            # Config NextAuth
    ├── recipes.ts         # CRUD recettes
    ├── redis.ts           # Client Upstash Redis
    ├── scheduler.ts       # Optimiseur de session batch
    ├── sessions.ts        # Gestion des sessions
    ├── stripe.ts          # Intégration Stripe
    └── types.ts           # Types TypeScript
```

## L'algorithme de session

Le `scheduler.ts` est le cœur du produit. Il prend 5 recettes et produit un enchaînement optimisé :

1. **Tri par temps passif** — les recettes avec le plus de temps d'attente commencent en premier
2. **Parallélisation invisible** — pendant qu'un plat mijote, l'utilisateur prépare le suivant
3. **Sortie linéaire** — l'utilisateur ne voit qu'une tâche à la fois, jamais le planning complet

## Fait avec passion en Dordogne 🇫🇷
