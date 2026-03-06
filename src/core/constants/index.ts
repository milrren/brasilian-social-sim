import { Job, Course, LifeUpgrade } from '../types';

// A velocidade que o tempo passa e a vida cobra (1 segundo)
export const TICK_RATE_MS = 1000;

// Progresso offline: aplica apenas uma fração do que ocorreria online
export const OFFLINE_PROGRESS_MULTIPLIER = 0.2;

// Limites do corpo humano no corre
export const MAX_ENERGY = 100;
export const ENERGY_REGEN_PER_TICK = 5; // Recuperação passiva de energia
export const BASE_COST_OF_LIVING_PER_TICK = 1; // O dreno base de dinheiro
export const COST_OF_LIVING_PER_TICK = BASE_COST_OF_LIVING_PER_TICK; // compatibilidade

// Bico: O esforço manual inicial
export const BICO_REWARD = 15;
export const BICO_ENERGY_COST = 10;

export const COURSES: Record<string, Course> = {
  'info-basica': {
    id: 'info-basica',
    name: 'Informática Básica (SENAI)',
    cost: 100,
    energyCost: 80, // Exige que o jogador esteja quase com energia cheia para estudar
  },
  'excel-produtivo': {
    id: 'excel-produtivo',
    name: 'Excel Produtivo (SENAC)',
    cost: 260,
    energyCost: 65,
  },
  'logica-programacao': {
    id: 'logica-programacao',
    name: 'Lógica de Programação (EAD)',
    cost: 520,
    energyCost: 95,
  }
};

// Nossa trilha CLT da V1
export const JOBS: Record<string, Job> = {
  'aux-limpeza': {
    id: 'aux-limpeza',
    name: 'Auxiliar de Limpeza',
    salaryPerTick: 3,
    energyCostPerTick: 1, // Exige um pouco de energia constantemente
    upfrontCost: 150,
    requiredCourses: [],
  },
  'assist-adm': {
    id: 'assist-adm',
    name: 'Assistente Administrativo',
    salaryPerTick: 8,
    energyCostPerTick: 2,
    upfrontCost: 300,
    requiredCourses: ['info-basica'], // A Barreira da V2
  },
  'op-sistemas': {
    id: 'op-sistemas',
    name: 'Operador de Sistemas',
    salaryPerTick: 12,
    energyCostPerTick: 4,
    upfrontCost: 650,
    requiredCourses: ['info-basica', 'excel-produtivo'],
  },
  'analista-jr': {
    id: 'analista-jr',
    name: 'Analista Júnior',
    salaryPerTick: 18,
    energyCostPerTick: 6,
    upfrontCost: 1400,
    requiredCourses: ['info-basica', 'excel-produtivo', 'logica-programacao'],
  }
};

export const LIFE_UPGRADES: Record<string, LifeUpgrade> = {
  'casa-simples': {
    id: 'casa-simples',
    name: 'Casa Simples (Aluguel)',
    category: 'housing',
    upfrontCost: 250,
    additionalCostOfLivingPerTick: 1,
    backgroundAsset: '/assets/room-simple.png',
  },
  'apto-bom': {
    id: 'apto-bom',
    name: 'Apartamento Melhor',
    category: 'housing',
    upfrontCost: 700,
    additionalCostOfLivingPerTick: 3,
    backgroundAsset: '/assets/room-nice.png',
  },
  academia: {
    id: 'academia',
    name: 'Plano de Academia',
    category: 'wellness',
    upfrontCost: 180,
    additionalCostOfLivingPerTick: 1,
  },
  'dieta-saudavel': {
    id: 'dieta-saudavel',
    name: 'Dieta Saudável',
    category: 'wellness',
    upfrontCost: 220,
    additionalCostOfLivingPerTick: 1,
    energyRegenBonusPerTick: 2,
  },
  'carro-popular': {
    id: 'carro-popular',
    name: 'Carro Próprio (Popular)',
    category: 'mobility',
    upfrontCost: 950,
    additionalCostOfLivingPerTick: 2,
  },
};
