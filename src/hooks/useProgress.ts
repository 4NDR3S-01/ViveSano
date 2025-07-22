// ====================================
// HOOK PERSONALIZADO - PROGRESS
// ====================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getWeeklyProgressData,
  getMonthlyProgressData,
  getRecentActivity
} from '@/services/dashboardService';

// ====================================
// INTERFACES LOCALES
// ====================================

interface ProgressData {
  weeklyData: any[];
  monthlyData: any[];
  recentActivity: any[];
  isLoading: boolean;
  error: string | null;
}

// ====================================
// HOOK PRINCIPAL
// ====================================

export const useProgress = () => {
  // Estados
  const [data, setData] = useState<ProgressData>({
    weeklyData: [],
    monthlyData: [],
    recentActivity: [],
    isLoading: true,
    error: null
  });

  // Función para cargar todos los datos de progreso
  const loadProgressData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Cargar datos en paralelo
      const [weekly, monthly, activity] = await Promise.all([
        getWeeklyProgressData(),
        getMonthlyProgressData(),
        getRecentActivity()
      ]);

      setData({
        weeklyData: weekly,
        monthlyData: monthly,
        recentActivity: activity,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Error cargando datos de progreso:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }));
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  // Función para refrescar datos
  const refresh = useCallback(async () => {
    await loadProgressData();
  }, [loadProgressData]);

  return {
    ...data,
    refresh
  };
};
