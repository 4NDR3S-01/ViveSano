"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useThemeForce } from "../../../hooks/useThemeForce";
import { useChallenges } from "../../../hooks/useChallenges";
import '../../../i18n';

// ====================================
// UTILIDADES
// ====================================

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
    case 'fácil':
    case 'easy':
      return 'text-green-600 bg-green-100';
    case 'intermediate':
    case 'moderado':
    case 'moderate':
      return 'text-yellow-600 bg-yellow-100';
    case 'advanced':
    case 'difícil':
    case 'hard':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// ====================================
// COMPONENTE PRINCIPAL
// ====================================

export default function ChallengesPage() {
  const { t } = useTranslation();
  const { isDark } = useThemeForce();
  const [mounted, setMounted] = useState(false);
  
  // Hook de desafíos con datos reales
  const {
    isLoading,
    error,
    joinChallenge,
    leaveChallenge,
    updateProgress,
    getAvailableToJoin,
    getActiveChallenges
  } = useChallenges();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingSkeleton />;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border`}>
          <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            {t('challenges.error', { defaultValue: 'Error cargando desafíos' })}: {error}
          </p>
        </div>
      </div>
    );
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
          <ActiveChallenges 
            isDark={isDark} 
            t={t} 
            challenges={getActiveChallenges()}
            onLeaveChallenge={leaveChallenge}
            onUpdateProgress={updateProgress}
          />
        </div>

        {/* Desafíos Disponibles */}
        <div>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('challenges.available_title', { defaultValue: 'Desafíos Disponibles' })}
          </h2>
          <AvailableChallenges 
            isDark={isDark} 
            t={t} 
            challenges={getAvailableToJoin()}
            onJoinChallenge={joinChallenge}
          />
        </div>
      </div>
    </div>
  );
}

// Componente de desafíos activos
const ActiveChallenges = ({ 
  isDark, 
  t, 
  challenges, 
  onLeaveChallenge, 
  onUpdateProgress 
}: { 
  isDark: boolean; 
  t: any; 
  challenges: any[];
  onLeaveChallenge: (challengeId: string) => Promise<boolean>;
  onUpdateProgress: (challengeId: string, increment?: number) => Promise<boolean>;
}) => {
  if (challenges.length === 0) {
    return <EmptyActiveChallenges isDark={isDark} t={t} />;
  }

  return (
    <div className="space-y-4">
      {challenges.map((userChallenge) => {
        // Intentar con ambos nombres posibles
        const challengeData = userChallenge.challenges || userChallenge.challenge;
        
        return challengeData ? (
          <ActiveChallengeCard
            key={userChallenge.id}
            challenge={challengeData}
            userChallenge={userChallenge}
            isDark={isDark}
            t={t}
            onLeave={onLeaveChallenge}
            onUpdateProgress={onUpdateProgress}
          />
        ) : null
      })}
    </div>
  );
};

// Componente de desafíos disponibles
const AvailableChallenges = ({ 
  isDark, 
  t, 
  challenges,
  onJoinChallenge 
}: { 
  isDark: boolean; 
  t: any; 
  challenges: any[];
  onJoinChallenge: (challengeId: string) => Promise<boolean>;
}) => {
  if (challenges.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-lg font-semibold mb-2">
          {t('challenges.no_available', { defaultValue: 'No hay desafíos disponibles' })}
        </h3>
        <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
          {t('challenges.no_available_description', { defaultValue: 'Pronto habrá nuevos desafíos disponibles' })}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          isDark={isDark}
          t={t}
          onJoin={async () => {
            const success = await onJoinChallenge(challenge.id);
            if (success) {
              // La UI se actualizará automáticamente gracias al hook
            }
          }}
        />
      ))}
    </div>
  );
};

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

// Componente de tarjeta de desafío activo
const ActiveChallengeCard = ({
  challenge,
  userChallenge,
  isDark,
  t,
  onLeave,
  onUpdateProgress
}: {
  challenge: any;
  userChallenge: any;
  isDark: boolean;
  t: any;
  onLeave: (challengeId: string) => Promise<boolean>;
  onUpdateProgress: (challengeId: string, increment?: number) => Promise<boolean>;
}) => {
  // Verificación de seguridad
  if (!challenge || !userChallenge) {
    return null;
  }

  const progressPercentage = Math.min(
    (userChallenge.progress / (challenge.goal_value || 100)) * 100, 
    100
  );

    const handleUpdateProgress = async () => {
    const success = await onUpdateProgress(challenge.id);
    if (!success) {
      // Mostrar mensaje de error al usuario
      console.error('Error al actualizar progreso');
    }
  };

  const handleLeave = async () => {
    if (confirm(t('challenges.confirm_leave', { defaultValue: '¿Estás seguro de que quieres abandonar este desafío?' }))) {
      const success = await onLeave(challenge.id);
      if (success) {
        // La UI se actualizará automáticamente gracias al hook
      }
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
          <span className="text-3xl">{challenge.icon || '🎯'}</span>
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
          {challenge.difficulty || 'Intermedio'}
        </span>
      </div>

      {/* Progreso */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {t('challenges.progress', { defaultValue: 'Progreso' })}
          </span>
          <span className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            {userChallenge.progress} / {challenge.goal_value || 100} {challenge.goal_unit || 'puntos'}
          </span>
        </div>
        <div 
          className="w-full rounded-full h-3"
          style={{ backgroundColor: isDark ? '#334155' : '#e2e8f0' }}
        >
          <div
            className="h-3 rounded-full bg-violet-600 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-center mt-1">
          <span className="text-sm font-medium text-violet-600">
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Descripción */}
      <p className="text-sm mb-4" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
        {challenge.description}
      </p>

      {/* Botones de acción */}
      <div className="flex gap-2">
        <button
          onClick={handleUpdateProgress}
          disabled={progressPercentage >= 100}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          {progressPercentage >= 100 
            ? t('challenges.completed', { defaultValue: 'Completado' })
            : t('challenges.update_progress', { defaultValue: 'Registrar Progreso' })
          }
        </button>
        <button
          onClick={handleLeave}
          className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors"
        >
          {t('challenges.leave', { defaultValue: 'Abandonar' })}
        </button>
      </div>
    </div>
  );
};

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
  onJoin: () => Promise<void> | void;
}) => {
  // Verificación de seguridad
  if (!challenge) {
    return null;
  }

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
          <span className="text-3xl">{challenge.icon || '🎯'}</span>
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
          {challenge.difficulty || 'Intermedio'}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span>
              {t('challenges.goal', { defaultValue: 'Meta' })}: {challenge.goal_value || 100} {challenge.goal_unit || 'pts'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>{challenge.points || 0} pts</span>
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
