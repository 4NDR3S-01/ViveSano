"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../supabaseClient";
import '../../i18n';

export default function RestablecerContrasena() {
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
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [i18n]);

  // Esta página puede necesitar permitir usuarios autenticados que quieren cambiar contraseña
  // Por lo que no agregamos redirect automático como las otras páginas

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (!password || !confirmPassword) {
      setError(t('reset.error.required', { defaultValue: 'Todos los campos son obligatorios.' }));
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError(t('reset.error.passwordMatch', { defaultValue: 'Las contraseñas no coinciden.' }));
      setLoading(false);
      return;
    }
    // Supabase: restablecer contraseña usando el hash del link
    const { error: supabaseError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (supabaseError) {
      setError(t('reset.error.invalid', { defaultValue: 'No se pudo restablecer la contraseña.' }));
    } else {
      setSuccess(t('reset.success', { defaultValue: '¡Contraseña restablecida con éxito!' }));
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-main px-4 py-12">
      <section className="card w-full max-w-lg mx-auto text-center shadow-2xl animate-fade-in backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 border-2 border-primary/50 rounded-3xl p-12 transition-all duration-300 flex flex-col gap-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-8 tracking-tight drop-shadow-lg animate-fade-in">
          {t('reset.title', { defaultValue: 'Restablecer contraseña' })}
        </h1>
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t('reset.password', { defaultValue: 'Nueva contraseña' })}
              className="input-solid focus:ring-2 focus:ring-primary transition-all duration-200 pl-14 text-lg py-4 shadow-xl"
              aria-label={t('reset.password', { defaultValue: 'Nueva contraseña' })}
              autoComplete="new-password"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl select-none pointer-events-none" aria-hidden="true">🔒</span>
          </div>
          <div className="relative">
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder={t('reset.confirmPassword', { defaultValue: 'Confirmar nueva contraseña' })}
              className="input-solid focus:ring-2 focus:ring-primary transition-all duration-200 pl-14 text-lg py-4 shadow-xl"
              aria-label={t('reset.confirmPassword', { defaultValue: 'Confirmar nueva contraseña' })}
              autoComplete="new-password"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl select-none pointer-events-none" aria-hidden="true">🔒</span>
          </div>
          {error && <div className="text-red-600 font-semibold animate-fade-in">{error}</div>}
          {success && <div className="text-green-600 font-semibold animate-fade-in">{success}</div>}
          <button
            type="submit"
            className="btn bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold py-4 px-10 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-200 disabled:opacity-60 border-2 border-primary text-lg"
            disabled={loading}
          >
            {loading ? t('reset.loading', { defaultValue: 'Restableciendo...' }) : t('reset.cta', { defaultValue: 'Restablecer contraseña' })}
          </button>
        </form>
        <div className="mt-4">
          <a href="/iniciar-sesion" className="text-primary underline font-semibold">
            {t('reset.login', { defaultValue: 'Volver a iniciar sesión' })}
          </a>
        </div>
      </section>
    </main>
  );
}
