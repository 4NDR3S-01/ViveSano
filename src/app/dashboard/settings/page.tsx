"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from 'next/navigation';
import { useThemeForce } from "../../../hooks/useThemeForce";
import { supabase } from "../../../supabaseClient";
import '../../../i18n';

// Componente Toggle separado
const Toggle = ({ enabled, onToggle, isDark }: { enabled: boolean; onToggle: () => void; isDark: boolean }) => {
  let bgColor;
  if (enabled) {
    bgColor = 'bg-violet-600';
  } else if (isDark) {
    bgColor = 'bg-slate-600';
  } else {
    bgColor = 'bg-slate-300';
  }
  
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${bgColor}`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

// Componente de carga
const LoadingSkeleton = () => (
  <div className="p-6">
    <div className="animate-pulse">
      <div className="h-8 bg-slate-200 rounded mb-2 w-1/3"></div>
      <div className="h-4 bg-slate-200 rounded mb-8 w-1/2"></div>
      
      <div className="space-y-6">
        <div className="bg-slate-200 rounded-xl h-48"></div>
        <div className="bg-slate-200 rounded-xl h-48"></div>
        <div className="bg-slate-200 rounded-xl h-32"></div>
      </div>
    </div>
  </div>
);

// Sección de Apariencia
const AppearanceSection = ({ isDark, t }: { isDark: boolean; t: any }) => {
  const [selectedTheme, setSelectedTheme] = useState('system');
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const { i18n } = useTranslation();

  useEffect(() => {
    setSelectedLanguage(i18n.language || 'es');
  }, [i18n.language]);

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  };

  const themeOptions = [
    { value: 'light', label: t('settings.theme_light', { defaultValue: 'Claro' }), icon: '☀️' },
    { value: 'dark', label: t('settings.theme_dark', { defaultValue: 'Oscuro' }), icon: '🌙' },
    { value: 'system', label: t('settings.theme_system', { defaultValue: 'Sistema' }), icon: '💻' }
  ];

  const languageOptions = [
    { value: 'es', label: t('settings.language_es', { defaultValue: 'Español' }), flag: '🇪🇸' },
    { value: 'en', label: t('settings.language_en', { defaultValue: 'English' }), flag: '🇺🇸' }
  ];

  return (
    <div
      className="border rounded-xl p-6"
      style={{
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderColor: isDark ? '#475569' : '#e2e8f0',
        color: isDark ? '#f1f5f9' : '#1e293b'
      }}
    >
      <h2 className="text-xl font-semibold mb-6" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
        {t('settings.appearance', { defaultValue: 'Apariencia' })}
      </h2>

      {/* Selector de tema */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3" style={{ color: isDark ? '#cbd5e1' : '#374151' }}>
          {t('settings.theme', { defaultValue: 'Tema' })}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map((option) => {
            let borderClasses;
            if (selectedTheme === option.value) {
              borderClasses = 'border-violet-500 bg-violet-50';
            } else if (isDark) {
              borderClasses = 'border-slate-600 hover:border-slate-500';
            } else {
              borderClasses = 'border-slate-200 hover:border-slate-300';
            }

            let backgroundColor;
            if (selectedTheme === option.value) {
              backgroundColor = isDark ? '#1e1b4b' : '#f3f4f6';
            } else {
              backgroundColor = isDark ? '#374151' : '#ffffff';
            }

            return (
              <button
                key={option.value}
                onClick={() => setSelectedTheme(option.value)}
                className={`p-3 rounded-lg border-2 transition-all ${borderClasses}`}
                style={{ backgroundColor }}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <div className="text-sm font-medium" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
                  {option.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selector de idioma */}
      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: isDark ? '#cbd5e1' : '#374151' }}>
          {t('settings.language', { defaultValue: 'Idioma' })}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {languageOptions.map((option) => {
            let borderClasses;
            if (selectedLanguage === option.value) {
              borderClasses = 'border-violet-500 bg-violet-50';
            } else if (isDark) {
              borderClasses = 'border-slate-600 hover:border-slate-500';
            } else {
              borderClasses = 'border-slate-200 hover:border-slate-300';
            }

            let backgroundColor;
            if (selectedLanguage === option.value) {
              backgroundColor = isDark ? '#1e1b4b' : '#f3f4f6';
            } else {
              backgroundColor = isDark ? '#374151' : '#ffffff';
            }

            return (
              <button
                key={option.value}
                onClick={() => handleLanguageChange(option.value)}
                className={`p-3 rounded-lg border-2 transition-all ${borderClasses}`}
                style={{ backgroundColor }}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">{option.flag}</span>
                  <span className="text-sm font-medium" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
                    {option.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Sección de Notificaciones
const NotificationsSection = ({ isDark, t }: { isDark: boolean; t: any }) => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reminders: true
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div
      className="border rounded-xl p-6"
      style={{
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderColor: isDark ? '#475569' : '#e2e8f0',
        color: isDark ? '#f1f5f9' : '#1e293b'
      }}
    >
      <h2 className="text-xl font-semibold mb-6" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
        {t('settings.notifications', { defaultValue: 'Notificaciones' })}
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
              {t('settings.email_notifications', { defaultValue: 'Notificaciones por correo' })}
            </h3>
            <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              Recibe actualizaciones por email
            </p>
          </div>
          <Toggle enabled={notifications.email} onToggle={() => handleToggle('email')} isDark={isDark} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
              {t('settings.push_notifications', { defaultValue: 'Notificaciones push' })}
            </h3>
            <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              Recibe notificaciones en tu dispositivo
            </p>
          </div>
          <Toggle enabled={notifications.push} onToggle={() => handleToggle('push')} isDark={isDark} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
              {t('settings.reminder_notifications', { defaultValue: 'Recordatorios de hábitos' })}
            </h3>
            <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              Recordatorios para completar tus hábitos
            </p>
          </div>
          <Toggle enabled={notifications.reminders} onToggle={() => handleToggle('reminders')} isDark={isDark} />
        </div>
      </div>
    </div>
  );
};

// Sección de Cuenta
const AccountSection = ({ isDark, t }: { isDark: boolean; t: any }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/iniciar-sesion');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleChangePassword = () => {
    router.push('/olvido-contrasena');
  };

  const handleDeleteAccount = () => {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      console.log('Función de eliminación de cuenta pendiente por implementar');
    }
  };

  return (
    <div
      className="border rounded-xl p-6"
      style={{
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderColor: isDark ? '#475569' : '#e2e8f0',
        color: isDark ? '#f1f5f9' : '#1e293b'
      }}
    >
      <h2 className="text-xl font-semibold mb-6" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
        {t('settings.account', { defaultValue: 'Cuenta' })}
      </h2>

      <div className="space-y-4">
        <button
          onClick={handleChangePassword}
          className="w-full text-left p-3 rounded-lg border transition-colors"
          style={{
            borderColor: isDark ? '#475569' : '#e2e8f0',
            backgroundColor: isDark ? '#374151' : '#f8fafc'
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🔒</span>
            <span className="font-medium" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
              {t('settings.change_password', { defaultValue: 'Cambiar contraseña' })}
            </span>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="w-full text-left p-3 rounded-lg border transition-colors"
          style={{
            borderColor: isDark ? '#475569' : '#e2e8f0',
            backgroundColor: isDark ? '#374151' : '#f8fafc'
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🚪</span>
            <span className="font-medium" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
              {t('settings.logout', { defaultValue: 'Cerrar sesión' })}
            </span>
          </div>
        </button>

        <div className="pt-4 border-t" style={{ borderColor: isDark ? '#475569' : '#e2e8f0' }}>
          <h3 className="text-sm font-medium mb-3 text-red-600">
            {t('settings.danger_zone', { defaultValue: 'Zona de peligro' })}
          </h3>
          <button
            onClick={handleDeleteAccount}
            className="w-full text-left p-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <span className="font-medium text-red-700">
                {t('settings.delete_account', { defaultValue: 'Eliminar cuenta' })}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SettingsPage() {
  const { t } = useTranslation();
  const { isDark } = useThemeForce();
  const [mounted, setMounted] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSaveChanges = () => {
    // Simular guardado
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  if (!mounted) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header de la página */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t('settings.title', { defaultValue: 'Configuración' })}
        </h1>
        <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {t('settings.subtitle', { defaultValue: 'Personaliza tu experiencia en la aplicación' })}
        </p>
      </div>

      {/* Mensaje de guardado */}
      {savedMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
          {t('settings.saved', { defaultValue: 'Cambios guardados' })} ✅
        </div>
      )}

      {/* Secciones de configuración */}
      <div className="space-y-8">
        <AppearanceSection isDark={isDark} t={t} />
        <NotificationsSection isDark={isDark} t={t} />
        <AccountSection isDark={isDark} t={t} />
      </div>

      {/* Botón de guardar cambios */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSaveChanges}
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {t('settings.save', { defaultValue: 'Guardar cambios' })}
        </button>
      </div>
    </div>
  );
}
