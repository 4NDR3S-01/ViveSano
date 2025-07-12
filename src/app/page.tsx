"use client";
import '../i18n';
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center fade-in bg-gradient-main px-2">
      <div className="w-full flex flex-col items-center justify-center">
        <section className="card w-full max-w-2xl mx-auto text-center mb-8 shadow-primary animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight drop-shadow-lg animate-fade-in">
            {t('home.title', { defaultValue: 'ViveSano' })}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 animate-fade-in">
            {t('home.description', { defaultValue: 'Transforma tus hábitos y mejora tu bienestar con nuestra plataforma intuitiva y moderna.' })}
          </p>
          <div className="flex flex-col gap-2 items-center mb-6 animate-fade-in">
            <div className="w-full flex flex-col items-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold shadow hover:scale-105 transition-transform">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 2l2.09 6.26L20 9.27l-5 4.87L16.18 21 12 17.77 7.82 21 9 14.14l-5-4.87 5.91-.91L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
                {t('home.gamification', { defaultValue: '¡Consigue logros y recompensas por tus hábitos saludables!' })}
              </span>
              <span className="mt-2 text-sm text-muted-foreground">{t('home.gamificationDesc', { defaultValue: 'Sube de nivel, gana puntos y desbloquea insignias mientras mejoras tu bienestar.' })}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <a href="/pages/auth/registrarse" className="btn shadow-primary hover:scale-105 hover:shadow-lg transition-transform duration-200 w-full sm:w-auto">
              {t('home.cta.register', { defaultValue: 'Comenzar ahora' })}
            </a>
          </div>
        </section>
        <section className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 animate-fade-in">
          <div className="card flex flex-col items-center p-6 hover:scale-105 hover:shadow-xl transition-transform duration-200 border border-border">
            <span className="mb-3 text-primary bg-gradient-to-tr from-primary to-secondary rounded-full p-2 shadow-lg">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
            <h2 className="text-xl font-bold mb-2">{t('home.section1.title', { defaultValue: 'Salud Integral + Gamificación' })}</h2>
            <p className="text-muted-foreground text-sm text-center">{t('home.section1.desc', { defaultValue: 'Recibe recomendaciones personalizadas y gana puntos por cada hábito saludable que completes.' })}</p>
          </div>
          <div className="card flex flex-col items-center p-6 hover:scale-105 hover:shadow-xl transition-transform duration-200 border border-border">
            <span className="mb-3 text-secondary bg-gradient-to-tr from-secondary to-primary rounded-full p-2 shadow-lg">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
            <h2 className="text-xl font-bold mb-2">{t('home.section2.title', { defaultValue: 'Seguimiento y Logros' })}</h2>
            <p className="text-muted-foreground text-sm text-center">{t('home.section2.desc', { defaultValue: 'Monitorea tu progreso, desbloquea insignias y sube de nivel mientras mantienes la motivación.' })}</p>
          </div>
          <div className="card flex flex-col items-center p-6 hover:scale-105 hover:shadow-xl transition-transform duration-200 border border-border">
            <span className="mb-3 text-primary bg-gradient-to-tr from-primary to-secondary rounded-full p-2 shadow-lg">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path d="M4 17v-7a8 8 0 0116 0v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="17" r="2" fill="currentColor"/></svg>
            </span>
            <h2 className="text-xl font-bold mb-2">{t('home.section3.title', { defaultValue: 'Retos Saludables' })}</h2>
            <p className="text-muted-foreground text-sm text-center">{t('home.section3.desc', { defaultValue: 'Participa en retos individuales enfocados en actividad física, alimentación y bienestar emocional. Los logros y recompensas son personales.' })}</p>
          </div>
        </section>
        <section className="w-full max-w-2xl mx-auto text-center animate-fade-in">
          <h3 className="text-2xl font-semibold text-primary mb-2 drop-shadow-lg">{t('home.cta.title', { defaultValue: '¿Listo para transformar tu vida jugando?' })}</h3>
          <p className="text-muted-foreground mb-4">{t('home.cta.desc', { defaultValue: 'Únete gratis, crea hábitos positivos y desbloquea recompensas mientras avanzas de nivel.' })}</p>
          <a href="/pages/auth/registrarse" className="btn text-lg shadow-primary hover:scale-105 hover:shadow-lg transition-transform duration-200 w-full sm:w-auto">
            {t('home.cta.register', { defaultValue: '¡Quiero empezar!' })}
          </a>
        </section>
      </div>
    </main>
  );
}
