// ====================================
// HOOK PERSONALIZADO - DASHBOARD
// ====================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getUserStats, 
  getUserHabits,
  completeHabit,
  createHabit,
  getWeeklyProgress,
  type UserStats,
  type HabitWithProgress,
  type WeeklyProgress
} from '@/services/dashboardService';

// ====================================
// INTERFACES LOCALES
// ====================================

interface DashboardData {
  stats: UserStats | null;
  habits: HabitWithProgress[];
  weeklyProgress: WeeklyProgress | null;
  isLoading: boolean;
  error: string | null;
}

// ====================================
// HOOK PRINCIPAL
// ====================================

export const useDashboard = () => {
  // Estados
  const [data, setData] = useState<DashboardData>({
    stats: null,
    habits: [],
    weeklyProgress: null,
    isLoading: true,
    error: null
  });

  // Función para cargar todos los datos del dashboard
  const loadDashboardData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Cargar datos en paralelo
      const [statsData, habitsData, weeklyData] = await Promise.all([
        getUserStats(),
        getUserHabits(),
        getWeeklyProgress()
      ]);

      setData({
        stats: statsData,
        habits: habitsData,
        weeklyProgress: weeklyData,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Error cargando dashboard:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }));
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Función para completar un hábito
  const handleCompleteHabit = useCallback(async (habitId: string): Promise<boolean> => {
    try {
      const success = await completeHabit(habitId);
      if (success) {
        // Recargar hábitos y estadísticas
        const [habitsData, statsData] = await Promise.all([
          getUserHabits(),
          getUserStats()
        ]);
        
        setData(prev => ({
          ...prev,
          habits: habitsData,
          stats: statsData
        }));
      }
      return success;
    } catch (error) {
      console.error('Error completando hábito:', error);
      return false;
    }
  }, []);

  // Función para toggle (alternar) un hábito
  const toggleHabit = useCallback(async (habitId: string): Promise<boolean> => {
    const habit = data.habits.find(h => h.id === habitId);
    if (!habit) return false;

    // Permitir incrementar el progreso hasta completar la meta
    // Si ya está completado al 100%, no hacer nada
    if (habit.todayAmount >= habit.target_frequency) {
      return true; // Ya completado al máximo
    }

    // Incrementar el progreso (siempre suma 1 unidad)
    const success = await handleCompleteHabit(habitId);
    
    return success;
  }, [data.habits, handleCompleteHabit]);

  // Función para refrescar datos
  const refresh = useCallback(async () => {
    await loadDashboardData();
  }, [loadDashboardData]);

  // Función para obtener estadísticas formateadas para la UI
  const getFormattedStats = useCallback((t?: any) => {
    if (!data.stats) return null;

    return [
      {
        id: 'current-streak',
        title: t ? t('dashboard.stats.current_streak', { defaultValue: 'Racha Actual' }) : 'Racha Actual',
        value: data.stats.current_streak,
        icon: '🔥',
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        unit: t ? t('dashboard.stats.days', { defaultValue: 'días' }) : 'días'
      },
      {
        id: 'total-points',
        title: t ? t('dashboard.stats.total_points', { defaultValue: 'Puntos Totales' }) : 'Puntos Totales',
        value: data.stats.total_points,
        icon: '⭐',
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200'
      },
      {
        id: 'habits-completed-today',
        title: t ? t('dashboard.stats.habits_today', { defaultValue: 'Hábitos Hoy' }) : 'Hábitos Hoy',
        value: data.stats.habits_completed_today,
        total: data.stats.total_habits,
        icon: '✅',
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200'
      },
      {
        id: 'active-challenges',
        title: t ? t('dashboard.stats.active_challenges', { defaultValue: 'Desafíos Activos' }) : 'Desafíos Activos',
        value: data.stats.active_challenges,
        icon: '🎯',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200'
      }
    ];
  }, [data.stats]);

  // Función para obtener progreso semanal formateado
  const getFormattedWeeklyProgress = useCallback((t?: any) => {
    if (!data.weeklyProgress) return null;

    return [
      {
        label: t ? t('dashboard.progress.habits_completed', { defaultValue: 'Hábitos completados' }) : 'Hábitos completados',
        percentage: `${data.weeklyProgress.habitsCompletedPercentage}%`,
        width: `${data.weeklyProgress.habitsCompletedPercentage}%`,
        color: 'bg-green-500',
        count: data.weeklyProgress.habitsCompletedCount,
        total: data.weeklyProgress.totalHabitsForWeek
      },
      {
        label: t ? t('dashboard.progress.active_challenges', { defaultValue: 'Desafíos activos' }) : 'Desafíos activos',
        percentage: `${data.weeklyProgress.activeChallenges}/${data.weeklyProgress.totalChallenges}`,
        width: data.weeklyProgress.totalChallenges > 0 ? 
          `${(data.weeklyProgress.activeChallenges / data.weeklyProgress.totalChallenges) * 100}%` : '0%',
        color: 'bg-blue-500',
        count: data.weeklyProgress.activeChallenges,
        total: data.weeklyProgress.totalChallenges
      }
    ];
  }, [data.weeklyProgress]);

  // Función para crear un hábito
  const handleCreateHabit = useCallback(async (habitData: {
    name: string;
    description?: string;
    category: string;
    target_frequency: number;
    target_unit: string;
    icon: string;
    color: string;
  }): Promise<boolean> => {
    try {
      const success = await createHabit(habitData);
      if (success) {
        // Recargar hábitos y estadísticas
        await loadDashboardData();
      }
      return success;
    } catch (error) {
      console.error('Error creando hábito:', error);
      return false;
    }
  }, [loadDashboardData]);

  return {
    ...data,
    completeHabit: handleCompleteHabit,
    createHabit: handleCreateHabit,
    toggleHabit,
    refresh,
    getFormattedStats,
    getFormattedWeeklyProgress
  };
};
