import { useState, useEffect, useCallback } from 'react';
import { PlayerState } from '../types';
import { processTick } from '../state/tick';
import { TICK_RATE_MS } from '../constants';

const initialState: PlayerState = {
  money: 0,
  energy: 100,
  currentJobId: null, // Começa desempregado
  completedCourses: []
};

export const useGameLoop = () => {
  const [state, setState] = useState<PlayerState>(initialState);

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

  return { state, dispatch };
};
