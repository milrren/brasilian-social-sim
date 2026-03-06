import { PlayerState } from '../../core/types';
import { LIFE_UPGRADES } from '../../core/constants';
import { comprarMelhoriaVida } from '../../core/state/actions';

interface LifeUpgradesPanelProps {
  state: PlayerState;
  dispatch: (action: (s: PlayerState) => PlayerState) => void;
}

const CATEGORY_LABELS = {
  housing: 'Moradia',
  wellness: 'Saúde e Bem-estar',
  mobility: 'Mobilidade',
};

export function LifeUpgradesPanel({ state, dispatch }: LifeUpgradesPanelProps) {
  const activeUpgrades = state.activeLifeUpgrades || [];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-300 text-sm leading-relaxed mb-2">
        Invista em melhorias de vida para evoluir seu estilo de vida. Cada melhoria aumenta o custo de vida por segundo.
      </p>

      <div className="flex flex-col gap-3">
        {Object.values(LIFE_UPGRADES).map((upgrade) => {
          const isActive = activeUpgrades.includes(upgrade.id);
          const canAfford = state.money >= upgrade.upfrontCost;

          return (
            <div
              key={upgrade.id}
              className={`p-4 border-2 transition-all rounded-lg ${
                isActive
                  ? 'bg-green-950/60 border-green-700 opacity-70'
                  : canAfford
                    ? 'bg-purple-950/60 border-purple-600 hover:bg-purple-900/60 hover:border-purple-500'
                    : 'bg-gray-800/60 border-gray-700 opacity-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-purple-300">🏠 {upgrade.name}</h3>
                {isActive && <span className="text-green-400 font-bold text-sm">ATIVO</span>}
              </div>

              <p className="text-xs text-gray-400 mb-3">Categoria: {CATEGORY_LABELS[upgrade.category]}</p>

              <div className="text-sm text-gray-300 mb-3 space-y-1">
                <p className="flex justify-between items-center">
                  <span>💰 Investimento:</span>
                  <span className="text-yellow-400 font-bold whitespace-nowrap ml-2">R$ {upgrade.upfrontCost}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span>📉 Custo de vida:</span>
                  <span className="text-red-400 font-bold whitespace-nowrap ml-2">+R$ {upgrade.additionalCostOfLivingPerTick}/s</span>
                </p>
                {upgrade.backgroundAsset && (
                  <p className="text-xs text-blue-300">🖼️ Define novo visual de cenário</p>
                )}
              </div>

              {!isActive && (
                <button
                  onClick={() => dispatch(comprarMelhoriaVida(upgrade.id))}
                  disabled={!canAfford}
                  className={`w-full py-2 px-4 rounded font-bold transition-all border-2 ${
                    canAfford
                      ? 'bg-purple-600 border-purple-400 hover:bg-purple-500 active:translate-y-1 text-white cursor-pointer'
                      : 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Adquirir Melhoria' : 'Sem Recursos'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
