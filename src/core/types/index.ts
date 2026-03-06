export interface Course {
  id: string;
  name: string;
  cost: number;        // Custo financeiro (R$)
  energyCost: number;  // Custo de fadiga (⚡)
}

export interface Job {
  id: string;
  name: string;
  salaryPerTick: number;     // R$ ganho por segundo
  energyCostPerTick: number; // Fadiga gasta por segundo
  upfrontCost: number;
  requiredCourses: string[];
}

export interface LifeUpgrade {
  id: string;
  name: string;
  category: 'housing' | 'wellness' | 'mobility';
  upfrontCost: number;
  additionalCostOfLivingPerTick: number;
  energyRegenBonusPerTick?: number;
  backgroundAsset?: string;
}

export interface PlayerState {
  money: number;
  energy: number;
  currentJobId: string | null; // null = desempregado
  completedCourses: string[];
  activeLifeUpgrades: string[];
}
