import { useEffect } from 'react';
import { OfflineProgressSummary } from '../hooks/useLocalStoragePersistence';

interface OfflineProgressNoticeProps {
  summary: OfflineProgressSummary | null;
  onClose: () => void;
}

function formatSignedValue(value: number, prefix = '') {
  if (value > 0) return `+${prefix}${value.toFixed(2)}`;
  if (value < 0) return `-${prefix}${Math.abs(value).toFixed(2)}`;
  return `${prefix}0.00`;
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

export function OfflineProgressNotice({ summary, onClose }: OfflineProgressNoticeProps) {
  useEffect(() => {
    if (!summary) return;

    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [summary, onClose]);

  if (!summary) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <div className="bg-gray-900/95 border-2 border-yellow-500/70 rounded-lg shadow-xl px-4 py-3 text-white min-w-[280px]">
        <div className="flex items-center justify-between gap-4 mb-2">
          <p className="font-bold text-yellow-400">Retorno Offline</p>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-sm font-bold"
            aria-label="Fechar aviso de progresso offline"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-gray-300 mb-2">
          Você ficou fora por {formatDuration(summary.elapsedSeconds)} (20% aplicado)
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <p className="text-green-300">💰 {formatSignedValue(summary.moneyDelta, 'R$ ')}</p>
          <p className="text-blue-300">⚡ {formatSignedValue(summary.energyDelta)}</p>
        </div>
      </div>
    </div>
  );
}
