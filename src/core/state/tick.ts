import * as R from 'ramda';
import { PlayerState } from '../types';
import { COST_OF_LIVING_PER_TICK, ENERGY_REGEN_PER_TICK, MAX_ENERGY, JOBS } from '../constants';

// O motor do jogo: Processa o que acontece a cada segundo
export const processTick = (state: PlayerState): PlayerState => {
  const job = state.currentJobId ? JOBS[state.currentJobId] : null;
  const salary = job ? job.salaryPerTick : 0;
  const jobEnergyDrain = job ? job.energyCostPerTick : 0;

  // Pipeline de transformações matemáticas para o Tick
  const newState = R.evolve({
    // Matemática pura e explícita: TS entende na hora e a performance é até melhor
    money: (m: number) => Math.max(0, m + salary - COST_OF_LIVING_PER_TICK),

    // Continuamos usando o poder do Ramda com R.clamp, mas passando o valor resolvido
    energy: (e: number) => R.clamp(0, MAX_ENERGY, e + ENERGY_REGEN_PER_TICK - jobEnergyDrain)
  })(state);

  return newState as PlayerState;
};
