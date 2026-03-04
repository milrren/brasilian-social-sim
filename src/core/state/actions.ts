import * as R from 'ramda';
import { PlayerState } from '../types';
import { BICO_REWARD, BICO_ENERGY_COST, JOBS } from '../constants';

// Ação de clique: Transforma suor em R$
export const fazerBico = (state: PlayerState): PlayerState => {
  if (state.energy < BICO_ENERGY_COST) return state; // Sem energia, sem corre

  // R.evolve aplica transformações específicas nas propriedades do objeto
  return R.evolve({
    money: R.add(BICO_REWARD),
    energy: R.subtract(R.__, BICO_ENERGY_COST) // R.__ funciona como um placeholder ("X - custo")
  })(state) as PlayerState;
};

// Transição de estado: Mudança de emprego
export const assinarCarteira = (jobId: string) => (state: PlayerState): PlayerState => {
  const job = JOBS[jobId];
  
  // Barreira de validação: Se não existe o job ou não tem dinheiro, retorna o estado intacto
  if (!job || state.money < job.upfrontCost) return state;

  // R.pipe encadeia as transformações:
  // 1. Atualiza o ID do emprego
  // 2. Deduz o custo da entrevista do saldo
  return R.pipe(
    R.assoc('currentJobId', jobId),
    R.evolve({ 
      money: R.subtract(R.__, job.upfrontCost) 
    })
  )(state) as PlayerState;
};
