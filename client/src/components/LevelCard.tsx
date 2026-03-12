import { Link } from 'react-router-dom';
import { CheckCircleIcon, LockClosedIcon, PlayIcon } from '@heroicons/react/24/solid';
import type { Level } from '../types';

interface LevelCardProps {
  level: Level;
  completed: boolean;
  score: number;
  isLocked: boolean;
}

export default function LevelCard({ level, completed, score, isLocked }: LevelCardProps) {
  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-orange-100 text-orange-800';
      case 5: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return '入门';
      case 2: return '简单';
      case 3: return '中等';
      case 4: return '困难';
      case 5: return '挑战';
      default: return '未知';
    }
  };

  if (isLocked) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 opacity-60">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">关卡 {level.id}</span>
          <LockClosedIcon className="w-5 h-5 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">{level.title}</h3>
        <p className="text-gray-500 text-sm mb-4">{level.description}</p>
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(level.difficulty)}`}>
            {getDifficultyText(level.difficulty)}
          </span>
          <span className="text-sm text-gray-400">{level.maxScore} 分</span>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/levels/${level.id}`}
      className={`block rounded-xl p-6 border-2 transition-all hover:shadow-lg ${
        completed
          ? 'bg-green-50 border-green-200 hover:border-green-300'
          : 'bg-white border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">关卡 {level.id}</span>
        {completed ? (
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
        ) : (
          <PlayIcon className="w-5 h-5 text-blue-500" />
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{level.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{level.description}</p>

      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(level.difficulty)}`}>
          {getDifficultyText(level.difficulty)}
        </span>
        <div className="flex items-center space-x-2">
          {completed && (
            <span className="text-sm text-green-600 font-medium">{score} 分</span>
          )}
          <span className="text-sm text-gray-400">/ {level.maxScore} 分</span>
        </div>
      </div>
    </Link>
  );
}
