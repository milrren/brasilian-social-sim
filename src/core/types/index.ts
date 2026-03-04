// Define o esqueleto do nosso estado único e imutável
export interface Job {
  id: string;
  name: string;
  salaryPerTick: number;     // R$ ganho por segundo
  energyCostPerTick: number; // Fadiga gasta por segundo
  upfrontCost: number;
}

export interface PlayerState {
  money: number;
  energy: number;
  currentJobId: string | null; // null = desempregado
}
