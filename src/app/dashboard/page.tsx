"use client";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import '../../i18n';

export default function Dashboard() {
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

  return (
    <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Panel de usuario */}
      <aside className="card col-span-1 bg-white/90 dark:bg-gray-900/90 border-2 border-primary/40 rounded-3xl p-8 shadow-xl flex flex-col items-center gap-6 animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-5xl text-primary font-bold shadow-lg mb-2">
          <span>👤</span>
        </div>
        <h2 className="text-2xl font-extrabold text-primary mb-2">{t('dashboard.user', { defaultValue: 'Tu perfil' })}</h2>
        <p className="text-base text-gray-600 dark:text-gray-300">{t('dashboard.welcome', { defaultValue: '¡Bienvenido/a a ViveSano! Aquí puedes ver tu progreso y logros.' })}</p>
      </aside>
      {/* Panel principal */}
      <section className="card col-span-2 bg-white/95 dark:bg-gray-900/95 border-2 border-primary/30 rounded-3xl p-8 shadow-xl flex flex-col gap-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-6 drop-shadow-lg animate-fade-in">
          {t('dashboard.title', { defaultValue: 'Panel principal' })}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-primary/10 border border-primary rounded-xl p-6 flex flex-col items-center gap-2 shadow-md">
            <span className="text-4xl">🏆</span>
            <h3 className="font-bold text-lg text-primary">{t('dashboard.achievements', { defaultValue: 'Tus logros' })}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{t('dashboard.achievementsDesc', { defaultValue: 'Aquí verás los logros que has desbloqueado.' })}</p>
          </div>
          <div className="card bg-secondary/10 border border-secondary rounded-xl p-6 flex flex-col items-center gap-2 shadow-md">
            <span className="text-4xl">🎯</span>
            <h3 className="font-bold text-lg text-secondary">{t('dashboard.challenges', { defaultValue: 'Retos activos' })}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{t('dashboard.challengesDesc', { defaultValue: 'Participa en retos individuales y mejora tu bienestar.' })}</p>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold text-primary mb-2">{t('dashboard.progress', { defaultValue: 'Tu progreso' })}</h2>
          <div className="w-full h-6 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: '60%' }}></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{t('dashboard.progressDesc', { defaultValue: 'Has completado el 60% de tus hábitos este mes.' })}</p>
        </div>
      </section>
    </section>
  );
}
