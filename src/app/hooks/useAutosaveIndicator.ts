import { useState, useEffect, useRef } from 'react';
import { AUTOSAVE_EVENT } from '../../core/persistence/useLocalStoragePersistence';

/**
 * Hook que monitora eventos de autosave e retorna se foi salvo recentemente
 */
export function useAutosaveIndicator() {
  const [wasJustSaved, setWasJustSaved] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleAutosave = () => {
      setWasJustSaved(true);

      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }

      hideTimerRef.current = setTimeout(() => {
        setWasJustSaved(false);
      }, 1200);
    };

    window.addEventListener(AUTOSAVE_EVENT, handleAutosave);

    return () => {
      window.removeEventListener(AUTOSAVE_EVENT, handleAutosave);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  return wasJustSaved;
}
