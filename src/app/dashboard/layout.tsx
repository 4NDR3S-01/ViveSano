"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../supabaseClient";
import Sidebar from "../../components/dashboard/Sidebar";
import { useTheme } from "next-themes";
import '../../i18n';

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { i18n, t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const initializeApp = async () => {
      setMounted(true);
      const theme = localStorage.getItem('theme') ?? 'light';
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

      // SIMPLIFICADO: Solo obtener sesión sin redireccionar (el middleware se encarga)
      console.log('Dashboard iniciando - middleware ya verificó autenticación');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Dashboard - Estado de sesión:', { 
          hasSession: !!session, 
          hasUser: !!session?.user, 
          userEmail: session?.user?.email,
          error: !!error 
        });
        
        if (session?.user) {
          console.log('Dashboard: Usuario autenticado -', session.user.email);
          setIsAuthenticated(true);
        } else {
          console.log('Dashboard: No hay sesión - pero middleware debería haber redirigido');
        }
      } catch (error) {
        console.error('Error obteniendo sesión en dashboard:', error);
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    initializeApp();

    // Listener para cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change en dashboard:', event, !!session);
      
      if (event === 'SIGNED_OUT') {
        console.log('Sesión cerrada, redirigiendo a login...');
        if (isMounted) {
          window.location.href = '/iniciar-sesion';
        }
      } else if (event === 'SIGNED_IN' && session) {
        console.log('Sesión iniciada en dashboard');
        if (isMounted) {
          setIsAuthenticated(true);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [i18n]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary text-xl font-bold animate-fade-in">
            {t('dashboard.loading', { defaultValue: 'Cargando...' })}
          </p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (el redirect ya se ejecutó)
  if (!isAuthenticated) {
    return null;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div className={`min-h-screen w-full flex ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header móvil */}
        <header className={`lg:hidden sticky top-0 z-20 ${isDark ? 'bg-gray-900 border-b border-gray-700' : 'bg-white border-b border-gray-200'} shadow-sm`}>
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              aria-label={t('dashboard.sidebar.toggle', { defaultValue: 'Alternar menú lateral' })}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-3">
              <span className="text-xl">🏥</span>
              <h1 className="text-lg font-bold text-primary">ViveSano</h1>
            </div>

            <div className="w-10"></div> {/* Spacer para centrar el título */}
          </div>
        </header>

        {/* Contenido de la página */}
        <main className={`flex-1 overflow-hidden ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
          <div className="h-full overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
