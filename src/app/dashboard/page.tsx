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
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{t('dashboard.title', { defaultValue: 'Bienvenido al Dashboard' })}</h1>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{t('dashboard.stats', { defaultValue: 'Tu tranqui y yo nervioso' })}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
