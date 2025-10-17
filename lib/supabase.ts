import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Vérification avec des valeurs par défaut pour éviter les erreurs de prerendering
const url = supabaseUrl || "https://placeholder.supabase.co";
const key = supabaseAnonKey || "placeholder-key";

// Avertissement en développement si les vraies variables manquent
if (typeof window !== "undefined" && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn("⚠️ Variables d'environnement Supabase manquantes");
}

export const supabase = createClient(url, key);
