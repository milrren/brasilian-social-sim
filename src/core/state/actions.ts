import * as R from 'ramda';
import { PlayerState } from '../types';
import { BICO_REWARD, BICO_ENERGY_COST, JOBS, COURSES, LIFE_UPGRADES } from '../constants';

const evolveState = (spec: any) =>
  (state: PlayerState): PlayerState => R.evolve(spec, state as any) as PlayerState;

// Ação de clique: Transforma suor em R$
export const fazerBico = (state: PlayerState): PlayerState => {
  if (state.energy < BICO_ENERGY_COST) return state;

  return R.pipe(
    evolveState({
      money: R.add(BICO_REWARD),
      energy: R.subtract(R.__, BICO_ENERGY_COST),
    }),
  )(state);
};

export const fazerCurso = (courseId: string) => (state: PlayerState): PlayerState => {
  const course = COURSES[courseId];
  if (!course) return state;

  const canAfford = state.money >= course.cost && state.energy >= course.energyCost;
  const isCompleted = R.includes(courseId, state.completedCourses);
  if (!canAfford || isCompleted) return state;

  return R.pipe(
    evolveState({
      money: R.subtract(R.__, course.cost),
      energy: R.subtract(R.__, course.energyCost),
      completedCourses: R.append(courseId),
    }),
  )(state);
};

export const assinarCarteira = (jobId: string) => (state: PlayerState): PlayerState => {
  const job = JOBS[jobId];
  if (!job) return state;

  const canAfford = state.money >= job.upfrontCost;
  const hasRequirements = R.all((req) => R.includes(req, state.completedCourses), job.requiredCourses);
  if (!canAfford || !hasRequirements) return state;

  return R.pipe(
    evolveState({
      currentJobId: R.always(jobId),
      money: (m: number) => m - job.upfrontCost,
    }),
  )(state);
};

export const comprarMelhoriaVida = (upgradeId: string) => (state: PlayerState): PlayerState => {
  const upgrade = LIFE_UPGRADES[upgradeId];
  if (!upgrade) return state;

  const isActive = R.includes(upgradeId, state.activeLifeUpgrades);
  const canAfford = state.money >= upgrade.upfrontCost;
  if (isActive || !canAfford) return state;

  return R.pipe(
    evolveState({
      money: (m: number) => m - upgrade.upfrontCost,
      activeLifeUpgrades: R.append(upgradeId),
    }),
  )(state);
};

export const removerMelhoriaVida = (upgradeId: string) => (state: PlayerState): PlayerState => {
  const isActive = R.includes(upgradeId, state.activeLifeUpgrades);
  if (!isActive) return state;

  return R.pipe(
    evolveState({
      activeLifeUpgrades: R.without([upgradeId]),
    }),
  )(state);
};
