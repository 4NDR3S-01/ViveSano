"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import { supabase } from '../../supabaseClient';
import { useTheme } from 'next-themes';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, className = '' }) => {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Forzar el theme correcto independientemente del sistema
    const storedTheme = localStorage.getItem('theme') || 'light';
    const html = document.documentElement;
    
    // Eliminar TODAS las clases de tema y forzar color-scheme a none
    html.classList.remove('dark', 'light');
    html.style.colorScheme = 'none';
    document.body.style.colorScheme = 'none';
    
    // Aplicar el tema almacenado
    if (storedTheme === 'dark') {
      html.classList.add('dark');
      document.body.style.backgroundColor = '#0f172a';
      document.body.style.color = '#f1f5f9';
    } else {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#1e293b';
    }
    
    // Agregar regla CSS para anular sistema
    let existingStyle = document.getElementById('force-theme-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    const style = document.createElement('style');
    style.id = 'force-theme-style';
    style.textContent = `*, *::before, *::after { color-scheme: none !important; }`;
    document.head.appendChild(style);
  }, []);

  // Cerrar menú de idioma cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLanguageMenu) {
        const target = event.target as Element;
        if (!target.closest('.language-selector')) {
          setShowLanguageMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageMenu]);

  const isDark = mounted && resolvedTheme === 'dark';

  // Función para cambiar el tema
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    const html = document.documentElement;
    
    // Cambiar con next-themes
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Forzar cambios inmediatos eliminando influencia del OS
    html.classList.remove('dark', 'light');
    html.style.colorScheme = 'none';
    document.body.style.colorScheme = 'none';
    
    if (newTheme === 'dark') {
      html.classList.add('dark');
      document.body.style.backgroundColor = '#0f172a';
      document.body.style.color = '#f1f5f9';
    } else {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#1e293b';
    }

    // Agregar regla CSS para anular sistema
    let existingStyle = document.getElementById('force-theme-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    const style = document.createElement('style');
    style.id = 'force-theme-style';
    style.textContent = `*, *::before, *::after { color-scheme: none !important; }`;
    document.head.appendChild(style);
  };

  // Función para cambiar idioma
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('vivesano_lang', lang);
    localStorage.setItem('i18nextLng', lang);
    document.documentElement.setAttribute('lang', lang);
    setShowLanguageMenu(false);
  };

  // Elementos de navegación del sidebar
  const navigationItems = [
    {
      key: 'overview',
      label: t('dashboard.nav.overview', { defaultValue: 'Resumen' }),
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      key: 'habits',
      label: t('dashboard.nav.habits', { defaultValue: 'Hábitos' }),
      href: '/dashboard/habits',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      key: 'challenges',
      label: t('dashboard.nav.challenges', { defaultValue: 'Desafíos' }),
      href: '/dashboard/challenges',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      key: 'progress',
      label: t('dashboard.nav.progress', { defaultValue: 'Progreso' }),
      href: '/dashboard/progress',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  // Elementos de configuración
  const settingsItems = [
    {
      key: 'profile',
      label: t('dashboard.nav.profile', { defaultValue: 'Perfil' }),
      href: '/dashboard/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      key: 'settings',
      label: t('dashboard.nav.settings', { defaultValue: 'Configuración' }),
      href: '/dashboard/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const handleLogout = async () => {
    try {
      console.log('Cerrando sesión...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error al cerrar sesión:', error);
        return;
      }
      
      console.log('Sesión cerrada exitosamente, redirigiendo...');
      // Limpiar datos locales
      localStorage.removeItem('vivesano_lang');
      localStorage.removeItem('i18nextLng');
      
      // Redirigir al login
      window.location.href = '/iniciar-sesion';
    } catch (error) {
      console.error('Error inesperado al cerrar sesión:', error);
    }
  };

  const isActiveLink = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const getLinkClasses = (href: string) => {
    const baseClasses = "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative";
    const activeClasses = isDark 
      ? "bg-violet-600/20 text-violet-400 border-l-4 border-violet-600 shadow-lg transform scale-105" 
      : "bg-violet-600/10 text-violet-600 border-l-4 border-violet-600 shadow-lg transform scale-105";
    const inactiveClasses = isDark
      ? "text-slate-300 hover:text-white hover:bg-slate-800/50 hover:transform hover:scale-105"
      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100 hover:transform hover:scale-105";
    
    return `${baseClasses} ${isActiveLink(href) ? activeClasses : inactiveClasses}`;
  };

  if (!mounted) {
    return null; // Evitar hydration mismatch
  }

  return (
    <>
      {/* Overlay para cerrar sidebar en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:sticky lg:top-0
          ${isDark 
            ? 'bg-slate-900 border-r border-slate-700' 
            : 'bg-white border-r border-slate-200'
          }
          shadow-xl overflow-hidden
          ${className}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header del Sidebar */}
          <div className={`flex items-center justify-between p-4 flex-shrink-0 ${isDark ? 'border-b border-slate-700' : 'border-b border-slate-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-violet-600 rounded-xl shadow-lg">
                <span className="text-xl">🏥</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-violet-600">ViveSano</h1>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Dashboard
                </p>
              </div>
            </div>
            
            {/* Botón para cerrar sidebar en móvil */}
            <button
              onClick={onToggle}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
              }`}
              aria-label={t('dashboard.sidebar.toggle', { defaultValue: 'Alternar menú' })}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navegación principal */}
          <div className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
            <nav className="space-y-6" aria-label="Navegación principal">{/* Navegación principal */}
              <div>
                <h2 className={`px-4 text-xs font-semibold uppercase tracking-wide mb-3 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {t('dashboard.nav.main', { defaultValue: 'Principal' })}
                </h2>
                <ul className="space-y-2">
                  {navigationItems.map((item) => (
                    <li key={item.key}>
                      <a
                        href={item.href}
                        className={getLinkClasses(item.href)}
                        aria-current={isActiveLink(item.href) ? 'page' : undefined}
                      >
                        <span className="flex-shrink-0 mr-3">
                          {item.icon}
                        </span>
                        <span className="flex-1 truncate">
                          {item.label}
                        </span>
                        {isActiveLink(item.href) && (
                          <span className="w-2 h-2 bg-violet-600 rounded-full animate-pulse" />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Configuración */}
              <div>
                <h2 className={`px-4 text-xs font-semibold uppercase tracking-wide mb-3 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {t('dashboard.nav.account', { defaultValue: 'Cuenta' })}
                </h2>
                <ul className="space-y-2">
                  {settingsItems.map((item) => (
                    <li key={item.key}>
                      <a
                        href={item.href}
                        className={getLinkClasses(item.href)}
                        aria-current={isActiveLink(item.href) ? 'page' : undefined}
                      >
                        <span className="flex-shrink-0 mr-3">
                          {item.icon}
                        </span>
                        <span className="flex-1 truncate">
                          {item.label}
                        </span>
                        {isActiveLink(item.href) && (
                          <span className="w-2 h-2 bg-violet-600 rounded-full animate-pulse" />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Controles de tema e idioma */}
              <div>
                <h2 className={`px-4 text-xs font-semibold uppercase tracking-wide mb-3 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {t('dashboard.nav.preferences', { defaultValue: 'Preferencias' })}
                </h2>
                
                {/* Toggle de tema */}
                <div className="px-4 mb-3">
                  <button
                    onClick={toggleTheme}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200
                      ${isDark 
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }
                    `}
                    aria-label={t('theme.toggle', { defaultValue: 'Cambiar tema' })}
                  >
                    <div className="flex items-center">
                      {isDark ? (
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                      <span className="text-sm font-medium">
                        {isDark 
                          ? t('theme.dark', { defaultValue: 'Modo Oscuro' })
                          : t('theme.light', { defaultValue: 'Modo Claro' })
                        }
                      </span>
                    </div>
                    <div className={`
                      w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out
                      ${isDark ? 'bg-violet-600' : 'bg-slate-300'}
                    `}>
                      <div className={`
                        w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out
                        ${isDark ? 'transform translate-x-6' : 'transform translate-x-0'}
                      `} />
                    </div>
                  </button>
                </div>

                {/* Selector de idioma */}
                <div className="px-4 relative language-selector">
                  <button
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200
                      ${isDark 
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }
                    `}
                    aria-label={t('language.toggle', { defaultValue: 'Cambiar idioma' })}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      <span className="text-sm font-medium">
                        {i18n.language === 'es' ? 'Español' : 'English'}
                      </span>
                    </div>
                    <svg className={`w-4 h-4 transition-transform duration-200 ${showLanguageMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Menú de idiomas */}
                  {showLanguageMenu && (
                    <div className={`
                      absolute top-full left-4 right-4 mt-2 rounded-lg shadow-lg border z-50
                      ${isDark 
                        ? 'bg-slate-800 border-slate-700' 
                        : 'bg-white border-slate-200'
                      }
                    `}>
                      {(() => {
                        let esButtonClass = '';
                        if (i18n.language === 'es') {
                          esButtonClass = isDark ? 'bg-violet-600/20 text-violet-400' : 'bg-violet-600/10 text-violet-600';
                        } else {
                          esButtonClass = isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100';
                        }
                        return (
                          <button
                            onClick={() => changeLanguage('es')}
                            className={`
                              w-full text-left px-4 py-3 text-sm transition-colors rounded-t-lg
                              ${esButtonClass}
                            `}
                          >
                            🇪🇸 Español
                          </button>
                        );
                      })()}
                      {(() => {
                        let enButtonClass = '';
                        if (i18n.language === 'en') {
                          enButtonClass = isDark ? 'bg-violet-600/20 text-violet-400' : 'bg-violet-600/10 text-violet-600';
                        } else {
                          enButtonClass = isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100';
                        }
                        return (
                          <button
                            onClick={() => changeLanguage('en')}
                            className={`
                              w-full text-left px-4 py-3 text-sm transition-colors rounded-b-lg
                              ${enButtonClass}
                            `}
                          >
                            🇺🇸 English
                          </button>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </div>

          {/* Footer del Sidebar - Logout */}
          <div className={`flex-shrink-0 p-4 border-t ${
            isDark ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg 
                transition-all duration-200 transform hover:scale-105
                ${isDark 
                  ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300 border border-red-400/20 hover:border-red-400/50' 
                  : 'text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200 hover:border-red-300'
                }
              `}
              aria-label={t('dashboard.nav.logout', { defaultValue: 'Cerrar sesión' })}
            >
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="truncate">
                {t('dashboard.nav.logout', { defaultValue: 'Cerrar sesión' })}
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
