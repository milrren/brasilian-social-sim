import { COURSES, JOBS, LIFE_UPGRADES } from '../constants';
import { PlayerState } from '../types';

interface AvailabilityStats {
  hasAny: boolean;
  count: number;
}

const getAvailabilityStats = <T>(items: T[], canUse: (item: T) => boolean): AvailabilityStats => {
  const count = items.filter(canUse).length;
  return {
    hasAny: count > 0,
    count,
  };
};

export const getCourseAvailability = (state: PlayerState): AvailabilityStats => {
  const completedCourses = state.completedCourses;

  return getAvailabilityStats(Object.values(COURSES), (course) => {
    const isCompleted = completedCourses.includes(course.id);
    const canAfford = state.money >= course.cost && state.energy >= course.energyCost;
    return !isCompleted && canAfford;
  });
};

export const getJobAvailability = (state: PlayerState): AvailabilityStats => {
  const completedCourses = state.completedCourses;

  return getAvailabilityStats(Object.values(JOBS), (job) => {
    const isCurrentJob = state.currentJobId === job.id;
    const hasRequirements = job.requiredCourses.every((req) => completedCourses.includes(req));
    const canAffordUpfront = state.money >= job.upfrontCost;
    return !isCurrentJob && hasRequirements && canAffordUpfront;
  });
};

export const getLifeUpgradeAvailability = (state: PlayerState): AvailabilityStats => {
  const activeUpgrades = state.activeLifeUpgrades;

  return getAvailabilityStats(Object.values(LIFE_UPGRADES), (upgrade) => {
    const isActive = activeUpgrades.includes(upgrade.id);
    const canAfford = state.money >= upgrade.upfrontCost;
    return !isActive && canAfford;
  });
};
