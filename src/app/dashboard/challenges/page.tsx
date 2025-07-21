"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useThemeForce } from "../../../hooks/useThemeForce";
import '../../../i18n';

export default function ChallengesPage() {
  const { t } = useTranslation();
  const { isDark } = useThemeForce();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header de la página */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('challenges.title', { defaultValue: 'Desafíos' })}
            </h1>
            <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t('challenges.subtitle', { defaultValue: 'Participa en desafíos para mantener tu motivación' })}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Desafíos Activos */}
        <div>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('challenges.active_title', { defaultValue: 'Desafíos Activos' })}
          </h2>
          <ActiveChallenges isDark={isDark} t={t} />
        </div>

        {/* Desafíos Disponibles */}
        <div>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('challenges.available_title', { defaultValue: 'Desafíos Disponibles' })}
          </h2>
          <AvailableChallenges isDark={isDark} t={t} />
        </div>
      </div>
    </div>
  );
}

// Componente de desafíos activos
const ActiveChallenges = ({ isDark, t }: { isDark: boolean; t: any }) => (
  <div className="space-y-4">
    <EmptyActiveChallenges isDark={isDark} t={t} />
  </div>
);

// Componente de desafíos disponibles
const AvailableChallenges = ({ isDark, t }: { isDark: boolean; t: any }) => (
  <div className="space-y-4">
    {/* Desafío de ejemplo */}
    <ChallengeCard
      challenge={{
        id: '1',
        title: t('challenges.example.title', { defaultValue: '7 Días de Meditación' }),
        description: t('challenges.example.description', { defaultValue: 'Medita durante 10 minutos al día por 7 días consecutivos' }),
        icon: '🧘‍♀️',
        difficulty: 'Fácil',
        duration: '7 días',
        points: 150,
        category: 'Bienestar Mental'
      }}
      isDark={isDark}
      t={t}
      onJoin={() => alert('¡Desafío iniciado!')}
    />

    <ChallengeCard
      challenge={{
        id: '2',
        title: t('challenges.example.title2', { defaultValue: 'Hidratación Saludable' }),
        description: t('challenges.example.description2', { defaultValue: 'Bebe 8 vasos de agua al día durante 14 días' }),
        icon: '💧',
        difficulty: 'Fácil',
        duration: '14 días',
        points: 200,
        category: 'Nutrición'
      }}
      isDark={isDark}
      t={t}
      onJoin={() => alert('¡Desafío iniciado!')}
    />

    <ChallengeCard
      challenge={{
        id: '3',
        title: t('challenges.example.title3', { defaultValue: '10,000 Pasos Diarios' }),
        description: t('challenges.example.description3', { defaultValue: 'Camina 10,000 pasos cada día durante 30 días' }),
        icon: '🚶‍♀️',
        difficulty: 'Moderado',
        duration: '30 días',
        points: 500,
        category: 'Actividad Física'
      }}
      isDark={isDark}
      t={t}
      onJoin={() => alert('¡Desafío iniciado!')}
    />
  </div>
);

// Componente para desafíos activos vacío
const EmptyActiveChallenges = ({ isDark, t }: { isDark: boolean; t: any }) => (
  <div 
    className="text-center py-12 rounded-xl border"
    style={{
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderColor: isDark ? '#475569' : '#e2e8f0'
    }}
  >
    <div className="text-4xl mb-4">🎯</div>
    <h3 className="text-lg font-semibold mb-2" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
      {t('challenges.empty_active.title', { defaultValue: 'No tienes desafíos activos' })}
    </h3>
    <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
      {t('challenges.empty_active.description', { defaultValue: 'Únete a un desafío para comenzar tu aventura' })}
    </p>
  </div>
);

// Componente de tarjeta de desafío
const ChallengeCard = ({ 
  challenge, 
  isDark, 
  t, 
  onJoin 
}: { 
  challenge: any; 
  isDark: boolean; 
  t: any; 
  onJoin: () => void;
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'fácil':
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'moderado':
      case 'moderate':
        return 'text-yellow-600 bg-yellow-100';
      case 'difícil':
      case 'hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div
      className="border rounded-xl p-6 shadow-sm transition-all duration-200 hover:shadow-lg"
      style={{
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderColor: isDark ? '#475569' : '#e2e8f0',
        color: isDark ? '#f1f5f9' : '#1e293b'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{challenge.icon}</span>
          <div>
            <h3 className="font-semibold text-lg" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
              {challenge.title}
            </h3>
            <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              {challenge.category}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
          {challenge.difficulty}
        </span>
      </div>

      {/* Descripción */}
      <p className="text-sm mb-4" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
        {challenge.description}
      </p>

      {/* Detalles */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{challenge.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>{challenge.points} pts</span>
          </div>
        </div>
      </div>

      {/* Botón de unirse */}
      <button
        onClick={onJoin}
        className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
      >
        {t('challenges.join', { defaultValue: 'Unirse al Desafío' })}
      </button>
    </div>
  );
};

// Componente de carga
const LoadingSkeleton = () => (
  <div className="p-6">
    <div className="animate-pulse">
      <div className="h-8 bg-slate-200 rounded mb-2 w-1/3"></div>
      <div className="h-4 bg-slate-200 rounded mb-8 w-1/2"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="h-6 bg-slate-200 rounded mb-4 w-1/4"></div>
          <div className="bg-slate-200 rounded-xl h-32"></div>
        </div>
        <div>
          <div className="h-6 bg-slate-200 rounded mb-4 w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-200 rounded-xl h-48"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
