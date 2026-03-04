import { Job, Course } from '../types';

// A velocidade que o tempo passa e a vida cobra (1 segundo)
export const TICK_RATE_MS = 1000;

// Limites do corpo humano no corre
export const MAX_ENERGY = 100;
export const ENERGY_REGEN_PER_TICK = 5; // Recuperação passiva de energia
export const COST_OF_LIVING_PER_TICK = 1; // O dreno infinito de dinheiro

// Bico: O esforço manual inicial
export const BICO_REWARD = 15;
export const BICO_ENERGY_COST = 10;

export const COURSES: Record<string, Course> = {
  'info-basica': {
    id: 'info-basica',
    name: 'Informática Básica (SENAI)',
    cost: 100,
    energyCost: 80, // Exige que o jogador esteja quase com energia cheia para estudar
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
  }
};
