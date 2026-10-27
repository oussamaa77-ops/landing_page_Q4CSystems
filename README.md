# Q4C Systèmes — landing page

Site vitrine de Q4C Systèmes (automatisation des processus comptables, financiers et d'audit) avec un formulaire de demande de démo.

- `artifacts/q4c-systemes` — la page (React + Vite + Tailwind)
- `artifacts/api-server` — l'API Express (`/api/contact/demo`, `/api/healthz`)
- `lib/db` — schéma Postgres (Drizzle), table `demo_requests`
- `lib/api-spec` — contrat OpenAPI ; `lib/api-zod` et `lib/api-client-react` en sont générés

Chaque demande de démo est enregistrée dans Postgres puis envoyée par e-mail via Resend. Si l'un des deux échoue, l'autre suffit pour que la demande ne soit pas perdue.

## Déploiement sur Vercel

1. Importer le dépôt GitHub dans Vercel (Framework : *Other* ; `vercel.json` fournit les commandes d'installation et de build).
2. **Storage → Create Database → Neon (Postgres)** et le connecter au projet : `DATABASE_URL` est ajoutée automatiquement.
3. Ajouter les variables d'environnement de `.env.example` : `RESEND_API_KEY`, `RESEND_FROM`, `Q4C_CONTACT_EMAIL`.
4. Créer la table une fois, depuis un poste avec `DATABASE_URL` pointant vers la base :
   ```sh
   pnpm --filter @workspace/db run push
   ```
5. Déployer.

Le build (`pnpm run build:vercel`) produit `.vercel/output` : la page en fichiers statiques et l'API en une fonction Node.js servie sous `/api`.

## Développement local

Node.js 22 et pnpm sont requis.

```sh
pnpm install
pnpm --filter @workspace/api-server run build && PORT=5000 pnpm --filter @workspace/api-server run start
pnpm --filter @workspace/q4c-systemes run dev   # http://localhost:5173, /api est relayé vers le port 5000
```

Après une modification de `lib/api-spec/openapi.yaml` : `pnpm --filter @workspace/api-spec run codegen`.
