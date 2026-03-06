import { JOBS } from '../constants';
import { PlayerState } from '../types';
import { getEnergyRegenBonusFromUpgrades, getTotalCostOfLivingPerTick, getTotalEnergyRegenPerTick } from './lifeUpgrades';

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
  const regen = getTotalEnergyRegenPerTick(state);
  const regenBonusFromUpgrades = getEnergyRegenBonusFromUpgrades(state);

  return {
    regen,
    regenBonusFromUpgrades,
    drain: energyDrain,
    net: regen - energyDrain,
  };
};
