import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, PlayIcon } from '@heroicons/react/24/solid';

export default function Profile() {
  const { user } = useAuthStore();
  const { levels, progress, totalScore, completedLevels, fetchLevels, fetchProgress } = useGameStore();

  useEffect(() => {
    fetchLevels();
    fetchProgress();
  }, [fetchLevels, fetchProgress]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">请先登录</p>
      </div>
    );
  }

  const completedLevelIds = new Set(progress.map(p => p.levelId));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-center space-x-6">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
              {user.username[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
            <p className="text-gray-500">加入时间：{new Date(user.createdAt).toLocaleDateString()}</p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{totalScore}</div>
                <div className="text-sm text-gray-500">总积分</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{completedLevels}</div>
                <div className="text-sm text-gray-500">已完成关卡</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {levels.length > 0 ? Math.round((completedLevels / levels.length) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-500">完成进度</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">关卡进度</h2>
      <div className="space-y-3">
        {levels.map((level) => {
          const isCompleted = completedLevelIds.has(level.id);
          const progressData = progress.find(p => p.levelId === level.id);

          return (
            <Link
              key={level.id}
              to={`/levels/${level.id}`}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                isCompleted
                  ? 'bg-green-50 border-green-200 hover:border-green-300'
                  : 'bg-white border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {isCompleted ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  ) : (
                    <PlayIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{level.title}</h3>
                  <p className="text-sm text-gray-500">{level.stageName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {isCompleted && progressData && (
                  <>
                    <span className="text-sm text-gray-500">
                      尝试 {progressData.attempts} 次
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full font-medium">
                      {progressData.score} 分
                    </span>
                  </>
                )}
                <span className="text-sm text-gray-400">{level.maxScore} 分</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
