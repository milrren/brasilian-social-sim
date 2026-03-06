import { PlayerState } from '../../core/types';
import { JOBS, COURSES } from '../../core/constants';
import { assinarCarteira } from '../../core/state/actions';

interface JobsPanelProps {
  state: PlayerState;
  dispatch: (action: (s: PlayerState) => PlayerState) => void;
}

export function JobsPanel({ state, dispatch }: JobsPanelProps) {
  const completedCourses = state.completedCourses || [];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-300 text-sm leading-relaxed mb-2">
        Candidate-se aos empregos disponíveis. Você precisa ter os cursos necessários e dinheiro para a entrevista.
      </p>

      <div className="flex flex-col gap-4">
        {Object.values(JOBS).map(job => {
          const isCurrentJob = state.currentJobId === job.id;
          const hasRequirements = job.requiredCourses.every(req => completedCourses.includes(req));
          const canAffordUpfront = state.money >= job.upfrontCost;
          const canHire = !isCurrentJob && hasRequirements && canAffordUpfront;

          return (
            <div
              key={job.id}
              className={`p-4 border-2 rounded-lg transition-all ${
                isCurrentJob
                  ? 'bg-green-950/60 border-green-700'
                  : canHire
                  ? 'bg-green-900/40 border-green-600 hover:bg-green-800/50'
                  : 'bg-gray-800/60 border-gray-700 opacity-50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-xl text-green-300">💼 {job.name}</h3>
                {isCurrentJob && (
                  <span className="bg-green-600 text-white px-3 py-1 rounded font-bold text-sm">
                    EMPREGADO
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mb-4">
                <p>💰 Salário: <span className="text-green-400 font-bold">+R$ {job.salaryPerTick}/s</span></p>
                <p>⚡ Custo: <span className="text-red-400 font-bold">-{job.energyCostPerTick}/s</span></p>
                <p className="col-span-2">🎯 Entrevista: <span className="text-yellow-400 font-bold">R$ {job.upfrontCost}</span></p>
              </div>

              {job.requiredCourses.length > 0 && (
                <div className="mb-4 p-2 bg-black/30 rounded border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2 font-bold">📋 Requisitos:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredCourses.map(req => {
                      const hasCourse = completedCourses.includes(req);
                      return (
                        <span
                          key={req}
                          className={`text-xs px-2 py-1 rounded border ${
                            hasCourse
                              ? 'bg-green-900/50 border-green-600 text-green-300'
                              : 'bg-red-900/50 border-red-600 text-red-300'
                          }`}
                        >
                          {hasCourse ? '✓' : '✕'} {COURSES[req]?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {!isCurrentJob && (
                <button
                  onClick={() => dispatch(assinarCarteira(job.id))}
                  disabled={!canHire}
                  className={`w-full py-2 px-4 rounded font-bold transition-all border-2 ${
                    canHire
                      ? 'bg-green-600 border-green-400 hover:bg-green-500 active:translate-y-1 text-white cursor-pointer'
                      : 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canHire ? 'Fazer Entrevista' : 'Bloqueado'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
