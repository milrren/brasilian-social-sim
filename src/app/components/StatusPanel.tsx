import { PlayerState } from '../../core/types';
import { JOBS, COURSES } from '../../core/constants';

interface StatusPanelProps {
  state: PlayerState;
}

export function StatusPanel({ state }: StatusPanelProps) {
  const isEmployed = state.currentJobId !== null;
  const currentJob = isEmployed ? JOBS[state.currentJobId!] : null;
  const completedCourses = state.completedCourses || [];

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm border-4 border-gray-700 p-4 rounded-md text-white shadow-lg">
      <h2 className="text-lg text-gray-300 border-b-2 border-gray-600 pb-1 mb-3">Status Atual</h2>

      {isEmployed ? (
        <div className="bg-green-950/80 p-3 border-2 border-green-700 rounded mb-3">
          <p className="font-bold text-green-300">🏢 {currentJob?.name}</p>
          <p className="text-xs mt-2 text-green-200">+R$ {currentJob?.salaryPerTick}/seg</p>
          <p className="text-xs text-yellow-500">-⚡ {currentJob?.energyCostPerTick}/seg</p>
        </div>
      ) : (
        <div className="bg-red-950/80 p-3 border-2 border-red-700 rounded mb-3 text-center animate-pulse">
          <p className="font-bold text-red-400">⚠️ Desempregado</p>
        </div>
      )}

      <div className="bg-gray-800/80 p-3 border-2 border-gray-600 rounded">
        <p className="font-bold text-blue-300 mb-2">🎓 Currículo:</p>
        {completedCourses.length > 0 ? (
          <ul className="list-disc list-inside text-xs text-gray-300">
            {completedCourses.map(id => (
              <li key={id}>{COURSES[id]?.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-500">Nenhum curso concluído.</p>
        )}
      </div>
    </div>
  );
}
