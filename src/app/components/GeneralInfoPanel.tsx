import { OFFLINE_PROGRESS_MULTIPLIER, JOBS } from '../../core/constants';
import { getEnergyBalancePerTick, getEnergyBreakdownPerTick, getIncomePerTick, getNetProgressPerTick } from '../../core/state/economy';
import { getCostOfLivingBreakdown } from '../../core/state/lifeUpgrades';
import { PlayerState } from '../../core/types';

interface GeneralInfoPanelProps {
  state: PlayerState;
}

function formatSignedCurrency(value: number) {
  if (value > 0) return `+R$ ${value.toFixed(2)}/s`;
  if (value < 0) return `-R$ ${Math.abs(value).toFixed(2)}/s`;
  return 'R$ 0.00/s';
}

function formatSignedNumber(value: number, suffix: string) {
  if (value > 0) return `+${value}${suffix}`;
  if (value < 0) return `-${Math.abs(value)}${suffix}`;
  return `0${suffix}`;
}

export function GeneralInfoPanel({ state }: GeneralInfoPanelProps) {
  const incomePerTick = getIncomePerTick(state);
  const netProgressPerTick = getNetProgressPerTick(state);
  const energyBalancePerTick = getEnergyBalancePerTick(state);
  const energyBreakdown = getEnergyBreakdownPerTick(state);
  const costBreakdown = getCostOfLivingBreakdown(state);

  const currentJob = state.currentJobId ? JOBS[state.currentJobId] : null;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-300 text-sm leading-relaxed mb-1">
        Visão detalhada do seu progresso por segundo e dos componentes que afetam sua evolução.
      </p>

      <section className="bg-gray-800/70 border-2 border-gray-700 rounded-lg p-4 space-y-2">
        <h3 className="text-yellow-400 font-bold text-lg">Resumo por segundo</h3>
        <div className="text-sm text-gray-200 space-y-1">
          <p className="flex justify-between"><span>Ganhos (trabalho):</span><span className="text-green-400 font-bold">{formatSignedCurrency(incomePerTick)}</span></p>
          <p className="flex justify-between"><span>Custo de vida total:</span><span className="text-red-400 font-bold">-R$ {costBreakdown.total.toFixed(2)}/s</span></p>
          <p className="flex justify-between border-t border-gray-700 pt-2 mt-2"><span>Progresso líquido:</span><span className={`font-bold ${netProgressPerTick >= 0 ? 'text-green-300' : 'text-red-300'}`}>{formatSignedCurrency(netProgressPerTick)}</span></p>
        </div>
      </section>

      <section className="bg-gray-800/70 border-2 border-gray-700 rounded-lg p-4 space-y-2">
        <h3 className="text-yellow-400 font-bold text-lg">Energia detalhada</h3>
        <div className="text-sm text-gray-200 space-y-1">
          <p className="flex justify-between"><span>Recuperação base:</span><span className="text-blue-300 font-bold">+{energyBreakdown.baseRegen} ⚡/s</span></p>
          <p className="flex justify-between"><span>Bônus de melhorias:</span><span className="text-blue-200 font-bold">+{energyBreakdown.regenBonusFromUpgrades} ⚡/s</span></p>
          <p className="flex justify-between"><span>Consumo do trabalho:</span><span className="text-orange-300 font-bold">-{energyBreakdown.drain} ⚡/s</span></p>
          <p className="flex justify-between border-t border-gray-700 pt-2 mt-2"><span>Balanço de energia:</span><span className={`font-bold ${energyBalancePerTick >= 0 ? 'text-blue-300' : 'text-orange-300'}`}>{formatSignedNumber(energyBalancePerTick, ' ⚡/s')}</span></p>
        </div>
      </section>

      <section className="bg-gray-800/70 border-2 border-gray-700 rounded-lg p-4 space-y-2">
        <h3 className="text-yellow-400 font-bold text-lg">Custos detalhados</h3>
        <div className="text-sm text-gray-200 space-y-1">
          <p className="flex justify-between"><span>Custo base:</span><span className="text-red-400">-R$ {costBreakdown.base.toFixed(2)}/s</span></p>
          {costBreakdown.upgrades.length > 0 ? (
            costBreakdown.upgrades.map((upgrade) => (
              <p key={upgrade.id} className="flex justify-between"><span>{upgrade.name}:</span><span className="text-red-300">-R$ {upgrade.additionalCostOfLivingPerTick.toFixed(2)}/s</span></p>
            ))
          ) : (
            <p className="text-gray-400">Nenhuma melhoria ativa impactando custo de vida.</p>
          )}
          <p className="flex justify-between border-t border-gray-700 pt-2 mt-2"><span>Total em melhorias:</span><span className="text-red-300">-R$ {costBreakdown.upgradesCost.toFixed(2)}/s</span></p>
        </div>
      </section>

      <section className="bg-gray-800/70 border-2 border-gray-700 rounded-lg p-4 space-y-2">
        <h3 className="text-yellow-400 font-bold text-lg">Estado atual</h3>
        <div className="text-sm text-gray-200 space-y-1">
          <p className="flex justify-between"><span>Emprego atual:</span><span className="text-green-300">{currentJob ? currentJob.name : 'Desempregado'}</span></p>
          <p className="flex justify-between"><span>Salário por segundo:</span><span className="text-green-400">R$ {incomePerTick.toFixed(2)}/s</span></p>
          <p className="flex justify-between"><span>Multiplicador offline:</span><span className="text-blue-300">{(OFFLINE_PROGRESS_MULTIPLIER * 100).toFixed(0)}%</span></p>
        </div>
      </section>
    </div>
  );
}
