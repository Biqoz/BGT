"use client";

import { useState, useEffect } from "react";
import PipelineManager from "./components/PipelineManager";
import { LeadsManager } from "./components/LeadsManager";
import AperçuView from "./components/AperçuView";
import { Login } from "./components/Login";
import { AppLayout } from "./components/AppLayout";
import { supabase } from "../lib/supabase";
import type { User, LoginCredentials } from "./types";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<
    "pipelinelabs" | "apercu" | "leads"
  >("pipelinelabs");

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || session.user.email || "",
          });
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de l'utilisateur:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name || session.user.email || "",
        });
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword(
        credentials
      );
      if (error) throw error;

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          name: data.user.user_metadata?.name || data.user.email || "",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const handleNavigation = (view: string) => {
    setActiveView(view as "pipelinelabs" | "apercu" | "leads");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <AppLayout
      activeView={activeView}
      onNavigate={handleNavigation}
      user={user}
      onLogout={handleLogout}
    >
      {activeView === "pipelinelabs" && <PipelineManager />}
      {activeView === "apercu" && <AperçuView />}
      {activeView === "leads" && <LeadsManager />}
    </AppLayout>
  );
}
