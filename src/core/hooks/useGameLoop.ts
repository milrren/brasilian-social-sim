import { useState, useEffect, useCallback } from 'react';
import { PlayerState } from '../types';
import { processTick } from '../state/tick';
import { TICK_RATE_MS } from '../constants';
import {
  loadGameState,
  OfflineProgressSummary,
  useLocalStoragePersistence,
} from '../../app/hooks/useLocalStoragePersistence';

const defaultState: PlayerState = {
  money: 0,
  energy: 100,
  currentJobId: null, // Começa desempregado
  completedCourses: [],
  activeLifeUpgrades: [],
};

export const useGameLoop = () => {
  const [state, setState] = useState<PlayerState>(defaultState);
  const [offlineProgressSummary, setOfflineProgressSummary] = useState<OfflineProgressSummary | null>(null);

  useEffect(() => {
    const savedResult = loadGameState();
    if (savedResult) {
      setState(savedResult.state);
      setOfflineProgressSummary(savedResult.offlineSummary);
    }
  }, []);

  // Persistência automática do estado
  useLocalStoragePersistence(state);

  // O Relógio da Vida
  useEffect(() => {
    const timer = setInterval(() => {
      // Como processTick é uma função (PlayerState) => PlayerState,
      // podemos passar direto para o setState do React!
      setState(processTick);
    }, TICK_RATE_MS);
    
    return () => clearInterval(timer);
  }, []);

  // Despachante genérico para injetar nossas actions do Ramda
  const dispatch = useCallback((actionFn: (s: PlayerState) => PlayerState) => {
    setState((prevState) => actionFn(prevState));
  }, []);

  const dismissOfflineProgressSummary = useCallback(() => {
    setOfflineProgressSummary(null);
  }, []);

  return { state, dispatch, offlineProgressSummary, dismissOfflineProgressSummary };
};
