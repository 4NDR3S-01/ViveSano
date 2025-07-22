// ====================================
// HOOK PERSONALIZADO - CHALLENGES
// ====================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getAvailableChallenges,
  getUserChallenges,
  joinChallenge,
  leaveChallenge,
  updateChallengeProgress
} from '@/services/dashboardService';

// ====================================
// INTERFACES LOCALES
// ====================================

interface ChallengesData {
  availableChallenges: any[];
  userChallenges: any[];
  isLoading: boolean;
  error: string | null;
}

// ====================================
// HOOK PRINCIPAL
// ====================================

export const useChallenges = () => {
  // Estados
  const [data, setData] = useState<ChallengesData>({
    availableChallenges: [],
    userChallenges: [],
    isLoading: true,
    error: null
  });

  // Función para cargar todos los desafíos
  const loadChallenges = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Cargar datos en paralelo
      const [available, userChallenges] = await Promise.all([
        getAvailableChallenges(),
        getUserChallenges()
      ]);

      setData({
        availableChallenges: available,
        userChallenges: userChallenges,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Error cargando desafíos:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }));
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  // Función para unirse a un desafío
  const handleJoinChallenge = useCallback(async (challengeId: string): Promise<boolean> => {
    try {
      const success = await joinChallenge(challengeId);
      if (success) {
        // Recargar desafíos para actualizar estado
        await loadChallenges();
      }
      return success;
    } catch (error) {
      console.error('Error uniéndose al desafío:', error);
      return false;
    }
  }, [loadChallenges]);

  // Función para dejar un desafío
  const handleLeaveChallenge = useCallback(async (challengeId: string): Promise<boolean> => {
    try {
      const success = await leaveChallenge(challengeId);
      if (success) {
        // Recargar desafíos para actualizar estado
        await loadChallenges();
      }
      return success;
    } catch (error) {
      console.error('Error abandonando desafío:', error);
      return false;
    }
  }, [loadChallenges]);

  // Función para actualizar progreso de desafío
  const handleUpdateProgress = useCallback(async (challengeId: string, progressIncrement: number = 1): Promise<boolean> => {
    console.log('useChallenges - handleUpdateProgress llamado:', challengeId, progressIncrement);
    
    try {
      const success = await updateChallengeProgress(challengeId, progressIncrement);
      console.log('useChallenges - updateChallengeProgress resultado:', success);
      
      if (success) {
        console.log('useChallenges - Recargando desafíos...');
        // Recargar desafíos para actualizar progreso
        await loadChallenges();
        console.log('useChallenges - Desafíos recargados');
      }
      return success;
    } catch (error) {
      console.error('Error actualizando progreso de desafío:', error);
      return false;
    }
  }, [loadChallenges]);

  // Función para refrescar datos
  const refresh = useCallback(async () => {
    await loadChallenges();
  }, [loadChallenges]);

  // Función para obtener desafíos disponibles (que no está participando el usuario)
  const getAvailableToJoin = useCallback(() => {
    const userChallengeIds = data.userChallenges
      .filter(uc => uc.is_active)
      .map(uc => uc.challenge_id);
    
    return data.availableChallenges.filter(challenge => 
      !userChallengeIds.includes(challenge.id)
    );
  }, [data.availableChallenges, data.userChallenges]);

  // Función para obtener desafíos activos del usuario
  const getActiveChallenges = useCallback(() => {
    return data.userChallenges.filter(uc => uc.is_active);
  }, [data.userChallenges]);

  // Función para obtener desafíos completados del usuario
  const getCompletedChallenges = useCallback(() => {
    return data.userChallenges.filter(uc => uc.completed_at);
  }, [data.userChallenges]);

  return {
    ...data,
    joinChallenge: handleJoinChallenge,
    leaveChallenge: handleLeaveChallenge,
    updateProgress: handleUpdateProgress,
    refresh,
    getAvailableToJoin,
    getActiveChallenges,
    getCompletedChallenges
  };
};
