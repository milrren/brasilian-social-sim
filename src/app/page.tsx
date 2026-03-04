"use client";

import { useState, useEffect, useRef } from 'react';
import { useGameLoop } from '../core/hooks/useGameLoop';
import { fazerBico, assinarCarteira, fazerCurso } from '../core/state/actions';
import { JOBS, COURSES, BICO_ENERGY_COST, BICO_REWARD, COST_OF_LIVING_PER_TICK } from '../core/constants';

export default function BrasimsApp() {
  const { state, dispatch } = useGameLoop();

  // Garante que array de cursos exista
  const completedCourses = state.completedCourses || [];

  // Derivando dados para a UI
  const isEmployed = state.currentJobId !== null;
  const currentJob = isEmployed ? JOBS[state.currentJobId!] : null;
  const canDoBico = state.energy >= BICO_ENERGY_COST;
  const currentIncome = currentJob ? currentJob.salaryPerTick : 0;

  const [isFlashing, setIsFlashing] = useState(false);

  const getRoomBackground = (income: number) => {
    if (income >= 8) return 'bg-[url("/assets/room-nice.png")] bg-cover bg-center';
    if (income > 0) return 'bg-[url("/assets/room-simple.png")] bg-cover bg-center';
    return 'bg-[url("/assets/room-perrengue.png")] bg-cover bg-center';
  };

  const activeLevel = currentIncome >= 8 ? 'APARTMENT' : currentIncome > 0 ? 'ORGANIZED' : 'PERRENGUE';

  const prevLevelRef = useRef(activeLevel);
  useEffect(() => {
    if (prevLevelRef.current !== activeLevel) {
      setIsFlashing(true);
      const timer = setTimeout(() => setIsFlashing(false), 100);
      prevLevelRef.current = activeLevel;
      return () => clearTimeout(timer);
    }
  }, [activeLevel]);

  const baseBgClass = "absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out";

  return (
    <main className="min-h-screen relative overflow-hidden font-mono selection:bg-yellow-500/30">

      {/* 1. O CENÁRIO (Background Visual - APENAS O FUNDO AGORA) */}
      <div className="absolute inset-0 bg-black">
        <div className={`${baseBgClass} bg-[url("/assets/room-perrengue.png")] ${activeLevel === 'PERRENGUE' ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`${baseBgClass} bg-[url("/assets/room-simple.png")] ${activeLevel === 'ORGANIZED' ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`${baseBgClass} bg-[url("/assets/room-nice.png")] ${activeLevel === 'APARTMENT' ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* O CLARÃO DIVINO DE LEVEL UP */}
        <div 
          className={`absolute inset-0 bg-yellow-100 mix-blend-overlay z-10 pointer-events-none transition-opacity duration-1000 ease-out ${
            isFlashing ? 'opacity-100' : 'opacity-0'
          }`} 
        />
        <div className="absolute inset-0 bg-black/60 pointer-events-none z-20" />
      </div>

      {/* 2. CAMADA DE UI (Overlays flutuantes) */}
      <div className="relative z-30 w-full h-full min-h-screen p-4 flex flex-col pointer-events-none">

        {/* TOP HUD: Informações Vitais */}
        <header className="pointer-events-auto bg-gray-900/90 backdrop-blur-sm border-4 border-gray-700 p-4 rounded-md shadow-lg flex flex-wrap gap-4 justify-between items-center text-white max-w-5xl mx-auto w-full">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-yellow-400 drop-shadow-md">Brasims</h1>
            <p className="text-xs text-red-400 mt-1">Custo: -R$ {COST_OF_LIVING_PER_TICK}/seg</p>
          </div>
          <div className="flex gap-4 sm:gap-8 text-lg sm:text-xl font-bold">
            <div className="bg-black/50 px-3 py-1 border-2 border-green-900 rounded text-green-400">
              R$ {state.money.toFixed(2)}
            </div>
            <div className="bg-black/50 px-3 py-1 border-2 border-blue-900 rounded text-blue-400">
              ⚡ {state.energy}/100
            </div>
          </div>
        </header>

        {/* ÁREA CENTRAL E INFERIOR (Grid Responsivo) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 md:grid-rows-[1fr_auto] gap-4 mt-4 w-full max-w-7xl mx-auto h-full pointer-events-none">

          {/* PAINEL ESQUERDO: Status do Personagem */}
          <aside className="pointer-events-auto w-full flex flex-col gap-4 order-1 md:col-start-1 md:row-start-1">
            <section className="bg-gray-900/90 backdrop-blur-sm border-4 border-gray-700 p-4 rounded-md text-white shadow-lg">
              <h2 className="text-lg text-gray-300 border-b-2 border-gray-600 pb-1 mb-3">Status Atual</h2>
              {isEmployed ? (
                <div className="bg-green-950/80 p-3 border-2 border-green-700 rounded mb-2">
                  <p className="font-bold text-green-300">🏢 {currentJob?.name}</p>
                  <p className="text-xs mt-2 text-green-200">+R$ {currentJob?.salaryPerTick}/seg</p>
                  <p className="text-xs text-yellow-500">-⚡ {currentJob?.energyCostPerTick}/seg</p>
                </div>
              ) : (
                <div className="bg-red-950/80 p-3 border-2 border-red-700 rounded mb-2 text-center animate-pulse">
                  <p className="font-bold text-red-400">⚠️ Desempregado</p>
                </div>
              )}

              <div className="bg-gray-800/80 p-3 border-2 border-gray-600 rounded mt-4">
                <p className="font-bold text-blue-300 mb-2">🎓 Currículo:</p>
                {completedCourses.length > 0 ? (
                  <ul className="list-disc list-inside text-xs text-gray-300">
                    {completedCourses.map(id => (
                      <li key={id}>{COURSES[id]?.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">Nenhum curso concluído.</p>
                )}
              </div>
            </section>
          </aside>

          {/* O AVATAR E O BOTÃO PRINCIPAL (Fluxo Natural no Centro/Embaixo) */}
          <div className="pointer-events-auto w-full flex flex-col items-center justify-end pt-4 md:pt-0 pb-4 sm:pb-8 order-2 md:col-span-3 md:row-start-2 z-10 gap-3">
            
            {/* NOVO AVATAR INTEGRADO */}
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-400 border-2 sm:border-4 border-black rounded-sm flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <span className="text-3xl sm:text-5xl">{isEmployed ? '👨‍💻' : '🥵'}</span>
              </div>
              <div className="bg-black/80 text-white px-3 py-1 text-[10px] sm:text-xs border border-gray-500 rounded font-bold shadow-lg uppercase tracking-widest mt-[-10px] z-10">
                {isEmployed ? 'Trabalhando...' : 'No Perrengue'}
              </div>
            </div>

            <button
              onClick={() => dispatch(fazerBico)}
              disabled={!canDoBico}
              className={`px-8 py-4 sm:px-12 sm:py-6 rounded-md font-bold text-lg sm:text-2xl border-b-8 transition-all active:border-b-0 active:translate-y-2 shadow-[0_0_20px_rgba(0,0,0,0.5)] w-full md:w-auto ${
                canDoBico
                  ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900 border-yellow-700'
                  : 'bg-gray-700 text-gray-500 border-gray-900 cursor-not-allowed'
              }`}
            >
              FAZER BICO
              <span className="block text-xs sm:text-sm font-normal mt-1 opacity-80">
                Vender Brigadeiro (+R$ {BICO_REWARD} / -⚡ {BICO_ENERGY_COST})
              </span>
            </button>
          </div>

          {/* PAINEL DIREITO: Ações e Mercado */}
          <aside className="pointer-events-auto w-full flex flex-col gap-4 order-3 md:col-start-3 md:row-start-1 max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            
            {/* Educação */}
            <section className="bg-gray-900/90 backdrop-blur-sm border-4 border-gray-700 p-4 rounded-md text-white shadow-lg">
              <h2 className="text-lg text-gray-300 border-b-2 border-gray-600 pb-1 mb-3">Estudos</h2>
              <div className="flex flex-col gap-2">
                {Object.values(COURSES).map(course => {
                  const isCompleted = completedCourses.includes(course.id);
                  const canAfford = state.money >= course.cost && state.energy >= course.energyCost;
                  return (
                    <button
                      key={course.id}
                      onClick={() => dispatch(fazerCurso(course.id))}
                      disabled={isCompleted || !canAfford}
                      className={`w-full p-2 text-left border-2 transition-all text-xs ${isCompleted
                        ? 'bg-gray-800 border-green-700 text-gray-500 cursor-not-allowed'
                        : canAfford
                          ? 'bg-blue-950 border-blue-600 hover:bg-blue-900 text-white hover:pl-3'
                          : 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                        }`}
                    >
                      <div className="font-bold flex justify-between">
                        <span>{course.name}</span>
                        {isCompleted && <span className="text-green-500">✓</span>}
                      </div>
                      {!isCompleted && (
                        <div className="mt-1 opacity-80">R$ {course.cost} | ⚡ {course.energyCost}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Mercado de Trabalho */}
            <section className="bg-gray-900/90 backdrop-blur-sm border-4 border-gray-700 p-4 rounded-md text-white shadow-lg">
              <h2 className="text-lg text-gray-300 border-b-2 border-gray-600 pb-1 mb-3">Vagas</h2>
              <div className="flex flex-col gap-3">
                {Object.values(JOBS).map(job => {
                  const isCurrentJob = state.currentJobId === job.id;
                  const hasRequirements = job.requiredCourses.every(req => completedCourses.includes(req));
                  const canAffordUpfront = state.money >= job.upfrontCost;
                  const canHire = !isCurrentJob && hasRequirements && canAffordUpfront;

                  return (
                    <div key={job.id} className="p-2 border-2 border-gray-600 bg-gray-800 text-xs">
                      <div className="font-bold text-gray-200 mb-1">{job.name}</div>
                      <div className="text-gray-400 mb-2">
                        +R$ {job.salaryPerTick} | -⚡ {job.energyCostPerTick} <br />
                        <span className="text-yellow-600">Entrevista: R$ {job.upfrontCost}</span>
                      </div>

                      {job.requiredCourses.length > 0 && (
                        <div className="mb-2">
                          {job.requiredCourses.map(req => {
                            const hasCourse = completedCourses.includes(req);
                            return (
                              <span key={req} className={`mr-1 inline-block ${hasCourse ? 'text-green-500' : 'text-red-500'}`}>
                                [{hasCourse ? 'X' : ' '}] {COURSES[req]?.name}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      <button
                        onClick={() => dispatch(assinarCarteira(job.id))}
                        disabled={!canHire}
                        className={`w-full py-1 border-2 font-bold transition-transform ${isCurrentJob
                          ? 'bg-green-900 border-green-700 text-green-500 cursor-not-allowed'
                          : canHire
                            ? 'bg-green-600 border-green-400 text-white hover:bg-green-500 active:translate-y-1'
                            : 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        {isCurrentJob ? 'ATUAL' : canHire ? 'APLICAR' : 'BLOQUEADO'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>

      </div>
    </main>
  );
}