import { PlayerState } from '../../core/types';
import { COURSES, JOBS, LIFE_UPGRADES } from '../../core/constants';

/**
 * Verifica se há algum curso disponível que o jogador pode fazer
 */
export function hasAvailableCourses(state: PlayerState): boolean {
  const completedCourses = state.completedCourses || [];

  return Object.values(COURSES).some(course => {
    const isCompleted = completedCourses.includes(course.id);
    const canAfford = state.money >= course.cost && state.energy >= course.energyCost;
    return !isCompleted && canAfford;
  });
}

/**
 * Verifica se há algum emprego disponível que o jogador pode conseguir
 */
export function hasAvailableJobs(state: PlayerState): boolean {
  const completedCourses = state.completedCourses || [];

  return Object.values(JOBS).some(job => {
    const isCurrentJob = state.currentJobId === job.id;
    const hasRequirements = job.requiredCourses.every(req =>
      completedCourses.includes(req)
    );
    const canAffordUpfront = state.money >= job.upfrontCost;
    const canHire = !isCurrentJob && hasRequirements && canAffordUpfront;
    return canHire;
  });
}

/**
 * Conta quantos cursos estão disponíveis
 */
export function countAvailableCourses(state: PlayerState): number {
  const completedCourses = state.completedCourses || [];

  return Object.values(COURSES).filter(course => {
    const isCompleted = completedCourses.includes(course.id);
    const canAfford = state.money >= course.cost && state.energy >= course.energyCost;
    return !isCompleted && canAfford;
  }).length;
}

/**
 * Conta quantos empregos estão disponíveis
 */
export function countAvailableJobs(state: PlayerState): number {
  const completedCourses = state.completedCourses || [];

  return Object.values(JOBS).filter(job => {
    const isCurrentJob = state.currentJobId === job.id;
    const hasRequirements = job.requiredCourses.every(req =>
      completedCourses.includes(req)
    );
    const canAffordUpfront = state.money >= job.upfrontCost;
    const canHire = !isCurrentJob && hasRequirements && canAffordUpfront;
    return canHire;
  }).length;
}

export function hasAvailableLifeUpgrades(state: PlayerState): boolean {
  const activeUpgrades = state.activeLifeUpgrades || [];

  return Object.values(LIFE_UPGRADES).some((upgrade) => {
    const isActive = activeUpgrades.includes(upgrade.id);
    const canAfford = state.money >= upgrade.upfrontCost;
    return !isActive && canAfford;
  });
}

export function countAvailableLifeUpgrades(state: PlayerState): number {
  const activeUpgrades = state.activeLifeUpgrades || [];

  return Object.values(LIFE_UPGRADES).filter((upgrade) => {
    const isActive = activeUpgrades.includes(upgrade.id);
    const canAfford = state.money >= upgrade.upfrontCost;
    return !isActive && canAfford;
  }).length;
}
