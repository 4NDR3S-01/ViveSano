"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useThemeForce } from "../../../hooks/useThemeForce";
import { useDashboard } from "../../../hooks/useDashboard";
import '../../../i18n';

// Componente de error
const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh]">
    <div className="text-center">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Reintentar
      </button>
    </div>
  </div>
);

// Componente de carga
const LoadingSkeleton = () => (
  <div className="p-6">
    <div className="animate-pulse">
      <div className="h-8 bg-slate-200 rounded mb-2 w-1/3"></div>
      <div className="h-4 bg-slate-200 rounded mb-8 w-1/2"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-slate-200 rounded-xl h-48"></div>
        ))}
      </div>
    </div>
  </div>
);

// Componente para cuando no hay hábitos
const EmptyState = ({ t, isDark }: { t: any; isDark: boolean }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-16">
    <div className="text-6xl mb-4">🎯</div>
    <h3 className="text-xl font-semibold mb-2" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
      {t('habits.empty.title', { defaultValue: 'No tienes hábitos aún' })}
    </h3>
    <p className="text-center mb-6 max-w-md" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
      {t('habits.empty.description', { defaultValue: 'Comienza tu viaje hacia una vida más saludable creando tu primer hábito.' })}
    </p>
    <button
      className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
      onClick={() => window.location.href = '/dashboard/habits/new'}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      {t('habits.create_first', { defaultValue: 'Crear mi primer hábito' })}
    </button>
  </div>
);

// Componente de tarjeta de hábito
const HabitCard = ({ habit, onToggle, onDelete, isDark, t }: { 
  habit: any; 
  onToggle: () => void;
  onDelete: () => void;
  isDark: boolean;
  t: any;
}) => {
  // Calcular estado del botón basado en el progreso
  const isFullyCompleted = habit.todayAmount >= habit.target_frequency;
  const canIncrement = habit.todayAmount < habit.target_frequency;
  
  const getToggleButtonClasses = () => {
    if (isFullyCompleted) {
      return 'bg-green-500 border-green-500 text-white cursor-default';
    }
    if (habit.todayAmount > 0) {
      return 'bg-yellow-500 border-yellow-500 text-white hover:bg-yellow-600';
    }
    return isDark 
      ? 'border-slate-600 hover:border-green-400 hover:bg-green-50' 
      : 'border-slate-300 hover:border-green-400 hover:bg-green-50';
  };

  const getButtonContent = () => {
    if (isFullyCompleted) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    if (habit.todayAmount > 0) {
      return <span className="text-xs font-bold">+1</span>;
    }
    return null;
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
      {/* Header del hábito */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{habit.icon}</span>
          <div>
            <h3 className="font-semibold text-lg" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
              {habit.name}
            </h3>
            <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              {habit.category}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Botón de eliminar */}
          <button
            onClick={onDelete}
            className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors hover:bg-red-50 hover:border-red-300 text-red-500"
            style={{
              borderColor: isDark ? '#475569' : '#e2e8f0',
            }}
            aria-label="Eliminar hábito"
            title="Eliminar hábito"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          {/* Botón de toggle/completar */}
          <button
            onClick={canIncrement ? onToggle : undefined}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${getToggleButtonClasses()}`}
            aria-label={
              isFullyCompleted 
                ? 'Hábito completado' 
                : 'Incrementar progreso'
            }
            disabled={!canIncrement}
          >
            {getButtonContent()}
          </button>
        </div>
      </div>

      {/* Descripción */}
      {habit.description && (
        <p className="text-sm mb-4" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
          {habit.description}
        </p>
      )}

      {/* Meta y progreso */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            {t('habits.target', { defaultValue: 'Meta' })}
          </span>
          <span className="text-sm font-medium">
            {habit.target_frequency} {habit.target_unit}
          </span>
        </div>

        {/* Progreso del día */}
        {habit.target_frequency > 1 && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                {t('habits.today_progress', { defaultValue: 'Progreso hoy' })}
              </span>
              <span className="text-sm font-medium">
                {habit.todayAmount}/{habit.target_frequency}
              </span>
            </div>
            <div 
              className="w-full rounded-full h-2"
              style={{ backgroundColor: isDark ? '#475569' : '#e2e8f0' }}
            >
              <div 
                className="bg-green-500 h-2 rounded-full transition-all" 
                style={{ width: `${habit.progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Estado */}
        <div className="flex items-center gap-2">
          {(() => {
            let bgColor = 'bg-slate-400';
            let statusText = t('habits.pending', { defaultValue: 'Pendiente' });
            
            if (isFullyCompleted) {
              bgColor = 'bg-green-500';
              statusText = t('habits.completed_today', { defaultValue: 'Completado hoy' });
            } else if (habit.todayAmount > 0) {
              bgColor = 'bg-yellow-500';
              statusText = t('habits.in_progress', { defaultValue: 'En progreso' });
            }
            
            return (
              <>
                <div className={`w-2 h-2 rounded-full ${bgColor}`} />
                <span className="text-sm font-medium">{statusText}</span>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default function HabitsPage() {
  const { t } = useTranslation();
  const { isDark } = useThemeForce();
  const [mounted, setMounted] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Usar el hook real del dashboard para obtener hábitos
  const { 
    habits, 
    isLoading, 
    error, 
    toggleHabit, 
    deleteHabit,
    refresh
  } = useDashboard();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Función para manejar la eliminación de un hábito
  const handleDeleteHabit = async () => {
    if (!habitToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteHabit(habitToDelete.id);
      if (success) {
        setHabitToDelete(null);
      }
    } catch (error) {
      console.error('Error eliminando hábito:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!mounted) {
    return <LoadingSkeleton />;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={refresh} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header de la página */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('habits.title', { defaultValue: 'Mis Hábitos' })}
            </h1>
            <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t('habits.subtitle', { defaultValue: 'Gestiona y realiza seguimiento de tus hábitos diarios' })}
            </p>
          </div>
          <button
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            onClick={() => window.location.href = '/dashboard/habits/new'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('habits.add_new', { defaultValue: 'Agregar Hábito' })}
          </button>
        </div>
      </div>

      {/* Grid de hábitos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.length === 0 ? (
          <EmptyState t={t} isDark={isDark} />
        ) : (
          habits.map((habit) => (
            <HabitCard 
              key={habit.id} 
              habit={habit} 
              onToggle={() => toggleHabit(habit.id)} 
              onDelete={() => setHabitToDelete(habit)}
              isDark={isDark}
              t={t}
            />
          ))
        )}
      </div>

      {/* Modal de confirmación para eliminar hábito */}
      {habitToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-xl p-6 max-w-md w-full"
            style={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`
            }}
          >
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">🗑️</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
                {t('habits.delete.title', { defaultValue: '¿Eliminar hábito?' })}
              </h3>
              <p className="text-sm mb-2" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                {t('habits.delete.message', { 
                  defaultValue: 'Estás a punto de eliminar el hábito "{{habitName}}". Esta acción no se puede deshacer.', 
                  habitName: habitToDelete.name 
                })}
              </p>
              <p className="text-xs mb-6" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                {t('habits.delete.note', { defaultValue: 'Los datos históricos se preservarán para estadísticas.' })}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setHabitToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: isDark ? '#475569' : '#f1f5f9',
                    color: isDark ? '#f1f5f9' : '#475569',
                    opacity: isDeleting ? 0.5 : 1
                  }}
                >
                  {t('habits.delete.cancel', { defaultValue: 'Cancelar' })}
                </button>
                <button
                  onClick={handleDeleteHabit}
                  disabled={isDeleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  style={{ opacity: isDeleting ? 0.5 : 1 }}
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('habits.delete.deleting', { defaultValue: 'Eliminando...' })}
                    </>
                  ) : (
                    t('habits.delete.confirm', { defaultValue: 'Eliminar' })
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
