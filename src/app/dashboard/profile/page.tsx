"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useThemeForce } from "../../../hooks/useThemeForce";
import { useProfile } from "../../../hooks/useProfile";
import '../../../i18n';

// Interfaces ya definidas en el hook useProfile
// No es necesario redefinirlas aquí

// Componente de carga
const LoadingSkeleton = () => (
  <div className="p-6">
    <div className="animate-pulse">
      <div className="h-8 bg-slate-200 rounded mb-2 w-1/3"></div>
      <div className="h-4 bg-slate-200 rounded mb-8 w-1/2"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-slate-200 rounded-xl h-64"></div>
        </div>
        <div>
          <div className="bg-slate-200 rounded-xl h-64"></div>
        </div>
      </div>
    </div>
  </div>
);

// Componente de información del perfil
const ProfileInfo = ({ profile, isDark, t, onEdit }: {
  profile: any; // Usamos any por simplicidad, el tipo real viene del hook
  isDark: boolean;
  t: any;
  onEdit: () => void;
}) => (
  <div
    className="border rounded-xl p-6"
    style={{
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderColor: isDark ? '#475569' : '#e2e8f0',
      color: isDark ? '#f1f5f9' : '#1e293b'
    }}
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
          {t('profile.personal_info', { defaultValue: 'Información Personal' })}
        </h2>
        {/* Indicador de completitud del perfil */}
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          profile?.full_name && profile?.bio ? 
            'bg-green-100 text-green-800' : 
            'bg-yellow-100 text-yellow-800'
        }`}>
          {profile?.full_name && profile?.bio ? 
            t('profile.complete', { defaultValue: 'Completo' }) : 
            t('profile.incomplete', { defaultValue: 'Incompleto' })
          }
        </div>
      </div>
      <button
        onClick={onEdit}
        className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        {t('profile.edit', { defaultValue: 'Editar Perfil' })}
      </button>
    </div>

    <div className="flex items-center gap-4 mb-6">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
        {profile?.first_name ? 
          `${profile.first_name.charAt(0).toUpperCase()}${profile.last_name ? profile.last_name.charAt(0).toUpperCase() : ''}` : 
          profile?.email ? 
            profile.email.charAt(0).toUpperCase() : 
            '?'
        }
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
          {profile?.first_name && profile?.last_name ? 
            `${profile.first_name} ${profile.last_name}` : 
            profile?.first_name || 
            profile?.email?.split('@')[0] || 
            t('profile.anonymous_user', { defaultValue: 'Usuario Anónimo' })
          }
        </h3>
        <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
          {profile?.email || t('profile.no_email', { defaultValue: 'Sin email' })}
        </p>
        {profile?.bio && (
          <p className="text-sm mt-1" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            {profile.bio}
          </p>
        )}
      </div>
    </div>

    <div className="space-y-6">
      {/* Información básica */}
      <div>
        <h4 className="text-sm font-semibold mb-3" style={{ color: isDark ? '#e2e8f0' : '#374151' }}>
          {t('profile.basic_info', { defaultValue: 'Información Básica' })}
        </h4>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
              {t('profile.first_name', { defaultValue: 'Nombre' })}
            </label>
            <p className="mt-1" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
              {profile?.first_name || t('profile.not_specified', { defaultValue: 'No especificado' })}
            </p>
          </div>

          <div>
            <label className="text-xs font-medium" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
              {t('profile.last_name', { defaultValue: 'Apellido' })}
            </label>
            <p className="mt-1" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
              {profile?.last_name || t('profile.not_specified', { defaultValue: 'No especificado' })}
            </p>
          </div>
          
          <div>
            <label className="text-xs font-medium" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
              {t('profile.email', { defaultValue: 'Correo electrónico' })}
            </label>
            <p className="mt-1" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
              {profile?.email || t('profile.not_specified', { defaultValue: 'No especificado' })}
            </p>
          </div>

          {profile?.phone && (
            <div>
              <label className="text-xs font-medium" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                {t('profile.phone', { defaultValue: 'Teléfono' })}
              </label>
              <p className="mt-1" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
                {profile.phone}
              </p>
            </div>
          )}

          {profile?.date_of_birth && (
            <div>
              <label className="text-xs font-medium" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                {t('profile.date_of_birth', { defaultValue: 'Fecha de Nacimiento' })}
              </label>
              <p className="mt-1" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
                {new Date(profile.date_of_birth).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}

          {profile?.timezone && profile.timezone !== 'UTC' && (
            <div>
              <label className="text-xs font-medium" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                {t('profile.timezone', { defaultValue: 'Zona Horaria' })}
              </label>
              <p className="mt-1" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
                {profile.timezone}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Información de la cuenta */}
      <div>
        <h4 className="text-sm font-semibold mb-3" style={{ color: isDark ? '#e2e8f0' : '#374151' }}>
          {t('profile.account_info', { defaultValue: 'Información de la Cuenta' })}
        </h4>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
              {t('profile.member_since', { defaultValue: 'Miembro desde' })}
            </label>
            <p className="mt-1" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : t('profile.not_specified', { defaultValue: 'No especificado' })}
            </p>
          </div>

          <div>
            <label className="text-xs font-medium" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
              {t('profile.last_updated', { defaultValue: 'Última actualización' })}
            </label>
            <p className="mt-1" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
              {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : t('profile.not_specified', { defaultValue: 'No especificado' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Componente de estadísticas del perfil
const ProfileStats = ({ stats, isDark, t }: { 
  stats: any;
  isDark: boolean; 
  t: any 
}) => {
  const statsData = [
    {
      id: 'habits',
      label: t('profile.stats.total_habits', { defaultValue: 'Hábitos Totales' }),
      value: stats?.total_habits || 0,
      icon: '📋'
    },
    {
      id: 'active_habits',
      label: t('profile.stats.active_habits', { defaultValue: 'Hábitos Activos' }),
      value: stats?.habits_total_active || 0,
      icon: '✅'
    },
    {
      id: 'days',
      label: t('profile.stats.days_active', { defaultValue: 'Días Activos' }),
      value: stats?.days_active || 0,
      icon: '📅'
    },
    {
      id: 'streak',
      label: t('profile.stats.current_streak', { defaultValue: 'Racha Actual' }),
      value: stats?.current_streak || 0,
      icon: '🔥'
    },
    {
      id: 'points',
      label: t('profile.stats.total_points', { defaultValue: 'Puntos Totales' }),
      value: stats?.total_points?.toLocaleString() || '0',
      icon: '⭐'
    },
    {
      id: 'level',
      label: t('profile.stats.current_level', { defaultValue: 'Nivel Actual' }),
      value: stats?.current_level || 1,
      icon: '🏆'
    },
    {
      id: 'challenges',
      label: t('profile.stats.active_challenges', { defaultValue: 'Desafíos Activos' }),
      value: stats?.active_challenges || 0,
      icon: '🎯'
    },
    {
      id: 'today',
      label: t('profile.stats.completed_today', { defaultValue: 'Completados Hoy' }),
      value: stats?.habits_completed_today || 0,
      icon: '🌟'
    }
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
        {t('profile.stats', { defaultValue: 'Estadísticas del Perfil' })}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statsData.map((stat) => (
          <div key={stat.id} className="flex items-center justify-between p-3 rounded-lg"
            style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
            <div className="flex items-center gap-3">
              <span className="text-xl">{stat.icon}</span>
              <span className="text-sm font-medium" style={{ color: isDark ? '#cbd5e1' : '#374151' }}>
                {stat.label}
              </span>
            </div>
            <span className="text-lg font-bold" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de modal de edición mejorado
const EditProfileModal = ({ profile, isDark, t, onClose, onSave }: {
  profile: any;
  isDark: boolean;
  t: any;
  onClose: () => void;
  onSave: (updates: any) => Promise<{ success: boolean; message: string }>;
}) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    timezone: 'UTC'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Inicializar los datos del formulario cuando se abre el modal
  useEffect(() => {
    if (profile) {
      console.log('Inicializando modal con perfil:', profile);
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        timezone: profile.timezone || 'UTC'
      });
    }
  }, [profile]);

  // Validación en tiempo real
  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'first_name':
        if (!value.trim()) {
          newErrors[field] = t('profile.errors.first_name_required', { defaultValue: 'El nombre es obligatorio' });
        } else if (value.trim().length < 2) {
          newErrors[field] = t('profile.errors.first_name_min', { defaultValue: 'El nombre debe tener al menos 2 caracteres' });
        } else if (value.trim().length > 50) {
          newErrors[field] = t('profile.errors.first_name_max', { defaultValue: 'El nombre no puede tener más de 50 caracteres' });
        } else {
          delete newErrors[field];
        }
        break;
        
      case 'last_name':
        if (!value.trim()) {
          newErrors[field] = t('profile.errors.last_name_required', { defaultValue: 'El apellido es obligatorio' });
        } else if (value.trim().length < 2) {
          newErrors[field] = t('profile.errors.last_name_min', { defaultValue: 'El apellido debe tener al menos 2 caracteres' });
        } else if (value.trim().length > 50) {
          newErrors[field] = t('profile.errors.last_name_max', { defaultValue: 'El apellido no puede tener más de 50 caracteres' });
        } else {
          delete newErrors[field];
        }
        break;
        
      case 'phone':
        if (value.trim() && !/^\+?[\d\s\-()]+$/.test(value.trim())) {
          newErrors[field] = t('profile.errors.phone_format', { defaultValue: 'Formato de teléfono inválido' });
        } else {
          delete newErrors[field];
        }
        break;
        
      case 'date_of_birth':
        if (value) {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 13) {
            newErrors[field] = t('profile.errors.age_min', { defaultValue: 'Debes tener al menos 13 años' });
          } else if (age > 120) {
            newErrors[field] = t('profile.errors.age_max', { defaultValue: 'Edad inválida' });
          } else {
            delete newErrors[field];
          }
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos antes de enviar
    Object.keys(formData).forEach(key => {
      validateField(key, formData[key as keyof typeof formData]);
    });
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    setIsSaving(true);
    setSuccessMessage('');
    
    try {
      const result = await onSave(formData);
      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      console.error('Error guardando perfil:', error);
      setErrors({ general: t('profile.errors.save_error', { defaultValue: 'Error al guardar. Intenta de nuevo.' }) });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
    // Limpiar mensaje de éxito al hacer cambios
    if (successMessage) setSuccessMessage('');
    // Limpiar error general al hacer cambios
    if (errors.general) {
      const newErrors = { ...errors };
      delete newErrors.general;
      setErrors(newErrors);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
            {t('profile.edit_profile', { defaultValue: 'Editar Perfil' })}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSaving}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mensajes de estado */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md" role="alert">
            {successMessage}
          </div>
        )}
        
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md" role="alert">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label 
              htmlFor="first_name" 
              className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              {t('profile.first_name', { defaultValue: 'Nombre' })} *
            </label>
            <input
              id="first_name"
              type="text"
              value={formData.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              } ${errors.first_name ? 'border-red-500' : ''}`}
              placeholder={t('profile.first_name_placeholder', { defaultValue: 'Ingresa tu nombre' })}
              required
              disabled={isSaving}
              aria-describedby={errors.first_name ? "first_name-error" : undefined}
            />
            {errors.first_name && (
              <p id="first_name-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.first_name}
              </p>
            )}
          </div>

          {/* Apellido */}
          <div>
            <label 
              htmlFor="last_name" 
              className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              {t('profile.last_name', { defaultValue: 'Apellido' })} *
            </label>
            <input
              id="last_name"
              type="text"
              value={formData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              } ${errors.last_name ? 'border-red-500' : ''}`}
              placeholder={t('profile.last_name_placeholder', { defaultValue: 'Ingresa tu apellido' })}
              required
              disabled={isSaving}
              aria-describedby={errors.last_name ? "last_name-error" : undefined}
            />
            {errors.last_name && (
              <p id="last_name-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.last_name}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label 
              htmlFor="phone" 
              className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              {t('profile.phone', { defaultValue: 'Teléfono' })}
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              } ${errors.phone ? 'border-red-500' : ''}`}
              placeholder={t('profile.phone_placeholder', { defaultValue: '+1234567890' })}
              disabled={isSaving}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label 
              htmlFor="date_of_birth" 
              className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              {t('profile.date_of_birth', { defaultValue: 'Fecha de Nacimiento' })}
            </label>
            <input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => handleChange('date_of_birth', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } ${errors.date_of_birth ? 'border-red-500' : ''}`}
              disabled={isSaving}
              aria-describedby={errors.date_of_birth ? "date_of_birth-error" : undefined}
            />
            {errors.date_of_birth && (
              <p id="date_of_birth-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.date_of_birth}
              </p>
            )}
          </div>

          {/* Zona horaria */}
          <div>
            <label 
              htmlFor="timezone" 
              className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              {t('profile.timezone', { defaultValue: 'Zona Horaria' })}
            </label>
            <select
              id="timezone"
              value={formData.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              disabled={isSaving}
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Este (Nueva York)</option>
              <option value="America/Chicago">Centro (Chicago)</option>
              <option value="America/Denver">Montaña (Denver)</option>
              <option value="America/Los_Angeles">Pacífico (Los Ángeles)</option>
              <option value="America/Mexico_City">Ciudad de México</option>
              <option value="America/Bogota">Bogotá</option>
              <option value="America/Lima">Lima</option>
              <option value="America/Santiago">Santiago</option>
              <option value="America/Buenos_Aires">Buenos Aires</option>
              <option value="Europe/Madrid">Madrid</option>
              <option value="Europe/London">Londres</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: isDark ? '#475569' : '#f1f5f9',
                color: isDark ? '#f1f5f9' : '#475569',
                opacity: isSaving ? 0.5 : 1
              }}
            >
              {t('common.cancel', { defaultValue: 'Cancelar' })}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              style={{ opacity: isSaving ? 0.5 : 1 }}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('common.saving', { defaultValue: 'Guardando...' })}
                </>
              ) : (
                t('common.save', { defaultValue: 'Guardar' })
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const { t } = useTranslation();
  const { isDark } = useThemeForce();
  const [mounted, setMounted] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Hook del perfil con datos reales
  const { 
    profile, 
    stats, 
    isLoading, 
    error, 
    updateProfile,
    signOut,
    refresh 
  } = useProfile();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Debug: Log de datos del perfil
  useEffect(() => {
    console.log('ProfilePage - profile:', profile);
    console.log('ProfilePage - stats:', stats);
    console.log('ProfilePage - isLoading:', isLoading);
    console.log('ProfilePage - error:', error);
  }, [profile, stats, isLoading, error]);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  if (!mounted) {
    return <LoadingSkeleton />;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!profile && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">👤</div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
            {t('profile.no_profile', { defaultValue: 'No se pudo cargar el perfil' })}
          </h2>
          <p className="text-gray-600 mb-4">
            {t('profile.no_profile_desc', { defaultValue: 'Intenta recargar la página o verifica tu conexión.' })}
          </p>
          <button
            onClick={refresh}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {t('common.retry', { defaultValue: 'Reintentar' })}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header de la página */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t('profile.title', { defaultValue: 'Mi Perfil' })}
        </h1>
        <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {t('profile.subtitle', { defaultValue: 'Gestiona tu información personal y preferencias' })}
        </p>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ProfileInfo 
            profile={profile} 
            isDark={isDark} 
            t={t} 
            onEdit={handleEdit}
          />
          
          {/* Acciones adicionales */}
          <div
            className="border rounded-xl p-6"
            style={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              borderColor: isDark ? '#475569' : '#e2e8f0',
              color: isDark ? '#f1f5f9' : '#1e293b'
            }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
              {t('profile.account_actions', { defaultValue: 'Acciones de Cuenta' })}
            </h2>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {t('profile.edit_profile', { defaultValue: 'Editar Perfil' })}
              </button>
              
              <button
                onClick={() => {
                  if (confirm(t('profile.confirm_logout', { defaultValue: '¿Estás seguro de que quieres cerrar sesión?' }))) {
                    signOut();
                    window.location.href = '/iniciar-sesion';
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t('profile.sign_out', { defaultValue: 'Cerrar Sesión' })}
              </button>
            </div>
          </div>
        </div>
        <div>
          <ProfileStats stats={stats} isDark={isDark} t={t} />
        </div>
      </div>

      {/* Modal de edición */}
      {showEditModal && (
        <EditProfileModal 
          profile={profile}
          isDark={isDark}
          t={t}
          onClose={() => setShowEditModal(false)}
          onSave={async (updates) => {
            const result = await updateProfile(updates);
            if (result.success) {
              // El modal se cerrará automáticamente después del mensaje de éxito
            }
            return result;
          }}
        />
      )}
    </div>
  );
}
