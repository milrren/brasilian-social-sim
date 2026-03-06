import { JOBS } from '../constants';
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
  const job = state.currentJobId ? JOBS[state.currentJobId] : null;
  const energyDrain = job ? job.energyCostPerTick : 0;
  return 5 - energyDrain;
};
