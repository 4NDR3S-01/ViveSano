"use client";
import { useState, useEffect} from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../supabaseClient";
import '../../i18n';

export default function IniciarSesion() {
  // Forzar la clase dark y el idioma en <html> según preferencia del usuario
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    const lang = localStorage.getItem('vivesano_lang') || localStorage.getItem('i18nextLng') || 'es';
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    html.setAttribute('lang', lang);
    // Actualiza el idioma en i18next si es diferente
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [i18n]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!email || !password) {
      setError(t('auth.error.required', { defaultValue: 'Todos los campos son obligatorios.' }));
      setLoading(false);
      return;
    }
    // Autenticación real con Supabase
    const { error: supabaseError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (supabaseError) {
      setError(t('auth.error.invalid', { defaultValue: 'Credenciales incorrectas.' }));
    } else {
      setError("");
      // Mantener el idioma seleccionado en la redirección
      const lang = localStorage.getItem('i18nextLng') || 'es';
      window.location.href = `/dashboard?lng=${lang}`;
    }
  };

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-main px-4 py-12">
      <section className="card w-full max-w-lg mx-auto text-center shadow-2xl animate-fade-in backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 border-2 border-primary/50 rounded-3xl p-12 transition-all duration-300 flex flex-col gap-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-8 tracking-tight drop-shadow-lg animate-fade-in">
          {t('auth.title', { defaultValue: 'Iniciar sesión' })}
        </h1>
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('auth.email', { defaultValue: 'Correo electrónico' })}
              className="input-solid focus:ring-2 focus:ring-primary transition-all duration-200 pl-14 text-lg py-4 shadow-xl"
              aria-label={t('auth.email', { defaultValue: 'Correo electrónico' })}
              autoComplete="email"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl select-none pointer-events-none" aria-hidden="true">✉️</span>
            {/* Se aumentó el padding-left del input para separar más el emoji */}
          </div>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t('auth.password', { defaultValue: 'Contraseña' })}
              className="input-solid focus:ring-2 focus:ring-primary transition-all duration-200 pl-14 text-lg py-4 shadow-xl"
              aria-label={t('auth.password', { defaultValue: 'Contraseña' })}
              autoComplete="current-password"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl select-none pointer-events-none" aria-hidden="true">🔒</span>
            {/* Se aumentó el padding-left del input para separar más el emoji */}
          </div>
          {error && <div className="text-red-500 text-base font-semibold mb-2 bg-red-100 rounded-lg py-3 px-5 animate-pulse border-2 border-red-400 shadow-md">{error}</div>}
          <button
            type="submit"
            className="btn bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold py-4 px-10 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-200 disabled:opacity-60 border-2 border-primary text-lg"
            disabled={loading}
          >
            {loading ? t('auth.loading', { defaultValue: 'Ingresando...' }) : t('auth.login', { defaultValue: 'Ingresar' })}
          </button>
        </form>
        <div className="mt-10 flex flex-col gap-4 items-center text-base">
          <a href="/olvido-contrasena" className="text-primary hover:underline font-semibold">
            {t('auth.forgot', { defaultValue: '¿Olvidaste tu contraseña?' })}
          </a>
          <a href="/registrarse" className="text-secondary hover:underline font-semibold">
            {t('auth.register', { defaultValue: '¿No tienes cuenta? Regístrate aquí.' })}
          </a>
        </div>
      </section>
    </main>
  );
}
