"use client";

import { useGameLoop } from '../core/hooks/useGameLoop';
import { fazerBico, assinarCarteira } from '../core/state/actions';
import { JOBS, BICO_ENERGY_COST, BICO_REWARD, COST_OF_LIVING_PER_TICK } from '../core/constants';

export default function OCorreApp() {
  const { state, dispatch } = useGameLoop();

  // Derivando dados para a UI baseados no estado puro
  const isEmployed = state.currentJobId !== null;
  const currentJob = isEmployed ? JOBS[state.currentJobId!] : null;
  const canDoBico = state.energy >= BICO_ENERGY_COST;

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8 font-mono flex flex-col items-center">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">

        {/* CABEÇALHO: Onde o filho chora e a mãe não vê */}
        <header className="mb-8 border-b border-gray-600 pb-4">
          <h1 className="text-2xl font-bold text-yellow-400 mb-2">Brasims: Sobrevivendo ao Brasil</h1>
          <div className="flex justify-between text-lg">
            <span className="text-green-400">Saldo: R$ {state.money.toFixed(2)}</span>
            <span className="text-blue-400">Energia: ⚡ {state.energy}/100</span>
          </div>
          <p className="text-sm text-red-400 mt-1">Custo de Vida: -R$ {COST_OF_LIVING_PER_TICK}/seg</p>
        </header>

        {/* STATUS: O que você é no momento? */}
        <section className="mb-8">
          <h2 className="text-xl text-gray-300 mb-2">Status Atual</h2>
          {isEmployed ? (
            <div className="bg-green-900/30 p-4 rounded border border-green-700">
              <p className="font-bold text-green-300">🏢 Empregado: {currentJob?.name}</p>
              <p className="text-sm">Renda: +R$ {currentJob?.salaryPerTick}/seg</p>
              <p className="text-sm text-yellow-500">Fadiga: -⚡ {currentJob?.energyCostPerTick}/seg</p>
            </div>
          ) : (
            <div className="bg-red-900/30 p-4 rounded border border-red-700">
              <p className="font-bold text-red-300">⚠️ Desempregado</p>
              <p className="text-sm">Sobrevivendo de bicos.</p>
            </div>
          )}
        </section>

        {/* AÇÕES: Onde o suor escorre */}
        <section className="flex flex-col gap-4">
          <button
            onClick={() => dispatch(fazerBico)}
            disabled={!canDoBico}
            className={`py-3 px-4 rounded font-bold transition-colors ${canDoBico
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
          >
            Fazer Bico (Vender Água)
            <span className="block text-xs font-normal">
              Ganha R$ {BICO_REWARD} | Custa ⚡ {BICO_ENERGY_COST}
            </span>
          </button>

          {!isEmployed && (
            <div className="mt-4 p-4 border border-gray-600 rounded bg-gray-800">
              <h3 className="text-gray-300 font-bold mb-2">Vagas Disponíveis</h3>
              {Object.values(JOBS).map(job => {
                const canAfford = state.money >= job.upfrontCost;
                return (
                  <button
                    key={job.id}
                    onClick={() => dispatch(assinarCarteira(job.id))}
                    disabled={!canAfford}
                    className={`w-full py-3 px-4 rounded font-bold transition-colors flex flex-col items-center ${canAfford
                        ? 'bg-green-700 hover:bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-70'
                      }`}
                  >
                    <span>Assinar Carteira: {job.name}</span>
                    <span className="text-xs font-normal mt-1">
                      {canAfford
                        ? 'Ir para entrevista!'
                        : `Faltam R$ ${(job.upfrontCost - state.money).toFixed(2)} para passagem e roupas`}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}