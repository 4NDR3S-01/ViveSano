"use client";
import { useTranslation } from "react-i18next";
import '../i18n';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="w-full bg-gradient-to-r from-background to-accent glass border-t border-border shadow-inner mt-16 fade-in">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8 py-8 px-4 sm:px-8 lg:px-12">
        {/* Sección izquierda: copyright */}
        <span className="text-xs sm:text-sm text-muted-foreground font-medium text-center md:text-left w-full md:w-auto select-none mb-4 md:mb-0 fade-in">
          {t('footer.copyright', { defaultValue: '© 2025 ViveSano. Todos los derechos reservados.' })}
        </span>
        {/* Sección central: enlaces útiles */}
        <div className="flex gap-2 sm:gap-4 flex-wrap justify-center md:justify-center w-full md:w-auto mb-4 md:mb-0 fade-in">
          <a href="/sobre-nosotros" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:scale-105 hover:shadow-lg">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M5.5 21a6.5 6.5 0 0113 0" stroke="currentColor" strokeWidth="2"/></svg>
            {t('footer.about', { defaultValue: 'Sobre nosotros' })}
          </a>
          <a href="/ayuda" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-secondary/10 hover:to-primary/10 hover:scale-105 hover:shadow-lg">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg>
            {t('footer.help', { defaultValue: 'Ayuda' })}
          </a>
          <a href="/contacto" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:scale-105 hover:shadow-lg">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M21 15V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {t('footer.contact', { defaultValue: 'Contacto' })}
          </a>
        </div>
        {/* Sección derecha: iconos sociales */}
        <div className="flex gap-2 sm:gap-4 w-full md:w-auto justify-center md:justify-end fade-in">
          {/* Facebook */}
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="group" aria-label="Facebook">
            <span className="flex items-center justify-center w-10 h-10 rounded-full glass bg-card/80 shadow border border-border group-hover:scale-110 group-hover:brightness-110 group-focus-visible:ring-2 group-focus-visible:ring-primary transition-all duration-200 fade-in">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="drop-shadow">
                <circle cx="12" cy="12" r="12" fill="url(#fbGradient)" />
                <path d="M15.5 8.5h-2V7.5c0-.4.3-.5.5-.5h1.5V5h-2c-1.1 0-2 .9-2 2v1.5H9v2h2V19h2.5v-6.5h1.7l.3-2z" fill="#fff" />
                <defs>
                  <linearGradient id="fbGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1877F3" />
                    <stop offset="1" stopColor="#67e8f9" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </a>
          {/* Instagram */}
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group" aria-label="Instagram">
            <span className="flex items-center justify-center w-10 h-10 rounded-full glass bg-card/80 shadow border border-border group-hover:scale-110 group-hover:brightness-110 group-focus-visible:ring-2 group-focus-visible:ring-pink-400 transition-all duration-200 fade-in">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="drop-shadow">
                <circle cx="12" cy="12" r="12" fill="url(#igGradient)" />
                <rect x="7" y="7" width="10" height="10" rx="3" fill="#fff" />
                <circle cx="12" cy="12" r="3" fill="url(#igInner)" />
                <circle cx="16.2" cy="7.8" r="1" fill="#fbc2eb" />
                <defs>
                  <linearGradient id="igGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fbc2eb" />
                    <stop offset="1" stopColor="#a5b4fc" />
                  </linearGradient>
                  <linearGradient id="igInner" x1="9" y1="9" x2="15" y2="15" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#a5b4fc" />
                    <stop offset="1" stopColor="#fbc2eb" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
