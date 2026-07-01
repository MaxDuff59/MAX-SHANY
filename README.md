# Max & Shany 🍋

Petite app perso : une liste de **Courses** et une liste **À faire**, partagées entre vous deux.
Stack : React (Vite) + FastAPI (Python) + Supabase (Postgres).

```
max-shany/
├── supabase_schema.sql     ← à exécuter une fois dans Supabase
├── backend/                ← API FastAPI
└── frontend/                ← app React
```

## 1. Configurer Supabase

Tu as déjà créé ton projet Supabase. Voici où récupérer les infos nécessaires :

1. Va sur [supabase.com/dashboard](https://supabase.com/dashboard) et ouvre ton projet.
2. Dans le menu de gauche : **Project Settings** (icône engrenage) → **Data API**.
   - Copie l'**URL du projet** (ressemble à `https://xxxxxxxxxxxx.supabase.co`).
3. Toujours dans **Project Settings**, va dans **API Keys**.
   - Copie la clé **`anon` / `public`** (pas la `service_role`, qui ne doit jamais être exposée côté frontend).

Ensuite, crée les tables :

1. Dans le menu de gauche, ouvre **SQL Editor** → **New query**.
2. Colle le contenu du fichier `supabase_schema.sql` (à la racine du projet) et clique sur **Run**.

Cela crée les tables `courses` et `todos`, plus des règles d'accès simples adaptées à un usage à deux.

## 2. Lancer le backend (FastAPI)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate      # Windows : venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# ouvre .env et remplis SUPABASE_URL et SUPABASE_KEY avec les valeurs récupérées à l'étape 1

uvicorn main:app --reload --port 8000
```

L'API tourne sur **http://localhost:8000**. Tu peux tester avec http://localhost:8000/docs (documentation interactive auto-générée).

## 3. Lancer le frontend (React)

Dans un autre terminal :

```bash
cd frontend
npm install

cp .env.example .env
# par défaut VITE_API_URL=http://localhost:8000, à changer seulement si tu déploies ailleurs

npm run dev
```

L'app s'ouvre sur **http://localhost:5173**.

## Fonctionnement

- **Loading page** : affiche "Max & Shany" pendant ~1,8s au démarrage.
- **Courses** (à gauche) : ajouter, cocher, supprimer des articles.
- **À faire** (à droite) : ajouter une tâche avec une date d'échéance et une priorité (basse / normale / haute), cocher, supprimer.

Toutes les données sont stockées dans Supabase — donc partagées en temps réel entre vous deux dès que vous rechargez la page (pas de sync live automatique pour l'instant, mais chaque action est immédiatement enregistrée en base).

## Aller plus loin (optionnel)

- **Sync en temps réel** : Supabase propose des "Realtime subscriptions" — on peut brancher ça pour que les changements de l'un apparaissent instantanément chez l'autre sans recharger.
- **Déploiement** : backend sur Render/Railway/Fly.io, frontend sur Vercel/Netlify. Pense à mettre à jour `FRONTEND_ORIGIN` (backend) et `VITE_API_URL` (frontend) avec les vraies URLs en prod.
- **Sécurité** : la policy Supabase actuelle autorise tout accès via la clé `anon` (pratique pour un projet perso à 2). Si l'app doit un jour être publique, ajoute une vraie authentification (Supabase Auth) et des policies liées à `auth.uid()`.
