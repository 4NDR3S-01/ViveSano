"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useThemeForce } from "../../../hooks/useThemeForce";
import { supabase } from "../../../supabaseClient";
import '../../../i18n';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

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
  profile: UserProfile;
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
      <h2 className="text-xl font-semibold" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
        {t('profile.personal_info', { defaultValue: 'Información Personal' })}
      </h2>
      <button
        onClick={onEdit}
        className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        {t('profile.edit', { defaultValue: 'Editar Perfil' })}
      </button>
    </div>

    <div className="flex items-center gap-4 mb-6">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
        {profile.name ? profile.name.charAt(0).toUpperCase() : profile.email.charAt(0).toUpperCase()}
      </div>
      <div>
        <h3 className="text-xl font-semibold" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
          {profile.name || 'Usuario'}
        </h3>
        <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
          {profile.email}
        </p>
      </div>
    </div>

    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium" style={{ color: isDark ? '#cbd5e1' : '#374151' }}>
          {t('profile.name', { defaultValue: 'Nombre' })}
        </label>
        <p className="mt-1" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
          {profile.name || 'No especificado'}
        </p>
      </div>
      
      <div>
        <label className="text-sm font-medium" style={{ color: isDark ? '#cbd5e1' : '#374151' }}>
          {t('profile.email', { defaultValue: 'Correo electrónico' })}
        </label>
        <p className="mt-1" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
          {profile.email}
        </p>
      </div>

      <div>
        <label className="text-sm font-medium" style={{ color: isDark ? '#cbd5e1' : '#374151' }}>
          {t('profile.joined', { defaultValue: 'Se unió' })}
        </label>
        <p className="mt-1" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
          {new Date(profile.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  </div>
);

// Componente de estadísticas del perfil
const ProfileStats = ({ isDark, t }: { isDark: boolean; t: any }) => {
  const stats = [
    {
      id: 'habits',
      label: 'Hábitos Creados',
      value: '12',
      icon: '📋'
    },
    {
      id: 'days',
      label: 'Días Activos',
      value: '45',
      icon: '📅'
    },
    {
      id: 'streak',
      label: 'Racha Actual',
      value: '7',
      icon: '🔥'
    },
    {
      id: 'points',
      label: 'Puntos Totales',
      value: '1,250',
      icon: '⭐'
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

      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-sm" style={{ color: isDark ? '#cbd5e1' : '#374151' }}>
                {stat.label}
              </span>
            </div>
            <span className="text-lg font-semibold" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const { t } = useTranslation();
  const { isDark } = useThemeForce();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        setError('No se pudo obtener la información del usuario');
        return;
      }

      // Obtener perfil adicional si existe
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const userProfile: UserProfile = {
        id: user.id,
        email: user.email || '',
        name: profileData?.full_name || profileData?.name || '',
        created_at: user.created_at || new Date().toISOString()
      };

      setProfile(userProfile);
    } catch (error) {
      console.error('Error cargando perfil:', error);
      setError('Error al cargar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    console.log('Función de edición pendiente por implementar');
    // Aquí se podría abrir un modal de edición o redirigir a una página de edición
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
            onClick={loadProfile}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
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
        <div className="lg:col-span-2">
          <ProfileInfo 
            profile={profile} 
            isDark={isDark} 
            t={t} 
            onEdit={handleEdit}
          />
        </div>
        <div>
          <ProfileStats isDark={isDark} t={t} />
        </div>
      </div>
    </div>
  );
}
