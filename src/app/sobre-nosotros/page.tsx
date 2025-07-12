"use client";
import { useTranslation } from "react-i18next";
import '../../i18n';

export default function SobreNosotros() {
  const { t } = useTranslation();
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center fade-in bg-gradient-main px-2">
      <div className="w-full flex flex-col items-center justify-center">
        <section className="card w-full max-w-2xl mx-auto text-center mb-8 shadow-primary animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight drop-shadow-lg animate-fade-in">
            {t('about.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 animate-fade-in">
            {t('about.mission.desc')}
          </p>
        </section>
        <section className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-fade-in">
          <div className="card flex flex-col items-center p-6 border border-border">
            <span className="mb-3 text-primary">
              {/* Icono misión */}
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 2l2.09 6.26L20 9.27l-5 4.87L16.18 21 12 17.77 7.82 21 9 14.14l-5-4.87 5.91-.91L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
            </span>
            <h2 className="text-xl font-bold mb-2 text-primary">{t('about.mission.title')}</h2>
            <p className="text-muted-foreground text-sm text-center">{t('about.mission.desc')}</p>
          </div>
          <div className="card flex flex-col items-center p-6 border border-border">
            <span className="mb-3 text-secondary">
              {/* Icono visión */}
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
            <h2 className="text-xl font-bold mb-2 text-secondary">{t('about.vision.title')}</h2>
            <p className="text-muted-foreground text-sm text-center">{t('about.vision.desc')}</p>
          </div>
        </section>
        <section className="w-full max-w-4xl mx-auto mb-12 animate-fade-in">
          <h2 className="text-2xl font-semibold text-primary mb-4 drop-shadow-lg">{t('about.values.title', { defaultValue: 'Nuestros valores' })}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="card p-4 flex flex-col items-center border border-border">
              <span className="mb-2 text-primary">
                {/* Icono empatía */}
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 4.01 13.44 5.65C13.97 4.01 15.64 3 17.38 3C20.46 3 22.88 5.42 22.88 8.5C22.88 13.5 15 21 15 21H12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
              </span>
              <h3 className="font-bold text-primary mb-1">{t('about.values.empathy.title')}</h3>
              <p className="text-muted-foreground text-xs text-center">{t('about.values.empathy.desc')}</p>
            </div>
            <div className="card p-4 flex flex-col items-center border border-border">
              <span className="mb-2 text-secondary">
                {/* Icono innovación */}
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
              </span>
              <h3 className="font-bold text-secondary mb-1">{t('about.values.innovation.title')}</h3>
              <p className="text-muted-foreground text-xs text-center">{t('about.values.innovation.desc')}</p>
            </div>
            <div className="card p-4 flex flex-col items-center border border-border">
              <span className="mb-2 text-primary">
                {/* Icono inclusión */}
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M2 20c0-4 8-6 10-6s10 2 10 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
              </span>
              <h3 className="font-bold text-primary mb-1">{t('about.values.inclusion.title')}</h3>
              <p className="text-muted-foreground text-xs text-center">{t('about.values.inclusion.desc')}</p>
            </div>
            <div className="card p-4 flex flex-col items-center border border-border">
              <span className="mb-2 text-secondary">
                {/* Icono crecimiento */}
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 20V10M12 10l-4 4M12 10l4 4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><circle cx="12" cy="6" r="2" stroke="currentColor" strokeWidth="2"/></svg>
              </span>
              <h3 className="font-bold text-secondary mb-1">{t('about.values.growth.title')}</h3>
              <p className="text-muted-foreground text-xs text-center">{t('about.values.growth.desc')}</p>
            </div>
          </div>
        </section>
        <section className="w-full max-w-2xl mx-auto text-center animate-fade-in mb-8">
          <h3 className="text-xl font-semibold text-primary mb-2 drop-shadow-lg">{t('about.commitment.title')}</h3>
          <p className="text-muted-foreground mb-4">{t('about.commitment.desc')}</p>
        </section>
      </div>
    </main>
  );
}
