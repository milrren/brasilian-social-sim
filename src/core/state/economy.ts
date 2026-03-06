import { ENERGY_REGEN_PER_TICK, JOBS } from '../constants';
import { PlayerState } from '../types';
import { getTotalCostOfLivingPerTick } from './lifeUpgrades';

export const getIncomePerTick = (state: PlayerState) => {
  const job = state.currentJobId ? JOBS[state.currentJobId] : null;
  return job ? job.salaryPerTick : 0;
};

export const getNetProgressPerTick = (state: PlayerState) => {
  const income = getIncomePerTick(state);
  const costOfLiving = getTotalCostOfLivingPerTick(state);
  return income - costOfLiving;
};

export const getEnergyBalancePerTick = (state: PlayerState) => {
  const { net } = getEnergyBreakdownPerTick(state);
  return net;
};

export const getEnergyBreakdownPerTick = (state: PlayerState) => {
  const job = state.currentJobId ? JOBS[state.currentJobId] : null;
  const energyDrain = job ? job.energyCostPerTick : 0;
  const regen = ENERGY_REGEN_PER_TICK;

  return {
    regen,
    drain: energyDrain,
    net: regen - energyDrain,
  };
};
