import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';
import LevelCard from '../components/LevelCard';
import { LockClosedIcon } from '@heroicons/react/24/solid';

export default function Levels() {
  const { isAuthenticated } = useAuthStore();
  const { levels, progress, fetchLevels, fetchProgress, getLevelStatus, getCurrentStage } = useGameStore();

  useEffect(() => {
    fetchLevels();
    if (isAuthenticated) {
      fetchProgress();
    }
  }, [fetchLevels, fetchProgress, isAuthenticated]);

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
                <div className="text-sm text-gray-500">
                  {completedInStage} / {stageLevels.length} 完成
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
