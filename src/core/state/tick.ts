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
    money: R.pipe(
      R.add(salary),
      R.subtract(R.__, COST_OF_LIVING_PER_TICK),
      R.max(0) // Na V1, evitamos saldo negativo para simplificar a matemática
    ),
    energy: R.pipe(
      R.add(ENERGY_REGEN_PER_TICK),
      R.subtract(R.__, jobEnergyDrain),
      R.clamp(0, MAX_ENERGY) // A energia nunca passa de 100 e não cai abaixo de 0
    )
  })(state);

  return newState as PlayerState;
};
