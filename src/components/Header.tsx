"use client";
import '../i18n';
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import BuscadorFAQ from "./BuscadorFAQ";

export default function Header() {

  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5 gap-8 md:gap-12">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-extrabold tracking-tight text-primary drop-shadow-sm group-hover:scale-105 transition-transform fade-in">{t('header.logo', { defaultValue: 'ViveSano' })}</span>
        </a>
        {/* Menú móvil */}
        <button className="md:hidden p-2 rounded-lg bg-card/80 border border-border focus:outline-none focus:ring-2 focus:ring-primary" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        {/* Navegación desktop */}
        <div className="hidden md:flex items-center gap-6">
          <a href="/" className="flex items-center gap-2 text-foreground font-medium px-2 py-1 rounded-lg focus-visible:ring-2 focus-visible:ring-primary fade-in group transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:scale-105 hover:shadow-lg">
            <span className="text-primary transition-transform group-hover:scale-125 group-hover:drop-shadow-lg">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            {t('header.nav.home')}
          </a>
          <a href="/sobre-nosotros" className="flex items-center gap-2 text-foreground font-medium px-2 py-1 rounded-lg focus-visible:ring-2 focus-visible:ring-primary fade-in group transition-all duration-200 hover:bg-gradient-to-r hover:from-secondary/10 hover:to-primary/10 hover:scale-105 hover:shadow-lg">
            <span className="text-secondary transition-transform group-hover:scale-125 group-hover:drop-shadow-lg">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M5.5 21a6.5 6.5 0 0113 0" stroke="currentColor" strokeWidth="2"/></svg>
            </span>
            {t('header.nav.about')}
          </a>
          <a href="/ayuda" className="flex items-center gap-2 text-foreground font-medium px-2 py-1 rounded-lg focus-visible:ring-2 focus-visible:ring-primary fade-in group transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:scale-105 hover:shadow-lg">
            <span className="text-primary transition-transform group-hover:scale-125 group-hover:drop-shadow-lg">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg>
            </span>
            {t('header.nav.help')}
          </a>
          <a href="/contacto" className="flex items-center gap-2 text-foreground font-medium px-2 py-1 rounded-lg focus-visible:ring-2 focus-visible:ring-primary fade-in group transition-all duration-200 hover:bg-gradient-to-r hover:from-secondary/10 hover:to-primary/10 hover:scale-105 hover:shadow-lg">
            <span className="text-secondary transition-transform group-hover:scale-125 group-hover:drop-shadow-lg">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M21 15V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            {t('header.nav.contact')}
          </a>
        </div>
        {/* Utilidades y buscador en desktop */}
        <div className="flex items-center gap-2 flex-wrap md:flex-1">
          {/* Buscador en desktop */}
          <div className="hidden sm:block relative fade-in group w-40">
            <BuscadorFAQ className="w-full pl-8" />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary pointer-events-none transition-transform duration-200 group-focus-within:scale-125">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="drop-shadow">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" className="transition-colors duration-200" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-200" />
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
            className="rounded-lg bg-card/80 border border-border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            aria-label="Idioma"
          >
            <option value="es">🇪🇸 {t('header.lang.es', { defaultValue: 'ES' })}</option>
            <option value="en">🇺🇸 {t('header.lang.en', { defaultValue: 'EN' })}</option>
          </select>
          {/* Cambio de tema */}
          {mounted && (
            <button
              aria-label={t('header.theme', { defaultValue: 'Cambiar tema' })}
              onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-card/80 border border-border hover:bg-primary hover:text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {currentTheme === "dark" ? (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              )}
            </button>
          )}
          {/* Botón login y registro en desktop */}
          <a href="/iniciar-sesion" className="hidden md:flex px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold shadow hover:scale-105 hover:brightness-110 transition-all border border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary text-sm items-center gap-2">
            <span>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            {t('header.login', { defaultValue: 'Iniciar sesión' })}
          </a>
        </div>
      </div>
      {/* Buscador en menú móvil */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex items-start justify-end md:hidden">
          <button className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" />
          <nav className="relative w-4/5 max-w-xs bg-card shadow-xl border-l border-border rounded-l-2xl p-6 animate-fade-in flex flex-col gap-4">
            {/* Botón cerrar menú siempre visible arriba */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg text-primary">Menú</span>
              <button className="p-2 rounded-full bg-background border border-border" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            {/* Buscador mejorado en menú móvil */}
            <div className="w-full mb-4 relative flex items-center group">
              <BuscadorFAQ className="w-full pl-10" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none transition-transform duration-200 group-focus-within:scale-125">
                {/* Icono de buscar moderno y animado */}
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="drop-shadow">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" className="transition-colors duration-200" />
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-200" />
                </svg>
              </span>
            </div>
            <ul className="flex flex-col gap-4 mt-4">
              <li>
                <a href="/" className="flex items-center gap-2 text-foreground font-medium px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-primary transition-all">
                  <span className="text-primary">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  {t('header.nav.home')}
                </a>
              </li>
              <li>
                <a href="/sobre-nosotros" className="flex items-center gap-2 text-foreground font-medium px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-secondary/10 hover:to-primary/10 hover:text-secondary transition-all">
                  <span className="text-secondary">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M5.5 21a6.5 6.5 0 0113 0" stroke="currentColor" strokeWidth="2"/></svg>
                  </span>
                  {t('header.nav.about')}
                </a>
              </li>
              <li>
                <a href="/ayuda" className="flex items-center gap-2 text-foreground font-medium px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-primary transition-all">
                  <span className="text-primary">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg>
                  </span>
                  {t('header.nav.help')}
                </a>
              </li>
              <li>
                <a href="/contacto" className="flex items-center gap-2 text-foreground font-medium px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-secondary/10 hover:to-primary/10 hover:text-secondary transition-all">
                  <span className="text-secondary">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M21 15V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  {t('header.nav.contact')}
                </a>
              </li>
            </ul>
            {/* Botón login y registro en menú móvil */}
            <div className="mt-8 flex flex-col gap-4 justify-center">
              <a href="/iniciar-sesion" className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold shadow hover:scale-105 hover:brightness-110 transition-all border border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary text-base flex items-center gap-2">
                <span>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                {t('header.login', { defaultValue: 'Iniciar sesión' })}
              </a>
              </div>
          </nav>
        </div>
      )}
    </header>
  );
}
