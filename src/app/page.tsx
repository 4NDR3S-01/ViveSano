"use client";
import '../i18n';
import { useTranslation } from "react-i18next";
import { useThemeForce } from "@/hooks/useThemeForce";

export default function Home() {
  const { t } = useTranslation();
  const { isDark } = useThemeForce();

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center fade-in px-2">
      <div className="w-full flex flex-col items-center justify-center">
        <section className={`rounded-xl p-8 w-full max-w-2xl mx-auto text-center mb-8 shadow-lg animate-fade-in border ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg animate-fade-in ${
            isDark ? 'text-violet-400' : 'text-violet-600'
          }`}>
            {t('home.title', { defaultValue: 'ViveSano' })}
          </h1>
          <p className={`text-lg md:text-xl mb-6 animate-fade-in ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {t('home.description', { defaultValue: 'Transforma tus hábitos y mejora tu bienestar con nuestra plataforma intuitiva y moderna.' })}
          </p>
          <div className="flex flex-col gap-2 items-center mb-6 animate-fade-in">
            <div className="w-full flex flex-col items-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold shadow hover:scale-105 transition-transform">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="text-white"><path d="M12 2l2.09 6.26L20 9.27l-5 4.87L16.18 21 12 17.77 7.82 21 9 14.14l-5-4.87 5.91-.91L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
                {t('home.gamification', { defaultValue: '¡Consigue logros y recompensas por tus hábitos saludables!' })}
              </span>
              <span className={`mt-2 text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>{t('home.gamificationDesc', { defaultValue: 'Sube de nivel, gana puntos y desbloquea insignias mientras mejoras tu bienestar.' })}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <a href="/registrarse" className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
              {t('home.cta.register', { defaultValue: 'Comenzar ahora' })}
            </a>
          </div>
        </section>
        <section className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 animate-fade-in">
          <div className={`rounded-xl p-6 hover:scale-105 hover:shadow-xl transition-transform duration-200 flex flex-col items-center border ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}>
            <span className="mb-3 text-violet-600 bg-gradient-to-tr from-violet-600 to-pink-500 rounded-full p-2 shadow-lg">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="text-white"><path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
            <h2 className={`text-xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>{t('home.section1.title', { defaultValue: 'Salud Integral + Gamificación' })}</h2>
            <p className={`text-sm text-center ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>{t('home.section1.desc', { defaultValue: 'Recibe recomendaciones personalizadas y gana puntos por cada hábito saludable que completes.' })}</p>
          </div>
          <div className={`rounded-xl p-6 hover:scale-105 hover:shadow-xl transition-transform duration-200 flex flex-col items-center border ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}>
            <span className="mb-3 text-pink-500 bg-gradient-to-tr from-pink-500 to-violet-600 rounded-full p-2 shadow-lg">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="text-white"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
            <h2 className={`text-xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>{t('home.section2.title', { defaultValue: 'Seguimiento y Logros' })}</h2>
            <p className={`text-sm text-center ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>{t('home.section2.desc', { defaultValue: 'Monitorea tu progreso, desbloquea insignias y sube de nivel mientras mantienes la motivación.' })}</p>
          </div>
          <div className={`rounded-xl p-6 hover:scale-105 hover:shadow-xl transition-transform duration-200 flex flex-col items-center border ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}>
            <span className="mb-3 text-violet-600 bg-gradient-to-tr from-violet-600 to-pink-500 rounded-full p-2 shadow-lg">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="text-white"><path d="M4 17v-7a8 8 0 0116 0v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="17" r="2" fill="currentColor"/></svg>
            </span>
            <h2 className={`text-xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>{t('home.section3.title', { defaultValue: 'Retos Saludables' })}</h2>
            <p className={`text-sm text-center ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>{t('home.section3.desc', { defaultValue: 'Participa en retos individuales enfocados en actividad física, alimentación y bienestar emocional. Los logros y recompensas son personales.' })}</p>
          </div>
        </section>
        <section className="w-full max-w-2xl mx-auto text-center animate-fade-in">
          <h3 className={`text-2xl font-semibold mb-2 drop-shadow-lg ${
            isDark ? 'text-violet-400' : 'text-violet-600'
          }`}>{t('home.cta.title', { defaultValue: '¿Listo para transformar tu vida jugando?' })}</h3>
          <p className={`mb-4 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>{t('home.cta.desc', { defaultValue: 'Únete gratis, crea hábitos positivos y desbloquea recompensas mientras avanzas de nivel.' })}</p>
          <a href="/pages/auth/registrarse" className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
            {t('home.cta.register', { defaultValue: '¡Quiero empezar!' })}
          </a>
        </section>
      </div>
    </main>
  );
}
