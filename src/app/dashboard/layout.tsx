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
      {/* Barra lateral personalizada */}
      <aside className="w-full md:w-64 bg-primary/90 dark:bg-primary/80 text-white flex flex-col items-center py-8 px-4 shadow-2xl fixed md:relative z-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold shadow-lg">
            <span>👤</span>
          </div>
          <span className="font-extrabold text-lg tracking-wide">ViveSano</span>
        </div>
        <nav className="mt-8 flex flex-col gap-6 w-full">
          <a href="/dashboard" className="font-semibold text-white/90 hover:text-white transition-colors">Panel</a>
          <a href="/dashboard/habitos" className="font-semibold text-white/90 hover:text-white transition-colors">Hábitos</a>
          <a href="/dashboard/retos" className="font-semibold text-white/90 hover:text-white transition-colors">Retos</a>
          <a href="/dashboard/perfil" className="font-semibold text-white/90 hover:text-white transition-colors">Perfil</a>
        </nav>
      </aside>
      <main className="flex-1 w-full md:ml-64 px-4 py-8">
        {children}
      </main>
    </div>
  );
}
