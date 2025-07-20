"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../supabaseClient";
import '../../i18n';

export default function OlvidoContrasena() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const theme = localStorage.getItem('theme') || 'light';
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
  }, [i18n]);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Verificación automática de sesión existente para usuarios ya logueados
  useEffect(() => {
    const checkExistingSession = async () => {
      if (!mounted || loading) return;
      
      console.log('Verificando sesión existente en página de olvido contraseña...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Sesión existente en olvido contraseña:', { 
          hasSession: !!session, 
          hasUser: !!session?.user, 
          userEmail: session?.user?.email 
        });
        
        if (session?.user && !error) {
          console.log('Usuario ya logueado, redirigiendo al dashboard...');
          window.location.href = '/dashboard';
        }
      } catch (error) {
        console.error('Error verificando sesión existente:', error);
      }
    };

    if (mounted) {
      const timeoutId = setTimeout(checkExistingSession, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [mounted, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (!email) {
      setError(t('forgot.error.required', { defaultValue: 'El correo es obligatorio.' }));
      setLoading(false);
      return;
    }
    const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (supabaseError) {
      setError(t('forgot.error.invalid', { defaultValue: 'No se pudo enviar el correo de recuperación.' }));
    } else {
      setSuccess(t('forgot.success', { defaultValue: '¡Correo de recuperación enviado! Revisa tu bandeja de entrada.' }));
      setEmail("");
    }
  };

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-main px-4 py-12">
      <section className="card w-full max-w-lg mx-auto text-center shadow-2xl animate-fade-in backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 border-2 border-primary/50 rounded-3xl p-12 transition-all duration-300 flex flex-col gap-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-8 tracking-tight drop-shadow-lg animate-fade-in">
          {t('forgot.title', { defaultValue: 'Recuperar contraseña' })}
        </h1>
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('forgot.email', { defaultValue: 'Correo electrónico' })}
              className="input-solid focus:ring-2 focus:ring-primary transition-all duration-200 pl-14 text-lg py-4 shadow-xl"
              aria-label={t('forgot.email', { defaultValue: 'Correo electrónico' })}
              autoComplete="email"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl select-none pointer-events-none" aria-hidden="true">✉️</span>
          </div>
          {error && <div className="text-red-600 font-semibold animate-fade-in">{error}</div>}
          {success && <div className="text-green-600 font-semibold animate-fade-in">{success}</div>}
          <button
            type="submit"
            className="btn bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold py-4 px-10 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-200 disabled:opacity-60 border-2 border-primary text-lg"
            disabled={loading}
          >
            {loading ? t('forgot.loading', { defaultValue: 'Enviando...' }) : t('forgot.cta', { defaultValue: 'Enviar correo' })}
          </button>
        </form>
        <div className="mt-4">
          <a href="/iniciar-sesion" className="text-primary underline font-semibold">
            {t('forgot.login', { defaultValue: 'Volver a iniciar sesión' })}
          </a>
        </div>
      </section>
    </main>
  );
}
