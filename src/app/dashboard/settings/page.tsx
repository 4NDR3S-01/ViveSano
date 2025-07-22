"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from 'next/navigation';
import { useThemeForce } from "../../../hooks/useThemeForce";
import { supabase } from "../../../supabaseClient";
import { useProfile } from "../../../hooks/useProfile";
import '../../../i18n';

// Tipos para configuración
interface NotificationSettings {
  push: boolean;
  reminders: boolean;
  achievements: boolean;
  weekly_report: boolean;
  habit_streaks: boolean;
}

interface PrivacySettings {
  analytics_tracking: boolean;
}

interface AppearanceSettings {
  theme: 'light' | 'dark';
  language: 'es' | 'en';
}

// Componente Toggle mejorado
const Toggle = ({ 
  enabled, 
  onToggle, 
  isDark, 
  disabled = false,
  ariaLabel,
  ariaDescribedBy
}: { 
  enabled: boolean; 
  onToggle: () => void; 
  isDark: boolean; 
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}) => {
  const getBgColor = () => {
    if (disabled) {
      return isDark ? 'bg-gray-700' : 'bg-gray-300';
    }
    if (enabled) {
      return 'bg-violet-600 hover:bg-violet-700';
    }
    return isDark ? 'bg-slate-600 hover:bg-slate-500' : 'bg-slate-300 hover:bg-slate-400';
  };
  
  return (
    <button
      onClick={disabled ? undefined : onToggle}
      disabled={disabled}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
        isDark ? 'focus:ring-offset-slate-800' : 'focus:ring-offset-white'
      } ${getBgColor()} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      role="switch"
      aria-checked={enabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 shadow-sm ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

// Componente de carga mejorado
const LoadingSkeleton = ({ isDark }: { isDark: boolean }) => (
  <div className="p-6">
    <div className="animate-pulse">
      <div className={`h-8 rounded mb-2 w-1/3 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
      <div className={`h-4 rounded mb-8 w-1/2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
      
      <div className="space-y-6">
        <div className={`rounded-xl h-48 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
        <div className={`rounded-xl h-48 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
        <div className={`rounded-xl h-32 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
      </div>
    </div>
  </div>
);

// Sección de Apariencia mejorada
const AppearanceSection = ({ isDark, t, settings, onSettingsChange }: { 
  isDark: boolean; 
  t: any; 
  settings: AppearanceSettings;
  onSettingsChange: (key: keyof AppearanceSettings, value: any) => void;
}) => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: 'es' | 'en') => {
    onSettingsChange('language', lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('vivesano_lang', lang);
  };

  const languageOptions = [
    { value: 'es', label: t('settings.language_es', { defaultValue: 'Español' }), flag: '🇪🇸' },
    { value: 'en', label: t('settings.language_en', { defaultValue: 'English' }), flag: '🇺🇸' }
  ];

  return (
    <section
      className={`border rounded-xl p-6 ${
        isDark 
          ? 'bg-slate-800 border-slate-700 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}
      aria-labelledby="appearance-heading"
    >
      <h2 id="appearance-heading" className={`text-xl font-semibold mb-6 ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}>
        {t('settings.appearance', { defaultValue: 'Apariencia' })}
      </h2>

      <div className="space-y-6">
        {/* Selector de idioma */}
        <div>
          <label className={`block text-sm font-medium mb-3 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            {t('settings.language', { defaultValue: 'Idioma' })}
          </label>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label={t('settings.language', { defaultValue: 'Idioma' })}>
            {languageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleLanguageChange(option.value as 'es' | 'en')}
                className={`p-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  settings.language === option.value
                    ? (isDark 
                        ? 'border-violet-400 bg-violet-900/30' 
                        : 'border-violet-500 bg-violet-50')
                    : (isDark 
                        ? 'border-slate-600 hover:border-slate-500 bg-slate-700' 
                        : 'border-slate-200 hover:border-slate-300 bg-white')
                }`}
                role="radio"
                aria-checked={settings.language === option.value}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">{option.flag}</span>
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Sección de Notificaciones mejorada
const NotificationsSection = ({ 
  isDark, 
  t, 
  settings, 
  onSettingsChange 
}: { 
  isDark: boolean; 
  t: any; 
  settings: NotificationSettings;
  onSettingsChange: (key: keyof NotificationSettings, value: boolean) => void;
}) => {
  const notificationItems = [
    {
      key: 'push' as keyof NotificationSettings,
      title: t('settings.push_notifications', { defaultValue: 'Notificaciones push' }),
      description: t('settings.push_notifications_desc', { defaultValue: 'Recibe notificaciones en tiempo real en tu dispositivo' }),
      icon: '🔔'
    },
    {
      key: 'reminders' as keyof NotificationSettings,
      title: t('settings.habit_reminders', { defaultValue: 'Recordatorios de hábitos' }),
      description: t('settings.habit_reminders_desc', { defaultValue: 'Recordatorios para completar tus hábitos diarios' }),
      icon: '⏰'
    },
    {
      key: 'achievements' as keyof NotificationSettings,
      title: t('settings.achievement_notifications', { defaultValue: 'Logros y medallas' }),
      description: t('settings.achievement_notifications_desc', { defaultValue: 'Notificaciones cuando alcances nuevos logros' }),
      icon: '🏆'
    },
    {
      key: 'weekly_report' as keyof NotificationSettings,
      title: t('settings.weekly_report', { defaultValue: 'Reporte semanal' }),
      description: t('settings.weekly_report_desc', { defaultValue: 'Resumen semanal de tu progreso' }),
      icon: '📊'
    },
    {
      key: 'habit_streaks' as keyof NotificationSettings,
      title: t('settings.streak_notifications', { defaultValue: 'Rachas de hábitos' }),
      description: t('settings.streak_notifications_desc', { defaultValue: 'Celebra tus rachas y mantén la motivación' }),
      icon: '🔥'
    }
  ];

  return (
    <section
      className={`border rounded-xl p-6 ${
        isDark 
          ? 'bg-slate-800 border-slate-700 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}
      aria-labelledby="notifications-heading"
    >
      <h2 id="notifications-heading" className={`text-xl font-semibold mb-6 ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}>
        {t('settings.notifications', { defaultValue: 'Notificaciones' })}
      </h2>

      <div className="space-y-4">
        {notificationItems.map((item) => (
          <div key={item.key} className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <span className="text-xl mt-1">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {item.title}
                </h3>
                <p className={`text-sm mt-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {item.description}
                </p>
              </div>
            </div>
            <Toggle 
              enabled={settings[item.key]} 
              onToggle={() => onSettingsChange(item.key, !settings[item.key])} 
              isDark={isDark}
              ariaLabel={`${item.title} ${settings[item.key] ? 'activado' : 'desactivado'}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

// Sección de Privacidad nueva
const PrivacySection = ({ 
  isDark, 
  t, 
  settings, 
  onSettingsChange 
}: { 
  isDark: boolean; 
  t: any; 
  settings: PrivacySettings;
  onSettingsChange: (key: keyof PrivacySettings, value: boolean) => void;
}) => {
  const privacyItems = [
    {
      key: 'analytics_tracking' as keyof PrivacySettings,
      title: t('settings.analytics_tracking', { defaultValue: 'Análisis y mejoras' }),
      description: t('settings.analytics_tracking_desc', { defaultValue: 'Ayúdanos a mejorar la app compartiendo datos de uso anónimos' }),
      icon: '📈'
    }
  ];

  return (
    <section
      className={`border rounded-xl p-6 ${
        isDark 
          ? 'bg-slate-800 border-slate-700 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}
      aria-labelledby="privacy-heading"
    >
      <h2 id="privacy-heading" className={`text-xl font-semibold mb-6 ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}>
        {t('settings.privacy', { defaultValue: 'Privacidad' })}
      </h2>

      <div className="space-y-4">
        {privacyItems.map((item) => (
          <div key={item.key} className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <span className="text-xl mt-1">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {item.title}
                </h3>
                <p className={`text-sm mt-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {item.description}
                </p>
              </div>
            </div>
            <Toggle 
              enabled={settings[item.key]} 
              onToggle={() => onSettingsChange(item.key, !settings[item.key])} 
              isDark={isDark}
              ariaLabel={`${item.title} ${settings[item.key] ? 'activado' : 'desactivado'}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

// Sección de Cuenta mejorada
const AccountSection = ({ 
  isDark, 
  t,
  onChangePassword,
  onExportData
}: { 
  isDark: boolean; 
  t: any;
  onChangePassword: () => void;
  onExportData: () => void;
}) => {
  const router = useRouter();
  const { profile, isLoading } = useProfile();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/iniciar-sesion');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setDeleteLoading(true);
    try {
      // Aquí implementarías la lógica de eliminación de cuenta
      console.log('Eliminando cuenta...');
      // Por ahora solo mostramos un mensaje
      alert(t('settings.delete_account_pending', { defaultValue: 'Funcionalidad de eliminación de cuenta en desarrollo.' }));
    } catch (error) {
      console.error('Error eliminando cuenta:', error);
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const accountActions = [
    {
      key: 'profile',
      title: t('settings.edit_profile', { defaultValue: 'Editar perfil' }),
      description: t('settings.edit_profile_desc', { defaultValue: 'Actualiza tu información personal' }),
      icon: '👤',
      action: () => router.push('/dashboard/profile'),
      type: 'normal' as const
    },
    {
      key: 'password',
      title: t('settings.change_password', { defaultValue: 'Cambiar contraseña' }),
      description: t('settings.change_password_desc', { defaultValue: 'Actualiza tu contraseña de acceso' }),
      icon: '🔒',
      action: onChangePassword,
      type: 'normal' as const
    },
    {
      key: 'export',
      title: t('settings.export_data', { defaultValue: 'Exportar datos' }),
      description: t('settings.export_data_desc', { defaultValue: 'Descarga una copia de tus datos' }),
      icon: '📥',
      action: onExportData,
      type: 'normal' as const
    },
    {
      key: 'logout',
      title: t('settings.logout', { defaultValue: 'Cerrar sesión' }),
      description: t('settings.logout_desc', { defaultValue: 'Cierra tu sesión actual' }),
      icon: '🚪',
      action: handleLogout,
      type: 'normal' as const
    }
  ];

  return (
    <section
      className={`border rounded-xl p-6 ${
        isDark 
          ? 'bg-slate-800 border-slate-700 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}
      aria-labelledby="account-heading"
    >
      <h2 id="account-heading" className={`text-xl font-semibold mb-6 ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}>
        {t('settings.account', { defaultValue: 'Cuenta' })}
      </h2>

      {/* Información de la cuenta */}
      {profile && !isLoading && (
        <div className={`mb-6 p-4 rounded-lg ${
          isDark ? 'bg-slate-700' : 'bg-slate-50'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">👤</span>
            <div>
              <p className={`font-medium ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {profile.first_name} {profile.last_name}
              </p>
              <p className={`text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {profile.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Acciones de cuenta */}
      <div className="space-y-3 mb-6">
        {accountActions.map((action) => (
          <button
            key={action.key}
            onClick={action.action}
            className={`w-full text-left p-3 rounded-lg border transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-violet-500 ${
              isDark 
                ? 'border-slate-600 bg-slate-700 hover:bg-slate-600' 
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{action.icon}</span>
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {action.title}
                </div>
                <div className={`text-sm ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {action.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Zona de peligro */}
      <div className={`pt-4 border-t ${
        isDark ? 'border-slate-600' : 'border-slate-200'
      }`}>
        <h3 className="text-sm font-medium mb-3 text-red-500">
          {t('settings.danger_zone', { defaultValue: 'Zona de peligro' })}
        </h3>
        
        {!showDeleteConfirm ? (
          <button
            onClick={handleDeleteAccount}
            className={`w-full text-left p-3 rounded-lg border border-red-200 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 ${
              isDark 
                ? 'bg-red-900/20 hover:bg-red-900/30' 
                : 'bg-red-50 hover:bg-red-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-red-600">
                  {t('settings.delete_account', { defaultValue: 'Eliminar cuenta' })}
                </div>
                <div className={`text-sm ${
                  isDark ? 'text-red-400' : 'text-red-500'
                }`}>
                  {t('settings.delete_account_desc', { defaultValue: 'Esta acción no se puede deshacer' })}
                </div>
              </div>
            </div>
          </button>
        ) : (
          <div className={`p-4 rounded-lg border-2 border-red-500 ${
            isDark ? 'bg-red-900/20' : 'bg-red-50'
          }`}>
            <p className="text-red-600 font-medium mb-4">
              {t('settings.delete_confirm', { defaultValue: '¿Estás completamente seguro? Esta acción eliminará permanentemente tu cuenta y todos tus datos.' })}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className={`px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
              >
                {deleteLoading 
                  ? t('settings.deleting', { defaultValue: 'Eliminando...' })
                  : t('settings.delete_confirm_button', { defaultValue: 'Sí, eliminar cuenta' })
                }
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                className={`px-4 py-2 border rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                  isDark 
                    ? 'border-slate-600 text-white hover:bg-slate-700' 
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t('settings.cancel', { defaultValue: 'Cancelar' })}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Componente principal
export default function SettingsPage() {
  const { t } = useTranslation();
  const { isDark } = useThemeForce();
  const [mounted, setMounted] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estados para cambio de contraseña
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Estados de configuración
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    theme: 'light',
    language: 'es'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    push: false,
    reminders: true,
    achievements: true,
    weekly_report: true,
    habit_streaks: true
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    analytics_tracking: true
  });

  useEffect(() => {
    setMounted(true);
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      // Cargar configuración desde localStorage y base de datos
      const rawTheme = localStorage.getItem('theme') || 'light';
      const savedLang = localStorage.getItem('vivesano_lang') as 'es' | 'en' || 'es';
      
      // Asegurar que el tema sea solo 'light' o 'dark'
      const savedTheme: 'light' | 'dark' = (rawTheme === 'dark') ? 'dark' : 'light';
      
      setAppearanceSettings(prev => ({
        ...prev,
        theme: savedTheme,
        language: savedLang
      }));

      // Aplicar el tema al cargar
      const html = document.documentElement;
      if (savedTheme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }

      // Aquí podrías cargar más configuraciones desde la base de datos
      // const { data } = await supabase.from('user_settings').select('*').single();
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const handleAppearanceChange = (key: keyof AppearanceSettings, value: any) => {
    setAppearanceSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: boolean) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
    setPasswordError('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Todos los campos son obligatorios');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    setPasswordLoading(true);
    setPasswordError('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setShowPasswordModal(false);
      setSavedMessage('Contraseña actualizada exitosamente');
      setTimeout(() => setSavedMessage(''), 5000);
      
      // Limpiar formulario
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setPasswordError('Error al cambiar la contraseña. Verifica tu contraseña actual.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      setSavedMessage('Preparando exportación...');
      
      // Obtener datos del usuario desde Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setSavedMessage('Error: Usuario no autenticado');
        return;
      }

      // Obtener datos adicionales del perfil si existen
      let profileData = null;
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        profileData = profile;
      } catch (profileError) {
        // Los datos de perfil son opcionales, continuar sin ellos
        console.log('No se encontraron datos de perfil adicionales:', profileError);
      }

      // Recopilar todos los datos del usuario
      const userData = {
        account: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          phone: user.phone || null,
          email_confirmed_at: user.email_confirmed_at
        },
        profile: profileData,
        settings: {
          appearance: {
            ...appearanceSettings,
            note: "Configuración de apariencia y presentación"
          },
          notifications: {
            ...notificationSettings,
            note: "Preferencias de notificaciones"
          },
          privacy: {
            ...privacySettings,
            note: "Configuración de privacidad"
          }
        },
        export_metadata: {
          exported_at: new Date().toISOString(),
          export_date: new Date().toLocaleDateString('es-ES'),
          format_version: '1.0',
          app_name: 'ViveSano',
          app_version: '1.0.0',
          data_types: ['account', 'profile', 'settings'],
          note: "Este archivo contiene todos tus datos personales de ViveSano. Guárdalo en un lugar seguro."
        }
        // Aquí podrías agregar más datos si los tienes disponibles
        // habits: await obtenerHabitos(user.id),
        // progress: await obtenerProgreso(user.id),
        // achievements: await obtenerLogros(user.id),
        // statistics: await obtenerEstadisticas(user.id)
      };


      // Convertir a JSON con formato legible
      const jsonData = JSON.stringify(userData, null, 2);
      
      // Crear archivo para descargar
      const blob = new Blob([jsonData], { 
        type: 'application/json;charset=utf-8' 
      });
      const url = URL.createObjectURL(blob);
      
      // Crear nombre de archivo con fecha
      const fechaExport = new Date().toISOString().split('T')[0];
      const horaExport = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
      const nombreArchivo = `vivesano-datos-${fechaExport}_${horaExport}.json`;
      
      // Crear enlace de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = nombreArchivo;
      link.style.display = 'none';
      
      // Simular click para descargar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar URL
      URL.revokeObjectURL(url);
      
      setSavedMessage(`Datos exportados exitosamente como: ${nombreArchivo}`);
      setTimeout(() => setSavedMessage(''), 8000);
      
    } catch (error) {
      console.error('Error al exportar datos:', error);
      setSavedMessage('Error al exportar datos. Intenta nuevamente.');
      setTimeout(() => setSavedMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // Aquí guardarías la configuración en la base de datos
      // await supabase.from('user_settings').upsert({
      //   user_id: user.id,
      //   appearance_settings: appearanceSettings,
      //   notification_settings: notificationSettings,
      //   privacy_settings: privacySettings
      // });

      setSavedMessage(t('settings.saved_success', { defaultValue: 'Configuración guardada exitosamente' }));
      setTimeout(() => setSavedMessage(''), 5000);
    } catch (error) {
      console.error('Error guardando configuración:', error);
      setSavedMessage(t('settings.save_error', { defaultValue: 'Error al guardar la configuración' }));
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <LoadingSkeleton isDark={isDark} />;
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      {/* Header de la página */}
      <header className="mb-8">
        <h1 className={`text-3xl font-bold ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          {t('settings.title', { defaultValue: 'Configuración' })}
        </h1>
        <p className={`mt-2 text-sm ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          {t('settings.subtitle', { defaultValue: 'Personaliza tu experiencia en ViveSano según tus preferencias' })}
        </p>
      </header>

      {/* Mensaje de estado */}
      {savedMessage && (
        <div 
          className={`mb-6 p-4 rounded-lg border animate-fade-in ${
            savedMessage.includes('Error') || savedMessage.includes('error')
              ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
              : 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
          }`}
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {savedMessage.includes('Error') || savedMessage.includes('error') ? '❌' : '✅'}
            </span>
            <span className="font-medium">{savedMessage}</span>
          </div>
        </div>
      )}

      {/* Secciones de configuración */}
      <div className="space-y-8">
        <AppearanceSection 
          isDark={isDark} 
          t={t} 
          settings={appearanceSettings}
          onSettingsChange={handleAppearanceChange}
        />
        
        <NotificationsSection 
          isDark={isDark} 
          t={t} 
          settings={notificationSettings}
          onSettingsChange={handleNotificationChange}
        />
        
        <PrivacySection 
          isDark={isDark} 
          t={t} 
          settings={privacySettings}
          onSettingsChange={handlePrivacyChange}
        />
        
        <AccountSection 
          isDark={isDark} 
          t={t} 
          onChangePassword={handleChangePassword}
          onExportData={handleExportData}
        />
      </div>

      {/* Botón de guardar cambios */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
        <button
          onClick={() => loadUserSettings()}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            isDark 
              ? 'border border-slate-600 text-white hover:bg-slate-700' 
              : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
          }`}
        >
          {t('settings.reset', { defaultValue: 'Restablecer' })}
        </button>
        
        <button
          onClick={handleSaveChanges}
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white px-6 py-3 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {loading 
            ? t('settings.saving', { defaultValue: 'Guardando...' })
            : t('settings.save', { defaultValue: 'Guardar cambios' })
          }
        </button>
      </div>

      {/* Modal de cambio de contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full mx-4 rounded-xl shadow-xl ${
            isDark ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {t('settings.change_password', { defaultValue: 'Cambiar contraseña' })}
                </h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className={`p-2 rounded-full hover:bg-opacity-10 hover:bg-slate-500 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label 
                    htmlFor="current-password"
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    Contraseña actual
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      isDark 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label 
                    htmlFor="new-password"
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    Nueva contraseña
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      isDark 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="confirm-password"
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    Confirmar nueva contraseña
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      isDark 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                    required
                    minLength={6}
                  />
                </div>

                {passwordError && (
                  <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                    {passwordError}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className={`flex-1 px-4 py-2 border rounded-lg font-medium transition-all ${
                      isDark
                        ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className={`flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {passwordLoading ? 'Cambiando...' : 'Cambiar contraseña'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
