"use client";

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export const useThemeForce = () => {
  const { resolvedTheme } = useTheme();
  const [forcedTheme, setForcedTheme] = useState<string>('light');
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    const forceTheme = () => {
      const storedTheme = localStorage.getItem('theme') || 'light';
      setForcedTheme(storedTheme);
      const html = document.documentElement;
      
      // Eliminar TODAS las clases de tema
      html.classList.remove('dark', 'light');
      
      // Forzar color-scheme a none para eliminar influencia del OS
      html.style.colorScheme = 'none';
      document.body.style.colorScheme = 'none';
      
      // Aplicar el tema correcto SOLO con nuestras clases
      if (storedTheme === 'dark') {
        html.classList.add('dark');
        document.body.style.backgroundColor = '#0f172a';
        document.body.style.color = '#f1f5f9';
      } else {
        // No agregar clase 'light', solo remover 'dark'
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#1e293b';
      }

      // Agregar una regla CSS dinámica para anular completamente el sistema
      let existingStyle = document.getElementById('force-theme-style');
      if (existingStyle) {
        existingStyle.remove();
      }

      const style = document.createElement('style');
      style.id = 'force-theme-style';
      style.textContent = `
        *, *::before, *::after {
          color-scheme: none !important;
        }
        html, body {
          color-scheme: none !important;
        }
      `;
      document.head.appendChild(style);
      
      setIsClientReady(true);
    };

    // Ejecutar inmediatamente
    forceTheme();
    
    // También ejecutar después de un pequeño delay para asegurar
    const timer = setTimeout(forceTheme, 50);
    
    return () => {
      clearTimeout(timer);
    };
  }, [resolvedTheme]);

  return { forcedTheme, isDark: forcedTheme === 'dark', isClientReady };
};
