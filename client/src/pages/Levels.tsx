import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import LevelCard from '../components/LevelCard';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { BookOpenIcon, TrophyIcon } from '@heroicons/react/24/outline';

export default function Levels() {
  const navigate = useNavigate();
  const { levels, progress, fetchLevels, fetchProgress, getLevelStatus, getCurrentStage, isStageComplete, isAllComplete } = useGameStore();

  useEffect(() => {
    fetchLevels();
    fetchProgress();
  }, [fetchLevels, fetchProgress]);

  const stages = [
    { id: 1, name: 'Markdown 基础', description: '掌握 Markdown 核心语法' },
    { id: 2, name: 'Markdown 进阶', description: '学习高级 Markdown 特性' },
    { id: 3, name: 'Quarto Markdown 入门', description: '开始使用 Quarto' },
    { id: 4, name: 'Quarto Markdown 进阶', description: '精通 Quarto 文档' }
  ];

  const completedLevelIds = new Set(progress.map(p => p.levelId));
  const currentStage = getCurrentStage();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">所有关卡</h1>
        <p className="text-gray-600">
          共 {levels.length} 个关卡，已完成 {progress.length} 个
        </p>
      </div>

      {/* Achievement banner when all complete */}
      {isAllComplete() && (
        <button
          onClick={() => navigate('/achievement')}
          className="w-full mb-8 p-5 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-xl text-white flex items-center justify-center space-x-3 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 transition-all shadow-lg hover:shadow-xl active:scale-[0.99]"
        >
          <TrophyIcon className="w-6 h-6" />
          <span className="text-lg font-bold">🎉 恭喜通关！点击查看你的成就</span>
          <TrophyIcon className="w-6 h-6" />
        </button>
      )}

      <div className="space-y-12">
        {stages.map((stage) => {
          const stageLevels = levels.filter(l => l.stage === stage.id);
          const completedInStage = stageLevels.filter(l => completedLevelIds.has(l.id)).length;
          const isLocked = stage.id > currentStage;

          return (
            <div key={stage.id} className={`${isLocked ? 'opacity-70' : ''}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {isLocked && <LockClosedIcon className="w-5 h-5 text-gray-400" />}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      第 {stage.id} 阶段：{stage.name}
                    </h2>
                    <p className="text-gray-500 text-sm">{stage.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {isStageComplete(stage.id) && (
                    <button
                      onClick={() => navigate(`/stages/${stage.id}/complete`)}
                      className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <BookOpenIcon className="w-4 h-4" />
                      <span>复习</span>
                    </button>
                  )}
                  <div className="text-sm text-gray-500">
                    {completedInStage} / {stageLevels.length} 完成
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stageLevels.map((level) => {
                  const status = getLevelStatus(level.id);
                  const isLevelLocked = isLocked || (stage.id === currentStage && !completedLevelIds.has(level.id - 1) && level.id > 1 && !completedLevelIds.has(level.id));

                  return (
                    <LevelCard
                      key={level.id}
                      level={level}
                      completed={status.completed}
                      score={status.score}
                      isLocked={isLevelLocked}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
