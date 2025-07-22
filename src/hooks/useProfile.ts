// ====================================
// HOOK PERSONALIZADO - PROFILE
// ====================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabaseClient';
import { getUserStats } from '@/services/dashboardService';

// ====================================
// INTERFACES LOCALES
// ====================================

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  date_of_birth: string | null;
  phone: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

interface ProfileStats {
  total_habits: number;
  habits_total_active: number;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  habits_completed_today: number;
  active_challenges: number;
  days_active: number;
  current_level: number;
}

interface ProfileData {
  profile: UserProfile | null;
  stats: ProfileStats | null;
  isLoading: boolean;
  error: string | null;
}

// ====================================
// HOOK PRINCIPAL
// ====================================

export const useProfile = () => {
  // Estados
  const [data, setData] = useState<ProfileData>({
    profile: null,
    stats: null,
    isLoading: true,
    error: null
  });

  // Función para cargar el perfil completo
  const loadProfile = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('No se pudo obtener la información del usuario');
      }

      // Cargar datos en paralelo
      const [profileData, statsData] = await Promise.all([
        loadUserProfile(user.id),
        getUserStats()
      ]);

      // Calcular días activos
      const daysActive = await calculateDaysActive(user.id);

      const enhancedStats = statsData ? {
        ...statsData,
        days_active: daysActive,
        longest_streak: statsData.current_streak // Por ahora, podemos usar current_streak como longest
      } : null;

      setData({
        profile: profileData,
        stats: enhancedStats,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Error cargando perfil:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }));
    }
  }, []);

  // Función para cargar perfil del usuario
  const loadUserProfile = async (userId: string): Promise<UserProfile> => {
    console.log('loadUserProfile - userId:', userId);
    
    // Obtener datos del usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error en autenticación:', authError);
      throw new Error('Usuario no autenticado');
    }

    console.log('Usuario autenticado:', user);

    // Intentar obtener perfil adicional de la tabla profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    console.log('Datos del perfil obtenidos:', profileData);
    console.log('Error del perfil:', profileError);

    // Si hay error pero no es de "no existe", lanzar error
    // Si es error de "no existe" (PGRST116), continuar sin profileData
    if (profileError && profileError.code !== 'PGRST116') {
      console.warn('Error obteniendo perfil adicional, continuando con datos de auth:', profileError);
    }

    // Crear perfil combinando datos de auth y profiles
    const profile = {
      id: user.id,
      email: user.email || '',
      first_name: profileData?.first_name || 
                  user.user_metadata?.first_name || 
                  user.user_metadata?.name?.split(' ')[0] ||
                  '',
      last_name: profileData?.last_name || 
                 user.user_metadata?.last_name || 
                 user.user_metadata?.name?.split(' ').slice(1).join(' ') ||
                 '',
      avatar_url: profileData?.avatar_url || user.user_metadata?.avatar_url || null,
      date_of_birth: profileData?.date_of_birth || null,
      phone: profileData?.phone || null,
      timezone: profileData?.timezone || 'UTC',
      created_at: user.created_at || new Date().toISOString(),
      updated_at: profileData?.updated_at || new Date().toISOString()
    };

    console.log('Perfil procesado:', profile);
    return profile;
  };

  // Función para calcular días activos
  const calculateDaysActive = async (userId: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('habit_logs')
        .select('date')
        .eq('user_id', userId);

      if (error || !data) return 0;

      // Contar días únicos con actividad
      const uniqueDays = new Set(data.map(log => log.date));
      return uniqueDays.size;
    } catch (error) {
      console.error('Error calculando días activos:', error);
      return 0;
    }
  };

  // Función para actualizar perfil
  const updateProfile = useCallback(async (updates: Partial<{
    first_name: string;
    last_name: string;
    phone: string;
    date_of_birth: string;
    timezone: string;
    avatar_url: string;
  }>): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('updateProfile - updates:', updates);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, message: 'Usuario no autenticado' };
      }

      // Validar datos básicos
      if (updates.first_name && updates.first_name.trim().length < 2) {
        return { success: false, message: 'El nombre debe tener al menos 2 caracteres' };
      }
      
      if (updates.last_name && updates.last_name.trim().length < 2) {
        return { success: false, message: 'El apellido debe tener al menos 2 caracteres' };
      }

      if (updates.phone && updates.phone.trim() && !/^\+?[\d\s\-\(\)]+$/.test(updates.phone.trim())) {
        return { success: false, message: 'Formato de teléfono inválido' };
      }

      if (updates.date_of_birth) {
        const birthDate = new Date(updates.date_of_birth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13 || age > 120) {
          return { success: false, message: 'Edad debe estar entre 13 y 120 años' };
        }
      }

      // Limpiar datos antes de guardar
      const cleanUpdates = {
        ...updates,
        first_name: updates.first_name?.trim(),
        last_name: updates.last_name?.trim(),
        phone: updates.phone?.trim() || null,
        updated_at: new Date().toISOString()
      };

      // Actualizar en la tabla profiles usando upsert (insert o update)
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          ...cleanUpdates
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Error actualizando perfil:', error);
        
        // Si la tabla no existe, intentar crearla o continuar sin ella
        if (error.code === '42P01') { // tabla no existe
          console.warn('Tabla profiles no existe');
          return { success: false, message: 'Error de configuración de la base de datos' };
        }
        
        // Error de validación de la base de datos
        if (error.code === '23505') { // duplicate key
          return { success: false, message: 'Ya existe un perfil con estos datos' };
        }
        
        return { success: false, message: error.message || 'Error desconocido al guardar' };
      }

      console.log('Perfil actualizado exitosamente');
      
      // Recargar datos
      await loadProfile();
      return { success: true, message: 'Perfil actualizado correctamente' };
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return { success: false, message: 'Error inesperado al actualizar el perfil' };
    }
  }, [loadProfile]);

  // Función para cambiar contraseña
  const changePassword = useCallback(async (newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Error cambiando contraseña:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      return false;
    }
  }, []);

  // Función para cerrar sesión
  const signOut = useCallback(async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error cerrando sesión:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      return false;
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Función para refrescar datos
  const refresh = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  return {
    ...data,
    updateProfile,
    changePassword,
    signOut,
    refresh
  };
};
