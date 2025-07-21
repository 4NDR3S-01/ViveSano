// ====================================
// SERVICIOS DE BASE DE DATOS - DASHBOARD
// ====================================

import { supabase } from '../supabaseClient';

export interface UserStats {
  user_id: string;
  total_points: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  habits_completed_today: number;
  habits_total_active: number;
  total_habits: number;
  active_challenges: number;
  updated_at: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  target_frequency: number;
  target_unit: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface HabitWithProgress extends Habit {
  isCompletedToday: boolean;
  todayAmount: number;
  progressPercentage: number;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string;
  completed_amount: number;
  notes?: string;
  habit: Habit;
}

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  icon: string;
  points_reward: number;
  duration_days: number;
  difficulty: string;
  is_active: boolean;
}

export interface UserChallenge {
  id: string;
  challenge_id: string;
  started_at: string;
  completed_at?: string;
  is_completed: boolean;
  progress: number;
  points_earned: number;
  challenge: Challenge;
}

// ====================================
// FUNCIONES DEL DASHBOARD
// ====================================

/**
 * Obtener estadísticas del usuario para el dashboard
 */
export interface WeeklyProgress {
  habitsCompletedPercentage: number;
  habitsCompletedCount: number;
  totalHabitsForWeek: number;
  activeChallenges: number;
  totalChallenges: number;
}

// Función para obtener el progreso semanal
export const getWeeklyProgress = async (): Promise<WeeklyProgress> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuario no autenticado');

  // Obtener fecha de inicio de la semana (lunes)
  const today = new Date();
  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Lunes como inicio de semana
  startOfWeek.setDate(today.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Obtener hábitos activos del usuario
  const { data: habits, error: habitsError } = await supabase
    .from('habits')
    .select('id, target_frequency')
    .eq('user_id', user.id)
    .eq('is_active', true);

  if (habitsError) throw new Error(`Error al obtener hábitos: ${habitsError.message}`);

  // Calcular total de hábitos esperados para la semana
  const totalHabitsForWeek = habits?.reduce((total, habit) => total + (habit.target_frequency * 7), 0) || 0;

  // Obtener logs completados esta semana
  const { data: completedLogs, error: logsError } = await supabase
    .from('habit_logs')
    .select('id')
    .eq('user_id', user.id)
    .gte('completed_at', startOfWeek.toISOString())
    .lte('completed_at', endOfWeek.toISOString());

  if (logsError) throw new Error(`Error al obtener logs: ${logsError.message}`);

  const habitsCompletedCount = completedLogs?.length || 0;
  const habitsCompletedPercentage = totalHabitsForWeek > 0 ? 
    Math.round((habitsCompletedCount / totalHabitsForWeek) * 100) : 0;

  // Obtener desafíos activos
  const { data: activeChallenges, error: challengesError } = await supabase
    .from('user_challenges')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_active', true);

  if (challengesError) throw new Error(`Error al obtener desafíos: ${challengesError.message}`);

  // Obtener total de desafíos disponibles
  const { data: totalChallengesData, error: totalChallengesError } = await supabase
    .from('challenges')
    .select('id')
    .eq('is_active', true);

  if (totalChallengesError) throw new Error(`Error al obtener total de desafíos: ${totalChallengesError.message}`);

  return {
    habitsCompletedPercentage,
    habitsCompletedCount,
    totalHabitsForWeek,
    activeChallenges: activeChallenges?.length || 0,
    totalChallenges: totalChallengesData?.length || 0
  };
};

export const getUserStats = async (): Promise<UserStats> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error obteniendo usuario:', authError);
      // Retornar estadísticas por defecto para usuario no autenticado
      return {
        user_id: '',
        total_points: 0,
        current_level: 1,
        current_streak: 0,
        longest_streak: 0,
        habits_completed_today: 0,
        habits_total_active: 0,
        total_habits: 0,
        active_challenges: 0,
        updated_at: new Date().toISOString()
      };
    }

    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error obteniendo estadísticas:', error);
      // Si no existen estadísticas, crear unas básicas
      if (error.code === 'PGRST116') {
        const defaultStats = {
          user_id: user.id,
          total_points: 0,
          current_level: 1,
          current_streak: 0,
          longest_streak: 0,
          habits_completed_today: 0,
          habits_total_active: 0,
          total_habits: 0,
          active_challenges: 0,
          updated_at: new Date().toISOString()
        };

        const { data: newStats, error: createError } = await supabase
          .from('user_stats')
          .insert(defaultStats)
          .select()
          .single();
        
        if (createError) {
          console.error('Error creando estadísticas:', createError);
          return defaultStats;
        }
        
        return newStats;
      }
      // Retornar estadísticas por defecto si hay otro error
      return {
        user_id: user.id,
        total_points: 0,
        current_level: 1,
        current_streak: 0,
        longest_streak: 0,
        habits_completed_today: 0,
        habits_total_active: 0,
        total_habits: 0,
        active_challenges: 0,
        updated_at: new Date().toISOString()
      };
    }

    // Agregar propiedades que pueden faltar y calcular desafíos activos
    const { data: activeChallengesData, error: challengesError } = await supabase
      .from('user_challenges')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (challengesError) {
      console.warn('Error obteniendo desafíos activos:', challengesError);
    }

    return {
      ...data,
      total_habits: data.habits_total_active || 0,
      active_challenges: activeChallengesData?.length || 0
    };
  } catch (error) {
    console.error('Error inesperado obteniendo estadísticas:', error);
    return {
      user_id: '',
      total_points: 0,
      current_level: 1,
      current_streak: 0,
      longest_streak: 0,
      habits_completed_today: 0,
      habits_total_active: 0,
      total_habits: 0,
      active_challenges: 0,
      updated_at: new Date().toISOString()
    };
  }
}

/**
 * Obtener hábitos activos del usuario con progreso
 */
export async function getUserHabits(): Promise<HabitWithProgress[]> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error obteniendo usuario:', authError);
      return [];
    }

    const { data: habits, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo hábitos:', error);
      return [];
    }

    if (!habits) return [];

    // Obtener logs de hoy para verificar completados
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD
    
    const { data: todayLogs, error: logsError } = await supabase
      .from('habit_logs')
      .select('habit_id, completed_amount')
      .eq('user_id', user.id)
      .eq('date', todayString); // Usar date en lugar de completed_at

    if (logsError) {
      console.error('Error obteniendo logs de hoy:', logsError);
    }

    // Mapear hábitos con progreso
    const habitsWithProgress: HabitWithProgress[] = habits.map(habit => {
      const todayLog = todayLogs?.find(log => log.habit_id === habit.id);
      const todayAmount = todayLog?.completed_amount || 0;
      const isCompletedToday = todayAmount >= habit.target_frequency;
      const progressPercentage = habit.target_frequency > 0 ? 
        Math.min((todayAmount / habit.target_frequency) * 100, 100) : 0;

      return {
        ...habit,
        isCompletedToday,
        todayAmount,
        progressPercentage
      };
    });

    return habitsWithProgress;
  } catch (error) {
    console.error('Error inesperado obteniendo hábitos:', error);
    return [];
  }
}

/**
 * Obtener logs de hábitos de hoy
 */
export async function getTodayHabitLogs(): Promise<HabitLog[]> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error obteniendo usuario:', authError);
      return [];
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { data, error } = await supabase
      .from('habit_logs')
      .select(`
        *,
        habit:habits(*)
      `)
      .eq('user_id', user.id)
      .eq('date', today);

    if (error) {
      console.error('Error obteniendo logs de hoy:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error inesperado obteniendo logs de hoy:', error);
    return [];
  }
}

/**
 * Completar un hábito (crear o actualizar log)
 */
export async function completeHabit(habitId: string, amount: number = 1, notes?: string): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error obteniendo usuario:', authError);
      return false;
    }

    const today = new Date().toISOString().split('T')[0];

    // Verificar si ya existe un log para hoy
    const { data: existingLog } = await supabase
      .from('habit_logs')
      .select('id, completed_amount')
      .eq('habit_id', habitId)
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (existingLog) {
      // Incrementar el log existente en lugar de reemplazarlo
      const newAmount = existingLog.completed_amount + amount;
      const { error } = await supabase
        .from('habit_logs')
        .update({ 
          completed_amount: newAmount,
          notes: notes || null,
          completed_at: new Date().toISOString()
        })
        .eq('id', existingLog.id);

      if (error) {
        console.error('Error actualizando hábito:', error);
        return false;
      }
    } else {
      // Crear nuevo log
      const { error } = await supabase
        .from('habit_logs')
        .insert({
          habit_id: habitId,
          user_id: user.id,
          date: today,
          completed_amount: amount,
          notes: notes || null,
          completed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error completando hábito:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error inesperado completando hábito:', error);
    return false;
  }
}

/**
 * Obtener desafíos disponibles
 */
export async function getAvailableChallenges(): Promise<Challenge[]> {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_active', true)
      .order('difficulty', { ascending: true });

    if (error) {
      console.error('Error obteniendo desafíos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error inesperado obteniendo desafíos:', error);
    return [];
  }
}

/**
 * Obtener desafíos del usuario
 */
export async function getUserChallenges(): Promise<UserChallenge[]> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error obteniendo usuario:', authError);
      return [];
    }

    const { data, error } = await supabase
      .from('user_challenges')
      .select(`
        *,
        challenge:challenges(*)
      `)
      .eq('user_id', user.id)
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo desafíos del usuario:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error inesperado obteniendo desafíos del usuario:', error);
    return [];
  }
}

/**
 * Crear un nuevo hábito
 */
export async function createHabit(habitData: {
  name: string;
  description?: string;
  category: string;
  target_frequency: number;
  target_unit: string;
  icon: string;
  color: string;
}): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error obteniendo usuario:', authError);
      return false;
    }

    const { error } = await supabase
      .from('habits')
      .insert({
        user_id: user.id,
        name: habitData.name,
        description: habitData.description || null,
        category: habitData.category,
        target_frequency: habitData.target_frequency,
        target_unit: habitData.target_unit,
        icon: habitData.icon,
        color: habitData.color,
        is_active: true
      });

    if (error) {
      console.error('Error creando hábito:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error inesperado creando hábito:', error);
    return false;
  }
}

/**
 * Eliminar un hábito (marcarlo como inactivo)
 */
export async function deleteHabit(habitId: string): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error obteniendo usuario:', authError);
      return false;
    }

    const { error } = await supabase
      .from('habits')
      .update({ is_active: false })
      .eq('id', habitId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error eliminando hábito:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error inesperado eliminando hábito:', error);
    return false;
  }
}

/**
 * Recalcular estadísticas del usuario
 */
export async function refreshUserStats(): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error obteniendo usuario:', authError);
      return false;
    }

    // Llamar función de base de datos para recalcular
    const { error } = await supabase.rpc('calculate_user_stats', {
      user_uuid: user.id
    });

    if (error) {
      console.error('Error recalculando estadísticas:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error inesperado recalculando estadísticas:', error);
    return false;
  }
}
