import { PlayerState } from '../../core/types';
import { COURSES } from '../../core/constants';
import { fazerCurso } from '../../core/state/actions';

interface EducationPanelProps {
  state: PlayerState;
  dispatch: (action: (s: PlayerState) => PlayerState) => void;
}

export function EducationPanel({ state, dispatch }: EducationPanelProps) {
  const completedCourses = state.completedCourses || [];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-300 text-sm leading-relaxed mb-2">
        Invista em educação para se qualificar para melhores empregos. Complete cursos para expandir suas oportunidades.
      </p>

      <div className="flex flex-col gap-3">
        {Object.values(COURSES).map(course => {
          const isCompleted = completedCourses.includes(course.id);
          const canAfford = state.money >= course.cost && state.energy >= course.energyCost;

          return (
            <div
              key={course.id}
              className={`p-4 border-2 transition-all rounded-lg ${
                isCompleted
                  ? 'bg-green-950/60 border-green-700 opacity-60'
                  : canAfford
                  ? 'bg-blue-950/60 border-blue-600 hover:bg-blue-900/60 hover:border-blue-500'
                  : 'bg-gray-800/60 border-gray-700 opacity-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-blue-300">📚 {course.name}</h3>
                {isCompleted && <span className="text-green-400 font-bold text-xl">✓ Concluído</span>}
              </div>

              <div className="text-sm text-gray-300 mb-3 space-y-1">
                <p>💰 Custo: <span className="text-yellow-400 font-bold">R$ {course.cost}</span></p>
                <p>⚡ Fadiga: <span className="text-blue-400 font-bold">{course.energyCost}</span></p>
              </div>

              {!isCompleted && (
                <button
                  onClick={() => dispatch(fazerCurso(course.id))}
                  disabled={!canAfford}
                  className={`w-full py-2 px-4 rounded font-bold transition-all border-2 ${
                    canAfford
                      ? 'bg-blue-600 border-blue-400 hover:bg-blue-500 active:translate-y-1 text-white cursor-pointer'
                      : 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Estudar Agora' : 'Sem Recursos'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
