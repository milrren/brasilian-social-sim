"use client";

import { useState, useEffect, useRef } from 'react';
import { useGameLoop } from '../core/hooks/useGameLoop';
import { fazerBico } from '../core/state/actions';
import { JOBS, BICO_ENERGY_COST, BICO_REWARD } from '../core/constants';
import { AdaptivePanel } from './components/AdaptivePanel';
import { StatusPanel } from './components/StatusPanel';
import { JobsPanel } from './components/JobsPanel';
import { EducationPanel } from './components/EducationPanel';
import { LifeUpgradesPanel } from './components/LifeUpgradesPanel';
import { GeneralInfoPanel } from './components/GeneralInfoPanel';
import {
  hasAvailableCourses,
  hasAvailableJobs,
  countAvailableCourses,
  countAvailableJobs,
  hasAvailableLifeUpgrades,
  countAvailableLifeUpgrades,
} from './utils/gameHelpers';
import { AutosaveIndicator } from './components/AutosaveIndicator';
import { OfflineProgressNotice } from './components/OfflineProgressNotice';
import { getActiveBackgroundAsset, getTotalCostOfLivingPerTick } from '../core/state/lifeUpgrades';
import { getNetProgressPerTick } from '../core/state/economy';

export default function BrasimsApp() {
  const { state, dispatch, offlineProgressSummary, dismissOfflineProgressSummary } = useGameLoop();

  // Derivando dados para a UI
  const isEmployed = state.currentJobId !== null;
  const currentJob = isEmployed ? JOBS[state.currentJobId!] : null;
  const canDoBico = state.energy >= BICO_ENERGY_COST;
  const currentIncome = currentJob ? currentJob.salaryPerTick : 0;
  const totalCostOfLiving = getTotalCostOfLivingPerTick(state);
  const netProgressPerTick = getNetProgressPerTick(state);

  // Indicadores de oportunidades
  const hasEducationAvailable = hasAvailableCourses(state);
  const hasJobsAvailable = hasAvailableJobs(state);
  const hasLifeUpgradesAvailable = hasAvailableLifeUpgrades(state);
  const availableCoursesCount = countAvailableCourses(state);
  const availableJobsCount = countAvailableJobs(state);
  const availableLifeUpgradesCount = countAvailableLifeUpgrades(state);

  // Estado dos modais
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isJobsOpen, setIsJobsOpen] = useState(false);
  const [isLifeUpgradesOpen, setIsLifeUpgradesOpen] = useState(false);
  const [isGeneralInfoOpen, setIsGeneralInfoOpen] = useState(false);

  const [isFlashing, setIsFlashing] = useState(false);

  const activeLevel = currentIncome >= 8 ? 'APARTMENT' : currentIncome > 0 ? 'ORGANIZED' : 'PERRENGUE';
  const defaultBackgroundAsset = '/assets/room-perrengue.png';

  const activeBackgroundAsset = getActiveBackgroundAsset(state) || defaultBackgroundAsset;

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

      {/* 1. O CENÁRIO (Background Visual) */}
      <div className="absolute inset-0 bg-black">
        <div
          className={baseBgClass}
          style={{ backgroundImage: `url("${activeBackgroundAsset}")` }}
        />
        
        {/* O CLARÃO DIVINO DE LEVEL UP */}
        <div 
          className={`absolute inset-0 bg-yellow-100 mix-blend-overlay z-10 pointer-events-none transition-opacity duration-1000 ease-out ${
            isFlashing ? 'opacity-100' : 'opacity-0'
          }`} 
        />
        <div className="absolute inset-0 bg-black/60 pointer-events-none z-20" />
      </div>

      {/* 2. CAMADA DE UI */}
      <div className="relative z-30 w-full h-full min-h-screen p-4 flex flex-col pointer-events-none">

        {/* TOP HUD: Informações Vitais + Menu de Ícones */}
        <header className="pointer-events-auto bg-gray-900/90 backdrop-blur-sm border-4 border-gray-700 p-4 rounded-md shadow-lg flex flex-wrap gap-4 justify-between items-center text-white w-full">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-yellow-400 drop-shadow-md">Brasims</h1>
            <p className={`text-xs mt-1 ${netProgressPerTick >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              Progresso: {netProgressPerTick >= 0 ? '+' : ''}R$ {netProgressPerTick.toFixed(2)}/seg
            </p>
          </div>
          
          <div className="flex gap-4 sm:gap-8 text-lg sm:text-xl font-bold">
            <div className="bg-black/50 px-3 py-1 border-2 border-green-900 rounded text-green-400">
              R$ {state.money.toFixed(2)}
            </div>
            <div className="bg-black/50 px-3 py-1 border-2 border-blue-900 rounded text-blue-400">
              ⚡ {state.energy}/100
            </div>
          </div>

          {/* Menu de Ícones */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setIsEducationOpen(true)}
              className="pointer-events-auto relative p-2 sm:p-3 bg-blue-600 hover:bg-blue-500 border-2 border-blue-400 rounded-lg transition-all active:translate-y-1 flex items-center justify-center text-2xl sm:text-3xl shadow-lg"
              title="Educação"
            >
              📚
              {hasEducationAvailable && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-red-600 shadow-lg animate-pulse">
                  {availableCoursesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsJobsOpen(true)}
              className="pointer-events-auto relative p-2 sm:p-3 bg-green-600 hover:bg-green-500 border-2 border-green-400 rounded-lg transition-all active:translate-y-1 flex items-center justify-center text-2xl sm:text-3xl shadow-lg"
              title="Empregos"
            >
              💼
              {hasJobsAvailable && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-red-600 shadow-lg animate-pulse">
                  {availableJobsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsLifeUpgradesOpen(true)}
              className="pointer-events-auto relative p-2 sm:p-3 bg-purple-600 hover:bg-purple-500 border-2 border-purple-400 rounded-lg transition-all active:translate-y-1 flex items-center justify-center text-2xl sm:text-3xl shadow-lg"
              title="Melhoria de Vida"
            >
              🏡
              {hasLifeUpgradesAvailable && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-red-600 shadow-lg animate-pulse">
                  {availableLifeUpgradesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsGeneralInfoOpen(true)}
              className="pointer-events-auto relative p-2 sm:p-3 bg-gray-600 hover:bg-gray-500 border-2 border-gray-400 rounded-lg transition-all active:translate-y-1 flex items-center justify-center text-2xl sm:text-3xl shadow-lg"
              title="Informações Gerais"
            >
              📊
            </button>
          </div>
        </header>

        {/* ÁREA CENTRAL (Simplificada) */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 mt-8 pointer-events-none">
          
          {/* Status Panel - Mostrado centralmente */}
          <div className="w-full max-w-xs">
            <StatusPanel state={state} />
          </div>

          {/* AVATAR E BICO */}
          <div className="pointer-events-auto flex flex-col items-center justify-center gap-3">
            
            {/* AVATAR */}
            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gray-400 border-2 sm:border-4 border-black rounded-sm flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <span className="text-4xl sm:text-6xl">{isEmployed ? '👨‍💻' : '🥵'}</span>
              </div>
              <div className="bg-black/80 text-white px-3 py-1 text-[10px] sm:text-xs border border-gray-500 rounded font-bold shadow-lg uppercase tracking-widest mt-[-10px] z-10">
                {isEmployed ? 'Trabalhando...' : 'No Perrengue'}
              </div>
            </div>

            {/* BOTÃO PRINCIPAL */}
            <button
              onClick={() => dispatch(fazerBico)}
              disabled={!canDoBico}
              className={`px-8 py-4 sm:px-12 sm:py-6 rounded-md font-bold text-lg sm:text-2xl border-b-8 transition-all active:border-b-0 active:translate-y-2 shadow-[0_0_20px_rgba(0,0,0,0.5)] w-full max-w-md ${
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
        </div>
      </div>

      {/* PAINÉIS ADAPTATIVOS (Sidepanel no Desktop / Modal no Mobile) */}
      <AdaptivePanel
        isOpen={isEducationOpen}
        onClose={() => setIsEducationOpen(false)}
        title="📚 Educação"
      >
        <EducationPanel state={state} dispatch={dispatch} />
      </AdaptivePanel>

      <AdaptivePanel
        isOpen={isJobsOpen}
        onClose={() => setIsJobsOpen(false)}
        title="💼 Mercado de Trabalho"
      >
        <JobsPanel state={state} dispatch={dispatch} />
      </AdaptivePanel>

      <AdaptivePanel
        isOpen={isLifeUpgradesOpen}
        onClose={() => setIsLifeUpgradesOpen(false)}
        title="🏡 Melhoria de Vida"
      >
        <LifeUpgradesPanel state={state} dispatch={dispatch} />
      </AdaptivePanel>

      <AdaptivePanel
        isOpen={isGeneralInfoOpen}
        onClose={() => setIsGeneralInfoOpen(false)}
        title="📊 Informações Gerais"
      >
        <GeneralInfoPanel state={state} />
      </AdaptivePanel>

      {/* Indicador de Autosave */}
      <AutosaveIndicator />

      {/* Aviso de progresso offline */}
      <OfflineProgressNotice
        summary={offlineProgressSummary}
        onClose={dismissOfflineProgressSummary}
      />
    </main>
  );
}