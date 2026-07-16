import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;

if (!url || !key) {
  throw new Error(
    "VITE_SUPABASE_URL et VITE_SUPABASE_KEY doivent être définis " +
      "(voir .env.example). En prod : variables d'environnement Vercel."
  );
}

// Pas d'auth sur ce projet : inutile de garder une session en localStorage.
export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});
