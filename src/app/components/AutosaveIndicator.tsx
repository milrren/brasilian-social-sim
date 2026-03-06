import { useAutosaveIndicator } from '../hooks/useAutosaveIndicator';

export function AutosaveIndicator() {
  const wasJustSaved = useAutosaveIndicator();

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      <div
        className={`h-9 w-9 rounded-full border border-gray-500/60 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
          wasJustSaved ? 'opacity-90' : 'opacity-45'
        }`}
        aria-label="Indicador de autosave"
        title="Autosave"
      >
        <span
          className={`text-sm transition-transform duration-500 ${
            wasJustSaved ? 'animate-spin scale-110' : 'scale-100'
          }`}
        >
          💾
        </span>
      </div>
    </div>
  );
}
