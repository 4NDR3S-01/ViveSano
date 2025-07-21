"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../supabaseClient";
import { useThemeForce } from "@/hooks/useThemeForce";
import '../../i18n';

export default function RestablecerContrasena() {
  const { t, i18n } = useTranslation();
  const { isDark } = useThemeForce();
  
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
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <section className={`w-full max-w-lg mx-auto text-center shadow-2xl animate-fade-in rounded-xl p-12 flex flex-col gap-8 ${
        isDark 
          ? 'bg-slate-800 border border-slate-700' 
          : 'bg-white border border-slate-200'
      }`}>
        <h1 className={`text-4xl md:text-5xl font-extrabold mb-8 tracking-tight drop-shadow-lg animate-fade-in ${
          isDark ? 'text-violet-400' : 'text-violet-600'
        }`}>
          {t('reset.title', { defaultValue: 'Restablecer contraseña' })}
        </h1>
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t('reset.password', { defaultValue: 'Nueva contraseña' })}
              className={`w-full pl-14 py-4 text-lg rounded-xl border-2 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 shadow-xl ${
                isDark 
                  ? 'border-slate-600 bg-slate-700 text-white' 
                  : 'border-slate-200 bg-white text-slate-900'
              }`}
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
              className={`w-full pl-14 py-4 text-lg rounded-xl border-2 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 shadow-xl ${
                isDark 
                  ? 'border-slate-600 bg-slate-700 text-white' 
                  : 'border-slate-200 bg-white text-slate-900'
              }`}
              aria-label={t('reset.confirmPassword', { defaultValue: 'Confirmar nueva contraseña' })}
              autoComplete="new-password"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl select-none pointer-events-none" aria-hidden="true">🔒</span>
          </div>
          {error && (
            <div className={`mt-4 p-4 rounded-lg border ${
              isDark 
                ? 'text-red-400 bg-red-900/30 border-red-800' 
                : 'text-red-500 bg-red-50 border-red-200'
            }`}>
              {error}
            </div>
          )}
          {success && (
            <div className={`mt-4 p-4 rounded-lg border ${
              isDark 
                ? 'text-green-400 bg-green-900/30 border-green-800' 
                : 'text-green-600 bg-green-50 border-green-200'
            }`}>
              {success}
            </div>
          )}
          <button
            type="submit"
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-4 px-8 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-xl disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? t('reset.loading', { defaultValue: 'Restableciendo...' }) : t('reset.cta', { defaultValue: 'Restablecer contraseña' })}
          </button>
        </form>
        <div className={`pt-6 border-t ${
          isDark ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <p className={`mb-4 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>{t('reset.backToLogin', { defaultValue: '¿Recordaste tu contraseña?' })}</p>
          <a href="/iniciar-sesion" className={`font-semibold transition-colors duration-200 inline-flex items-center gap-2 ${
            isDark 
              ? 'text-violet-400 hover:text-violet-300' 
              : 'text-violet-600 hover:text-violet-700'
          }`}>
            ← {t('reset.login', { defaultValue: 'Volver a iniciar sesión' })}
          </a>
        </div>
      </section>
    </main>
  );
}
