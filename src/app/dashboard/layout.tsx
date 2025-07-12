"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../supabaseClient";
import '../../i18n';

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem('theme') ?? 'light';
    const lang = localStorage.getItem('vivesano_lang') || localStorage.getItem('i18nextLng') || 'es';
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    html.setAttribute('lang', lang);
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
    // Validar usuario autenticado
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        router.replace('/iniciar-sesion');
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-primary text-xl font-bold animate-fade-in">Cargando...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary/10 via-white to-secondary/10 dark:from-gray-900 dark:via-gray-950 dark:to-primary/20 flex flex-col">
      <main className="flex-1 w-full md:ml-64 px-4 py-8">
        {children}
      </main>
    </div>
  );
}
