import { LIFE_UPGRADES, BASE_COST_OF_LIVING_PER_TICK, ENERGY_REGEN_PER_TICK } from '../constants';
import { PlayerState } from '../types';

export const getActiveLifeUpgrades = (state: PlayerState) => state.activeLifeUpgrades || [];

export const getTotalCostOfLivingPerTick = (state: PlayerState) => {
  const upgradesCost = getActiveLifeUpgrades(state).reduce((total, upgradeId) => {
    const upgrade = LIFE_UPGRADES[upgradeId];
    if (!upgrade) return total;
    return total + upgrade.additionalCostOfLivingPerTick;
  }, 0);

  return BASE_COST_OF_LIVING_PER_TICK + upgradesCost;
};

export const getCostOfLivingBreakdown = (state: PlayerState) => {
  const activeUpgradeIds = getActiveLifeUpgrades(state);
  const upgrades = activeUpgradeIds
    .map((upgradeId) => LIFE_UPGRADES[upgradeId])
    .filter((upgrade) => Boolean(upgrade));

  const upgradesCost = upgrades.reduce((total, upgrade) => {
    return total + upgrade.additionalCostOfLivingPerTick;
  }, 0);

  return {
    base: BASE_COST_OF_LIVING_PER_TICK,
    upgrades,
    upgradesCost,
    total: BASE_COST_OF_LIVING_PER_TICK + upgradesCost,
  };
};

export const getEnergyRegenBonusFromUpgrades = (state: PlayerState) => {
  return getActiveLifeUpgrades(state).reduce((total, upgradeId) => {
    const upgrade = LIFE_UPGRADES[upgradeId];
    if (!upgrade) return total;
    return total + (upgrade.energyRegenBonusPerTick || 0);
  }, 0);
};

export const getTotalEnergyRegenPerTick = (state: PlayerState) => {
  return ENERGY_REGEN_PER_TICK + getEnergyRegenBonusFromUpgrades(state);
};

export const getActiveBackgroundAsset = (state: PlayerState) => {
  const activeHousingWithAssets = getActiveLifeUpgrades(state)
    .map((upgradeId) => LIFE_UPGRADES[upgradeId])
    .filter((upgrade) => Boolean(upgrade?.backgroundAsset) && upgrade?.category === 'housing');

  if (activeHousingWithAssets.length === 0) return null;

  const highestValueHousing = activeHousingWithAssets.reduce((currentHighest, upgrade) => {
    if (!currentHighest) return upgrade;
    return upgrade.upfrontCost > currentHighest.upfrontCost ? upgrade : currentHighest;
  }, activeHousingWithAssets[0]);

  return highestValueHousing?.backgroundAsset || null;
};