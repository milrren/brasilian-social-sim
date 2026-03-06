import { useEffect, useRef } from 'react';
import { PlayerState } from '../../core/types';

const STORAGE_KEY = 'brasims_game_state';
const AUTOSAVE_INTERVAL_MS = 15000; // Salva a cada 15 segundos

// Event customizado para notificar autosave
export const AUTOSAVE_EVENT = 'brasims:autosave';

/**
 * Verifica se estamos no browser
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function saveGameState(state: PlayerState) {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
export function loadGameState(): PlayerState | null {
  if (!isBrowser()) return null;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('[Load] Estado restaurado do localStorage:', parsed);
      return parsed as PlayerState;
    }
  } catch (error) {
    console.error('[Load] Erro ao carregar estado:', error);
  }
  return null;
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
