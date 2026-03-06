import { useEffect, useRef } from 'react';
import { PlayerState } from '../../core/types';
import {
  COST_OF_LIVING_PER_TICK,
  ENERGY_REGEN_PER_TICK,
  JOBS,
  MAX_ENERGY,
  OFFLINE_PROGRESS_MULTIPLIER,
  TICK_RATE_MS,
} from '../../core/constants';

const STORAGE_KEY = 'brasims_game_state';
const AUTOSAVE_INTERVAL_MS = 15000; // Salva a cada 15 segundos

// Event customizado para notificar autosave
export const AUTOSAVE_EVENT = 'brasims:autosave';

export interface OfflineProgressSummary {
  elapsedSeconds: number;
  effectiveTicks: number;
  moneyDelta: number;
  energyDelta: number;
}

export interface LoadGameStateResult {
  state: PlayerState;
  offlineSummary: OfflineProgressSummary | null;
}

interface PersistedGameState {
  version: 1;
  savedAt: number;
  state: PlayerState;
}

/**
 * Verifica se estamos no browser
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function isValidPlayerState(value: unknown): value is PlayerState {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as PlayerState;
  return (
    typeof candidate.money === 'number' &&
    typeof candidate.energy === 'number' &&
    (typeof candidate.currentJobId === 'string' || candidate.currentJobId === null) &&
    Array.isArray(candidate.completedCourses)
  );
}

function applyOfflineProgress(state: PlayerState, savedAt: number): LoadGameStateResult {
  const elapsedMs = Date.now() - savedAt;
  if (elapsedMs <= 0) {
    return { state, offlineSummary: null };
  }

  const elapsedTicks = Math.floor(elapsedMs / TICK_RATE_MS);
  const effectiveTicks = Math.floor(elapsedTicks * OFFLINE_PROGRESS_MULTIPLIER);
  if (effectiveTicks <= 0) {
    return { state, offlineSummary: null };
  }

  const job = state.currentJobId ? JOBS[state.currentJobId] : null;
  const moneyDeltaPerTick = (job?.salaryPerTick ?? 0) - COST_OF_LIVING_PER_TICK;
  const energyDeltaPerTick = ENERGY_REGEN_PER_TICK - (job?.energyCostPerTick ?? 0);

  const nextState: PlayerState = {
    ...state,
    money: Math.max(0, state.money + moneyDeltaPerTick * effectiveTicks),
    energy: Math.max(0, Math.min(MAX_ENERGY, state.energy + energyDeltaPerTick * effectiveTicks)),
  };

  return {
    state: nextState,
    offlineSummary: {
      elapsedSeconds: Math.floor(elapsedMs / 1000),
      effectiveTicks,
      moneyDelta: nextState.money - state.money,
      energyDelta: nextState.energy - state.energy,
    },
  };
}

function loadPersistedGameState(): PersistedGameState | null {
  if (!isBrowser()) return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;

    if (
      parsed &&
      typeof parsed === 'object' &&
      (parsed as PersistedGameState).version === 1 &&
      typeof (parsed as PersistedGameState).savedAt === 'number' &&
      isValidPlayerState((parsed as PersistedGameState).state)
    ) {
      return parsed as PersistedGameState;
    }

    // Compatibilidade com saves antigos (apenas PlayerState)
    if (isValidPlayerState(parsed)) {
      return {
        version: 1,
        savedAt: Date.now(),
        state: parsed,
      };
    }
  } catch (error) {
    console.error('[Load] Erro ao carregar estado:', error);
  }

  return null;
}

function saveGameState(state: PlayerState) {
  if (!isBrowser()) return;

  try {
    const payload: PersistedGameState = {
      version: 1,
      savedAt: Date.now(),
      state,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent(AUTOSAVE_EVENT));
  } catch (error) {
    console.error('[Autosave] Erro ao salvar estado:', error);
  }
}

/**
 * Hook para persistência automática do estado no localStorage
 * Salva o estado a cada intervalo definido
 */
export function useLocalStoragePersistence(state: PlayerState) {
  const latestStateRef = useRef(state);

  useEffect(() => {
    latestStateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!isBrowser()) return;

    // Intervalo estável: não reinicia a cada tick
    const saveInterval = setInterval(() => {
      saveGameState(latestStateRef.current);
    }, AUTOSAVE_INTERVAL_MS);

    const handleBeforeUnload = () => {
      saveGameState(latestStateRef.current);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(saveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}

/**
 * Carrega o estado salvo do localStorage
 * Retorna null se não houver save anterior
 */
export function loadGameState(): LoadGameStateResult | null {
  const persisted = loadPersistedGameState();
  if (!persisted) return null;

  const restoredResult = applyOfflineProgress(persisted.state, persisted.savedAt);
  console.log('[Load] Estado restaurado com progresso offline:', restoredResult.state);
  return restoredResult;
}

/**
 * Limpa o estado salvo (útil para reset do jogo)
 */
export function clearSavedGameState(): void {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[Clear] Estado salvo removido');
  } catch (error) {
    console.error('[Clear] Erro ao remover estado:', error);
  }
}
