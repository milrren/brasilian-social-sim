import * as R from 'ramda';
import { PlayerState } from '../types';
import { BICO_REWARD, BICO_ENERGY_COST, JOBS, COURSES } from '../constants';

// Ação de clique: Transforma suor em R$
export const fazerBico = (state: PlayerState): PlayerState => {
  if (state.energy < BICO_ENERGY_COST) return state; // Sem energia, sem corre

  // R.evolve aplica transformações específicas nas propriedades do objeto
  return R.evolve({
    money: R.add(BICO_REWARD),
    energy: R.subtract(R.__, BICO_ENERGY_COST) // R.__ funciona como um placeholder ("X - custo")
  })(state) as PlayerState;
};

// NOVO: Ação de Estudar
export const fazerCurso = (courseId: string) => (state: PlayerState): PlayerState => {
  const course = COURSES[courseId];

  // Validações: O curso existe? Tem dinheiro? Tem energia? Já fez o curso?
  if (!course) return state;
  if (state.money < course.cost || state.energy < course.energyCost) return state;
  if (R.includes(courseId, state.completedCourses || [])) return state;

  // Evoluímos o estado subtraindo os custos e inserindo (append) o ID no currículo
  return R.evolve({
    money: R.subtract(R.__, course.cost),
    energy: R.subtract(R.__, course.energyCost),
    completedCourses: R.append(courseId)
  })(state) as PlayerState;
};

// Transição de estado: Mudança de emprego
export const assinarCarteira = (jobId: string) => (state: PlayerState): PlayerState => {
  const job = JOBS[jobId];
  if (!job || state.money < job.upfrontCost) return state;

  // Usa R.all para garantir que TODOS os cursos exigidos estão no currículo do jogador
  const hasRequirements = R.all(
    (req) => R.includes(req, state.completedCourses),
    job.requiredCourses
  );

  if (!hasRequirements) return state;

  return R.evolve({
    // R.always ignora o valor anterior e sempre retorna o novo jobId
    currentJobId: R.always(jobId),

    // Uma função pura e explícita deixa o TypeScript 100% feliz
    money: (m: number) => m - job.upfrontCost
  })(state) as PlayerState;
};
