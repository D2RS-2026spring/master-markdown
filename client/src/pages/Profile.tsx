import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, PlayIcon, PencilIcon } from '@heroicons/react/24/solid';

export default function Profile() {
  const { user, setNickname, isAnonymous, loginWithGithub, logout } = useAuthStore();
  const { levels, progress, totalScore, completedLevels, fetchLevels, fetchProgress } = useGameStore();

  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [nicknameSaving, setNicknameSaving] = useState(false);
  const [nicknameError, setNicknameError] = useState('');
  const [nicknameSuccess, setNicknameSuccess] = useState(false);

  useEffect(() => {
    fetchLevels();
    fetchProgress();
  }, [fetchLevels, fetchProgress]);

  useEffect(() => {
    if (user) {
      setNicknameInput(user.nickname);
    }
  }, [user]);

  const handleSaveNickname = async () => {
    if (!nicknameInput.trim()) {
      setNicknameError('昵称不能为空');
      return;
    }
    if (nicknameInput.trim().length > 20) {
      setNicknameError('昵称不能超过 20 个字符');
      return;
    }

    try {
      setNicknameSaving(true);
      setNicknameError('');
      await setNickname(nicknameInput.trim());
      setIsEditingNickname(false);
      setNicknameSuccess(true);
      setTimeout(() => setNicknameSuccess(false), 2000);
    } catch (error: any) {
      setNicknameError(error.message || '保存失败');
    } finally {
      setNicknameSaving(false);
    }
  };

  const completedLevelIds = new Set(progress.map(p => p.levelId));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
            {(user?.nickname || '匿')[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-1">
              {isEditingNickname ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveNickname()}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="输入你的昵称"
                    maxLength={20}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveNickname}
                    disabled={nicknameSaving}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {nicknameSaving ? '保存中...' : '保存'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingNickname(false);
                      setNicknameInput(user?.nickname || '');
                      setNicknameError('');
                    }}
                    className="text-gray-500 hover:text-gray-700 px-3 py-1.5 text-sm"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">{user?.nickname || '匿名玩家'}</h1>
                  <button
                    onClick={() => setIsEditingNickname(true)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    title="修改昵称"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  {nicknameSuccess && (
                    <span className="text-green-600 text-sm">✓ 已保存</span>
                  )}
                </>
              )}
            </div>
            {nicknameError && (
              <p className="text-red-500 text-sm mb-2">{nicknameError}</p>
            )}
            <p className="text-gray-500 text-sm mb-4">
              设置昵称后，你的名字将显示在排行榜上
            </p>
            <div className="mb-4">
              {isAnonymous ? (
                <button
                  onClick={() => loginWithGithub('/profile')}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors"
                >
                  使用 GitHub 登录（保留当前进度）
                </button>
              ) : (
                <button
                  onClick={() => logout()}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  退出登录
                </button>
              )}
            </div>
            <div className="flex items-center space-x-6">
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
