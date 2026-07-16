# Max & Shany 🍋

Petite app perso : une liste de **Courses** et une liste **À faire**, partagées entre vous deux.
Stack : React (Vite) + Supabase (Postgres).

```
max-shany/
├── supabase_schema.sql     ← à exécuter une fois dans Supabase
├── backend/                ← ancienne API FastAPI, plus utilisée (voir plus bas)
└── frontend/               ← app React
```

Le frontend parle directement à Supabase via `@supabase/supabase-js`. Il n'y a plus
de serveur à lancer ni à héberger.

## 1. Configurer Supabase

1. Va sur [supabase.com/dashboard](https://supabase.com/dashboard) et ouvre ton projet.
2. **Project Settings** (icône engrenage) → **Data API** : copie l'**URL du projet**
   (ressemble à `https://xxxxxxxxxxxx.supabase.co`).
3. **Project Settings** → **API Keys** : copie la clé **publishable**
   (`sb_publishable_…`). Surtout pas la clé **secret** / `service_role` : elle
   contourne les policies RLS et ce dépôt est public.

Ensuite, crée les tables :

1. Menu de gauche → **SQL Editor** → **New query**.
2. Colle le contenu de `supabase_schema.sql` et clique sur **Run**.

## 2. Lancer l'app

```bash
cd frontend
npm install

cp .env.example .env
# remplis VITE_SUPABASE_URL et VITE_SUPABASE_KEY avec les valeurs de l'étape 1

npm run dev
```

L'app s'ouvre sur **http://localhost:5173**. C'est tout — un seul terminal.

## Fonctionnement

- **Loading page** : affiche "Max & Shany" pendant ~1,8s au démarrage.
- **Courses** (à gauche) : ajouter, cocher, supprimer des articles.
- **À faire** (à droite) : ajouter une tâche avec une date d'échéance et une priorité
  (basse / normale / haute), cocher, supprimer.

Toutes les données vivent dans Supabase — partagées entre vous deux dès que la page
est rechargée. Chaque action est écrite en base immédiatement (pas de sync live
automatique pour l'instant).

## Déploiement

Le frontend est déployé sur **Vercel**. Les deux variables `VITE_SUPABASE_URL` et
`VITE_SUPABASE_KEY` se définissent dans **Vercel → Project Settings → Environment
Variables** : elles ne sont volontairement pas committées, parce que ce dépôt est
public et que des bots scannent GitHub à la recherche de clés Supabase.

## Le dossier `backend/`

L'app tournait avant derrière une API FastAPI hébergée sur Render. Chaque route
était un simple passe-plat vers Supabase, et le free tier de Render endort le
service après 15 min d'inactivité : chaque ouverture de l'app coûtait **~42s** de
cold start, plus ~800ms par requête même à chaud. En appelant Supabase directement,
on tombe à **~60ms** et le cold start disparaît par construction.

Le dossier est gardé pour référence mais n'est plus lancé ni déployé. Tu peux le
supprimer sans rien casser.

## Aller plus loin (optionnel)

- **Affichage instantané** : mettre les listes en cache dans `localStorage` pour
  les afficher avant même la réponse réseau, et rafraîchir en arrière-plan.
- **Sync en temps réel** : Supabase propose des "Realtime subscriptions" — les
  changements de l'un apparaîtraient chez l'autre sans recharger.
- **Sécurité** : les policies actuelles sont en `using (true)` — n'importe qui
  connaissant l'URL du projet peut lire et écrire dans les listes. Pour fermer ça :
  Supabase Auth + des policies liées à `auth.uid()`.
