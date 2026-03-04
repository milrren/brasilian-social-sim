"use client";

import { useGameLoop } from '../core/hooks/useGameLoop';
import { fazerBico, assinarCarteira, fazerCurso } from '../core/state/actions';
import { JOBS, COURSES, BICO_ENERGY_COST, BICO_REWARD, COST_OF_LIVING_PER_TICK } from '../core/constants';

export default function OCorreApp() {
  const { state, dispatch } = useGameLoop();

  // Garante que array de cursos exista (caso o initial state demore a hidratar)
  const completedCourses = state.completedCourses || [];

  // Derivando dados para a UI
  const isEmployed = state.currentJobId !== null;
  const currentJob = isEmployed ? JOBS[state.currentJobId!] : null;
  const canDoBico = state.energy >= BICO_ENERGY_COST;

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8 font-mono flex flex-col items-center">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        
        {/* CABEÇALHO */}
        <header className="mb-8 border-b border-gray-600 pb-4">
          <h1 className="text-2xl font-bold text-yellow-400 mb-2">O Corre: Sobrevivendo ao Brasil</h1>
          <div className="flex justify-between text-lg">
            <span className="text-green-400">Saldo: R$ {state.money.toFixed(2)}</span>
            <span className="text-blue-400">Energia: ⚡ {state.energy}/100</span>
          </div>
          <p className="text-sm text-red-400 mt-1">Custo de Vida: -R$ {COST_OF_LIVING_PER_TICK}/seg</p>
        </header>

        {/* STATUS ATUAL */}
        <section className="mb-8">
          <h2 className="text-xl text-gray-300 mb-2">Status Atual</h2>
          
          {/* Emprego */}
          {isEmployed ? (
            <div className="bg-green-900/30 p-4 rounded border border-green-700 mb-2">
              <p className="font-bold text-green-300">🏢 Cargo: {currentJob?.name}</p>
              <p className="text-sm">Renda: +R$ {currentJob?.salaryPerTick}/seg</p>
              <p className="text-sm text-yellow-500">Fadiga: -⚡ {currentJob?.energyCostPerTick}/seg</p>
            </div>
          ) : (
            <div className="bg-red-900/30 p-4 rounded border border-red-700 mb-2">
              <p className="font-bold text-red-300">⚠️ Desempregado</p>
              <p className="text-sm">Sobrevivendo de bicos.</p>
            </div>
          )}

          {/* Currículo */}
          <div className="bg-gray-700/50 p-4 rounded border border-gray-600">
            <p className="font-bold text-blue-300 mb-1">🎓 Currículo:</p>
            {completedCourses.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-300">
                {completedCourses.map(id => (
                  <li key={id}>{COURSES[id]?.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Nenhum curso concluído.</p>
            )}
          </div>
        </section>

        {/* O CORRE MANUAL */}
        <section className="mb-8">
          <h2 className="text-xl text-gray-300 mb-2">Ação Rápida</h2>
          <button
            onClick={() => dispatch(fazerBico)}
            disabled={!canDoBico}
            className={`w-full py-3 px-4 rounded font-bold transition-colors ${
              canDoBico 
                ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Fazer Bico (Vender Brigadeiro)
            <span className="block text-xs font-normal mt-1">
              Ganha R$ {BICO_REWARD} | Custa ⚡ {BICO_ENERGY_COST}
            </span>
          </button>
        </section>

        {/* EDUCAÇÃO (SENAI / CURSOS) */}
        <section className="mb-8">
          <h2 className="text-xl text-gray-300 mb-2">Educação e Qualificação</h2>
          <div className="flex flex-col gap-2">
            {Object.values(COURSES).map(course => {
              const isCompleted = completedCourses.includes(course.id);
              const canAfford = state.money >= course.cost && state.energy >= course.energyCost;
              
              return (
                <button
                  key={course.id}
                  onClick={() => dispatch(fazerCurso(course.id))}
                  disabled={isCompleted || !canAfford}
                  className={`w-full py-2 px-3 rounded text-left transition-colors border ${
                    isCompleted 
                      ? 'bg-gray-800 border-green-500 text-gray-400 cursor-not-allowed'
                      : canAfford
                        ? 'bg-indigo-900 border-indigo-500 hover:bg-indigo-800 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <div className="font-bold flex justify-between">
                    <span>{course.name}</span>
                    {isCompleted && <span className="text-green-500 text-sm">✓ Concluído</span>}
                  </div>
                  {!isCompleted && (
                    <div className="text-xs mt-1">
                      Custo: R$ {course.cost} | Energia exigida: ⚡ {course.energyCost}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* MERCADO DE TRABALHO */}
        <section>
          <h2 className="text-xl text-gray-300 mb-2">Mercado de Trabalho</h2>
          <div className="flex flex-col gap-2">
            {Object.values(JOBS).map(job => {
              const isCurrentJob = state.currentJobId === job.id;
              const hasRequirements = job.requiredCourses.every(req => completedCourses.includes(req));
              const canAffordUpfront = state.money >= job.upfrontCost;
              const canHire = !isCurrentJob && hasRequirements && canAffordUpfront;

              return (
                <div key={job.id} className="p-3 border border-gray-600 rounded bg-gray-800 text-sm">
                  <div className="font-bold text-gray-200 text-base mb-1">{job.name}</div>
                  <div className="grid grid-cols-2 gap-1 text-gray-400 mb-2">
                    <span>Renda: R$ {job.salaryPerTick}/seg</span>
                    <span>Fadiga: ⚡ {job.energyCostPerTick}/seg</span>
                    <span className="col-span-2 text-yellow-500">
                      Custo da Entrevista: R$ {job.upfrontCost}
                    </span>
                  </div>
                  
                  {job.requiredCourses.length > 0 && (
                    <div className="mb-2 text-xs">
                      <span className="font-bold text-blue-300">Requisitos: </span>
                      {job.requiredCourses.map(req => {
                        const hasCourse = completedCourses.includes(req);
                        return (
                          <span key={req} className={hasCourse ? 'text-green-400' : 'text-red-400'}>
                            {COURSES[req]?.name} {hasCourse ? '✓' : '✗'}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  <button
                    onClick={() => dispatch(assinarCarteira(job.id))}
                    disabled={!canHire}
                    className={`w-full py-2 px-4 rounded font-bold transition-colors mt-2 ${
                      isCurrentJob
                        ? 'bg-green-800 text-green-300 cursor-not-allowed'
                        : canHire
                          ? 'bg-green-600 hover:bg-green-500 text-white'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isCurrentJob 
                      ? 'Cargo Atual' 
                      : !hasRequirements 
                        ? 'Faltam Requisitos' 
                        : !canAffordUpfront 
                          ? 'Falta Dinheiro pra Entrevista' 
                          : 'Ir para Entrevista!'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </main>
  );
}