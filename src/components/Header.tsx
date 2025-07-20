"use client";
import '../i18n';
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import BuscadorFAQ from "./BuscadorFAQ";

function NavigationLinks({ getLinkClasses, isActiveLink, t }: Readonly<{ getLinkClasses: (href: string, baseClasses: string) => string, isActiveLink: (href: string) => boolean, t: any }>) {
  return (
    <>
      <a 
        href="/" 
        className={getLinkClasses("/", "flex items-center gap-1.5 text-foreground font-medium px-2.5 py-1.5 rounded-md focus-visible:ring-2 focus-visible:ring-primary fade-in transition-all duration-200 hover:bg-muted/50")}
        aria-current={isActiveLink("/") ? "page" : undefined}
      >
        <span className={`nav-icon ${isActiveLink("/") ? "text-primary-foreground" : "text-muted-foreground"}`}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
        <span className="text-sm">{t('header.nav.home')}</span>
      </a>
      <a 
        href="/sobre-nosotros" 
        className={getLinkClasses("/sobre-nosotros", "flex items-center gap-1.5 text-foreground font-medium px-2.5 py-1.5 rounded-md focus-visible:ring-2 focus-visible:ring-primary fade-in transition-all duration-200 hover:bg-muted/50")}
        aria-current={isActiveLink("/sobre-nosotros") ? "page" : undefined}
      >
        <span className={`nav-icon ${isActiveLink("/sobre-nosotros") ? "text-primary-foreground" : "text-muted-foreground"}`}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M5.5 21a6.5 6.5 0 0113 0" stroke="currentColor" strokeWidth="2"/></svg>
        </span>
        <span className="text-sm">{t('header.nav.about')}</span>
      </a>
      <a 
        href="/ayuda" 
        className={getLinkClasses("/ayuda", "flex items-center gap-1.5 text-foreground font-medium px-2.5 py-1.5 rounded-md focus-visible:ring-2 focus-visible:ring-primary fade-in transition-all duration-200 hover:bg-muted/50")}
        aria-current={isActiveLink("/ayuda") ? "page" : undefined}
      >
        <span className={`nav-icon ${isActiveLink("/ayuda") ? "text-primary-foreground" : "text-muted-foreground"}`}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg>
        </span>
        <span className="text-sm">{t('header.nav.help')}</span>
      </a>
      <a 
        href="/contacto" 
        className={getLinkClasses("/contacto", "flex items-center gap-1.5 text-foreground font-medium px-2.5 py-1.5 rounded-md focus-visible:ring-2 focus-visible:ring-primary fade-in transition-all duration-200 hover:bg-muted/50")}
        aria-current={isActiveLink("/contacto") ? "page" : undefined}
      >
        <span className={`nav-icon ${isActiveLink("/contacto") ? "text-primary-foreground" : "text-muted-foreground"}`}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M21 15V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
        <span className="text-sm">{t('header.nav.contact')}</span>
      </a>
    </>
  );
}

function MobileMenu({ menuOpen, setMenuOpen, getLinkClasses, isActiveLink, t }: Readonly<{ menuOpen: boolean, setMenuOpen: (open: boolean) => void, getLinkClasses: (href: string, baseClasses: string) => string, isActiveLink: (href: string) => boolean, t: any }>) {
  if (!menuOpen) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end md:hidden">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" />
      <nav className="relative w-4/5 max-w-xs bg-card shadow-xl border-l border-border rounded-l-lg p-4 animate-fade-in flex flex-col gap-3">
        {/* Botón cerrar menú */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-base text-primary">Menú</span>
          <button className="p-1.5 rounded-full bg-background border border-border" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        {/* Buscador en menú móvil */}
        <div className="w-full mb-3 relative flex items-center group">
          <BuscadorFAQ className="w-full pl-8 text-sm" />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <ul className="flex flex-col gap-2 mt-4">
          <li>
            <a 
              href="/" 
              className={getLinkClasses("/", "flex items-center gap-2 text-foreground font-medium px-3 py-2 rounded-md hover:bg-muted/50 transition-all")}
              aria-current={isActiveLink("/") ? "page" : undefined}
            >
              <span className={`nav-icon ${isActiveLink("/") ? "text-primary-foreground" : "text-muted-foreground"}`}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <span className="text-sm">{t('header.nav.home')}</span>
            </a>
          </li>
          <li>
            <a 
              href="/sobre-nosotros" 
              className={getLinkClasses("/sobre-nosotros", "flex items-center gap-2 text-foreground font-medium px-3 py-2 rounded-md hover:bg-muted/50 transition-all")}
              aria-current={isActiveLink("/sobre-nosotros") ? "page" : undefined}
            >
              <span className={`nav-icon ${isActiveLink("/sobre-nosotros") ? "text-primary-foreground" : "text-muted-foreground"}`}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M5.5 21a6.5 6.5 0 0113 0" stroke="currentColor" strokeWidth="2"/></svg>
              </span>
              <span className="text-sm">{t('header.nav.about')}</span>
            </a>
          </li>
          <li>
            <a 
              href="/ayuda" 
              className={getLinkClasses("/ayuda", "flex items-center gap-2 text-foreground font-medium px-3 py-2 rounded-md hover:bg-muted/50 transition-all")}
              aria-current={isActiveLink("/ayuda") ? "page" : undefined}
            >
              <span className={`nav-icon ${isActiveLink("/ayuda") ? "text-primary-foreground" : "text-muted-foreground"}`}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg>
              </span>
              <span className="text-sm">{t('header.nav.help')}</span>
            </a>
          </li>
          <li>
            <a 
              href="/contacto" 
              className={getLinkClasses("/contacto", "flex items-center gap-2 text-foreground font-medium px-3 py-2 rounded-md hover:bg-muted/50 transition-all")}
              aria-current={isActiveLink("/contacto") ? "page" : undefined}
            >
              <span className={`nav-icon ${isActiveLink("/contacto") ? "text-primary-foreground" : "text-muted-foreground"}`}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M21 15V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <span className="text-sm">{t('header.nav.contact')}</span>
            </a>
          </li>
        </ul>
        {/* Botón login en menú móvil */}
        <div className="mt-6 flex justify-center">
          <a href="/iniciar-sesion" className="px-4 py-2 rounded-md bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium shadow hover:brightness-110 transition-all border border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary text-sm flex items-center gap-2">
            <span>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            {t('header.login', { defaultValue: 'Iniciar sesión' })}
          </a>
        </div>
      </nav>
    </div>
  );
}

export default function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Función para verificar si un enlace está activo
  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  // Función para obtener las clases CSS del enlace activo
  const getLinkClasses = (href: string, baseClasses: string) => {
    const isActive = isActiveLink(href);
    const activeClasses = isActive 
      ? "nav-item-active" 
      : "";
    return `${baseClasses} ${activeClasses}`.trim();
  };

  useEffect(() => {
    setMounted(true);
    // Recuperar idioma guardado en localStorage
    const savedLang = localStorage.getItem('vivesano_lang');
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);
  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <header className="w-full fixed top-0 left-0 z-30 glass border-b border-border shadow-lg backdrop-blur-xl transition-all fade-in">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 gap-4 md:gap-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold tracking-tight text-primary drop-shadow-sm group-hover:text-secondary transition-colors fade-in">{t('header.logo', { defaultValue: 'ViveSano' })}</span>
        </a>
        {/* Menú móvil */}
        <button className="md:hidden p-1.5 rounded-md bg-card/80 border border-border focus:outline-none focus:ring-2 focus:ring-primary" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        {/* Navegación desktop */}
        <div className="hidden md:flex items-center gap-2">
          <NavigationLinks getLinkClasses={getLinkClasses} isActiveLink={isActiveLink} t={t} />
        </div>
        {/* Utilidades y buscador en desktop */}
        <div className="flex items-center gap-2">
          {/* Buscador en desktop */}
          <div className="hidden sm:block relative fade-in group w-32">
            <BuscadorFAQ className="w-full pl-7 text-xs" />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          {/* Selector de idioma */}
          <select
            value={i18n.language}
            onChange={e => {
              i18n.changeLanguage(e.target.value);
              localStorage.setItem('vivesano_lang', e.target.value);
            }}
            className="rounded-md bg-card/80 border border-border px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            aria-label="Idioma"
          >
            <option value="es">🇪🇸</option>
            <option value="en">🇺🇸</option>
          </select>
          {/* Cambio de tema */}
          {mounted && (
            <button
              aria-label={t('header.theme', { defaultValue: 'Cambiar tema' })}
              onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-md bg-card/80 border border-border hover:bg-primary hover:text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {currentTheme === "dark" ? (
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              )}
            </button>
          )}
          {/* Botón login en desktop */}
          <a href="/iniciar-sesion" className="hidden md:flex px-3 py-1.5 rounded-md bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium shadow hover:brightness-110 transition-all border border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary text-xs items-center gap-1.5">
            <span>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <span className="hidden lg:inline">{t('header.login', { defaultValue: 'Iniciar sesión' })}</span>
          </a>
        </div>
      </div>
      {/* Buscador en menú móvil */}
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} getLinkClasses={getLinkClasses} isActiveLink={isActiveLink} t={t} />
    </header>
  );
}
