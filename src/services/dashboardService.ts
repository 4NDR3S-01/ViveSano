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

    // Recalcular estadísticas del usuario después de completar
    await refreshUserStats();

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
 * Unirse a un desafío
 */
export async function joinChallenge(challengeId: string): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error obteniendo usuario:', authError);
      return false;
    }

    // Verificar si ya está unido al desafío
    const { data: existingChallenge } = await supabase
      .from('user_challenges')
      .select('id')
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .eq('is_active', true)
      .single();

    if (existingChallenge) {
      console.log('Usuario ya está unido a este desafío');
      return false;
    }

    // Unirse al desafío
    const { error } = await supabase
      .from('user_challenges')
      .insert({
        user_id: user.id,
        challenge_id: challengeId,
        started_at: new Date().toISOString(),
        progress: 0,
        is_active: true
      });

    if (error) {
      console.error('Error uniéndose al desafío:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error inesperado uniéndose al desafío:', error);
    return false;
  }
}

/**
 * Dejar/abandonar un desafío
 */
export async function leaveChallenge(challengeId: string): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error obteniendo usuario:', authError);
      return false;
    }

    // Marcar el desafío como inactivo
    const { error } = await supabase
      .from('user_challenges')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId);

    if (error) {
      console.error('Error abandonando desafío:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error inesperado abandonando desafío:', error);
    return false;
  }
}

/**
 * Actualizar progreso de un desafío
 */
export async function updateChallengeProgress(challengeId: string, progressIncrement: number = 1): Promise<boolean> {
  try {
    console.log('updateChallengeProgress - challengeId:', challengeId, 'progressIncrement:', progressIncrement);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error obteniendo usuario:', authError);
      return false;
    }

    // Obtener progreso actual (sin incluir goal_value por ahora)
    const { data: currentChallenge, error: fetchError } = await supabase
      .from('user_challenges')
      .select('progress, completed_at')
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .eq('is_active', true)
      .single();

    console.log('currentChallenge obtenido:', currentChallenge);
    console.log('fetchError:', fetchError);

    if (fetchError || !currentChallenge) {
      console.error('Error obteniendo desafío actual:', fetchError);
      return false;
    }

    // Por ahora, usar un valor fijo de 100 como meta
    const goalValue = 100;
    const newProgress = Math.min(
      currentChallenge.progress + progressIncrement,
      goalValue
    );

    console.log('Progreso actual:', currentChallenge.progress);
    console.log('Meta del desafío:', goalValue);
    console.log('Nuevo progreso:', newProgress);

    // Verificar si se completó el desafío
    const isCompleted = newProgress >= goalValue;

    const updateData: any = {
      progress: newProgress
    };

    if (isCompleted && !currentChallenge.completed_at) {
      updateData.completed_at = new Date().toISOString();
      console.log('Desafío completado, agregando fecha de finalización');
    }

    // Actualizar progreso
    const { error } = await supabase
      .from('user_challenges')
      .update(updateData)
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId);

    if (error) {
      console.error('Error actualizando progreso del desafío:', error);
      return false;
    }

    // Recalcular estadísticas del usuario
    await refreshUserStats();

    console.log('Progreso actualizado exitosamente');
    return true;
  } catch (error) {
    console.error('Error inesperado actualizando progreso:', error);
    return false;
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

    // Recalcular estadísticas del usuario
    await refreshUserStats();

    return true;
  } catch (error) {
    console.error('Error inesperado creando hábito:', error);
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

// ====================================
// FUNCIONES DE PROGRESO HISTÓRICO
// ====================================

/**
 * Obtener progreso semanal detallado
 */
export async function getWeeklyProgressData(): Promise<any[]> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error obteniendo usuario:', authError);
      return [];
    }

    // Obtener datos de los últimos 7 días
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);

    const { data, error } = await supabase
      .from('habit_logs')
      .select(`
        date,
        completed_amount,
        habit:habits(target_frequency)
      `)
      .eq('user_id', user.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date');

    if (error) {
      console.error('Error obteniendo progreso semanal:', error);
      return [];
    }

    // Procesar datos por día
    const weeklyData = [];
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Calcular progreso del día
      const dayLogs = data?.filter(log => log.date === dateStr) || [];
      const totalProgress = dayLogs.reduce((sum, log) => {
        const target = (log.habit as any)?.target_frequency || 1;
        return sum + Math.min(log.completed_amount / target, 1);
      }, 0);
      
      const dayProgress = dayLogs.length > 0 ? (totalProgress / dayLogs.length) * 100 : 0;
      
      weeklyData.push({
        label: days[currentDate.getDay()],
        value: Math.round(dayProgress),
        date: dateStr
      });
    }

    return weeklyData;
  } catch (error) {
    console.error('Error inesperado obteniendo progreso semanal:', error);
    return [];
  }
}

/**
 * Obtener progreso mensual detallado
 */
export async function getMonthlyProgressData(): Promise<any[]> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error obteniendo usuario:', authError);
      return [];
    }

    // Obtener datos del mes actual por semanas
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const { data, error } = await supabase
      .from('habit_logs')
      .select(`
        date,
        completed_amount,
        habit:habits(target_frequency)
      `)
      .eq('user_id', user.id)
      .gte('date', startOfMonth.toISOString().split('T')[0])
      .lte('date', endOfMonth.toISOString().split('T')[0])
      .order('date');

    if (error) {
      console.error('Error obteniendo progreso mensual:', error);
      return [];
    }

    // Agrupar por semanas
    const monthlyData = [];
    const weeks = Math.ceil(endOfMonth.getDate() / 7);
    
    for (let week = 0; week < weeks; week++) {
      const weekStart = new Date(startOfMonth);
      weekStart.setDate(1 + (week * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekLogs = data?.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= weekStart && logDate <= weekEnd;
      }) || [];
      
      const totalProgress = weekLogs.reduce((sum, log) => {
        const target = (log.habit as any)?.target_frequency || 1;
        return sum + Math.min(log.completed_amount / target, 1);
      }, 0);
      
      const weekProgress = weekLogs.length > 0 ? (totalProgress / weekLogs.length) * 100 : 0;
      
      monthlyData.push({
        label: `S${week + 1}`,
        value: Math.round(weekProgress),
        weekStart: weekStart.toISOString().split('T')[0],
        weekEnd: weekEnd.toISOString().split('T')[0]
      });
    }

    return monthlyData;
  } catch (error) {
    console.error('Error inesperado obteniendo progreso mensual:', error);
    return [];
  }
}

/**
 * Obtener actividad reciente del usuario
 */
export async function getRecentActivity(): Promise<any[]> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error obteniendo usuario:', authError);
      return [];
    }

    // Obtener logs de hábitos recientes
    const { data: habitLogs, error: habitError } = await supabase
      .from('habit_logs')
      .select(`
        id,
        date,
        completed_amount,
        created_at,
        habit:habits(name, icon, target_frequency)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Obtener desafíos unidos recientemente
    const { data: challengeLogs, error: challengeError } = await supabase
      .from('user_challenges')
      .select(`
        id,
        started_at,
        challenge:challenges(title, icon)
      `)
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .limit(5);

    if (habitError) console.error('Error obteniendo logs de hábitos:', habitError);
    if (challengeError) console.error('Error obteniendo logs de desafíos:', challengeError);

    const activities: any[] = [];

    // Procesar logs de hábitos
    if (habitLogs) {
      habitLogs.forEach(log => {
        const habit = log.habit as any;
        const points = Math.min(log.completed_amount, habit.target_frequency) * 10;
        activities.push({
          id: `habit_${log.id}`,
          type: 'habit',
          action: `Completó hábito "${habit.name}"`,
          icon: habit.icon || '✅',
          points: `+${points}`,
          timestamp: log.created_at,
          time: formatRelativeTime(log.created_at)
        });
      });
    }

    // Procesar logs de desafíos
    if (challengeLogs) {
      challengeLogs.forEach(log => {
        const challenge = log.challenge as any;
        activities.push({
          id: `challenge_${log.id}`,
          type: 'challenge',
          action: `Se unió al desafío "${challenge.title}"`,
          icon: challenge.icon || '🎯',
          points: '+50',
          timestamp: log.started_at,
          time: formatRelativeTime(log.started_at)
        });
      });
    }

    // Ordenar por timestamp y limitar a 15 actividades
    activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return activities.slice(0, 15);

  } catch (error) {
    console.error('Error inesperado obteniendo actividad reciente:', error);
    return [];
  }
}

/**
 * Formatear tiempo relativo
 */
function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) {
      return 'Ahora mismo';
    }
    return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  } else if (diffInHours < 24) {
    return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    return date.toLocaleDateString();
  }
}

/**
 * Eliminar un hábito (marcado como inactivo para preservar datos históricos)
 */
export async function deleteHabit(habitId: string): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error obteniendo usuario:', authError);
      return false;
    }

    // Marcar el hábito como inactivo en lugar de eliminarlo
    const { error: updateError } = await supabase
      .from('habits')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', habitId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error eliminando hábito:', updateError);
      return false;
    }

    // Recalcular estadísticas del usuario
    await refreshUserStats();

    return true;
  } catch (error) {
    console.error('Error inesperado eliminando hábito:', error);
    return false;
  }
}
