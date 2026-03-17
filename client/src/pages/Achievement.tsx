import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import confetti from 'canvas-confetti';
import {
  TrophyIcon,
  StarIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const stageNames: Record<number, { name: string; emoji: string }> = {
  1: { name: 'Markdown 基础', emoji: '📝' },
  2: { name: 'Markdown 进阶', emoji: '🚀' },
  3: { name: 'Quarto Markdown 入门', emoji: '🔬' },
  4: { name: 'Quarto Markdown 进阶', emoji: '🎓' },
};

function fireGrandConfetti() {
  const duration = 4000;
  const end = Date.now() + duration;
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff', '#10b981', '#f59e0b'];

  // Initial big burst
  confetti({
    particleCount: 200,
    spread: 160,
    origin: { x: 0.5, y: 0.4 },
    colors,
    gravity: 0.6,
    ticks: 300,
  });

  // Continuous side bursts
  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors,
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
}

export default function Achievement() {
  const navigate = useNavigate();
  const { levels, progress, totalScore, completedLevels, fetchLevels, fetchProgress, getStageStats, isAllComplete } = useGameStore();

  useEffect(() => {
    fetchLevels();
    fetchProgress();
  }, [fetchLevels, fetchProgress]);

  useEffect(() => {
    if (levels.length > 0 && isAllComplete()) {
      fireGrandConfetti();
    }
  }, [levels, isAllComplete]);

  const allComplete = levels.length > 0 && isAllComplete();
  const maxTotalScore = levels.reduce((sum, l) => sum + l.maxScore, 0);
  const overallPercent = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;

  // Determine achievement title based on score percentage
  const getAchievementTitle = () => {
    if (overallPercent === 100) return { title: 'Markdown 大师', icon: '👑', color: 'from-yellow-400 to-amber-500' };
    if (overallPercent >= 90) return { title: 'Markdown 专家', icon: '🏆', color: 'from-yellow-400 to-orange-500' };
    if (overallPercent >= 70) return { title: 'Markdown 熟练者', icon: '🥇', color: 'from-blue-400 to-indigo-500' };
    if (overallPercent >= 50) return { title: 'Markdown 学徒', icon: '🥈', color: 'from-gray-300 to-gray-400' };
    return { title: 'Markdown 初学者', icon: '🥉', color: 'from-orange-300 to-orange-400' };
  };

  const achievement = getAchievementTitle();

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      {/* Grand header */}
      <div className="text-center mb-12">
        <div className="text-8xl mb-6 animate-bounce-slow">{achievement.icon}</div>
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 mb-3">
          {allComplete ? '恭喜通关！' : '成就总览'}
        </h1>
        <p className="text-2xl font-bold text-gray-800 mb-1">{achievement.title}</p>
        <p className="text-gray-500">
          {allComplete
            ? '你已经完成了所有关卡，成为了真正的 Markdown & Quarto 高手！'
            : '继续努力，完成所有关卡解锁最终成就！'}
        </p>
      </div>

      {/* Overall stats */}
      <div className={`bg-gradient-to-r ${achievement.color} rounded-2xl p-8 mb-8 text-white shadow-xl`}>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <AcademicCapIcon className="w-10 h-10 mx-auto mb-2 opacity-90" />
            <div className="text-3xl font-extrabold">{completedLevels}/{levels.length}</div>
            <div className="text-sm opacity-80">完成关卡</div>
          </div>
          <div>
            <StarIcon className="w-10 h-10 mx-auto mb-2 opacity-90" />
            <div className="text-3xl font-extrabold">{totalScore}</div>
            <div className="text-sm opacity-80">总分数</div>
          </div>
          <div>
            <TrophyIcon className="w-10 h-10 mx-auto mb-2 opacity-90" />
            <div className="text-3xl font-extrabold">{overallPercent}%</div>
            <div className="text-sm opacity-80">总得分率</div>
          </div>
        </div>
      </div>

      {/* Stage breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <ChartBarIcon className="w-5 h-5 text-indigo-500" />
          <span>各阶段成绩</span>
        </h3>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((stageId) => {
            const stats = levels.length > 0 ? getStageStats(stageId) : null;
            const info = stageNames[stageId];
            if (!stats || stats.totalLevels === 0) return null;
            const percent = Math.round((stats.totalScore / stats.maxScore) * 100);
            const completionPercent = Math.round((stats.completedLevels / stats.totalLevels) * 100);

            return (
              <div key={stageId} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{info.emoji}</span>
                    <span className="font-medium text-gray-800">第 {stageId} 阶段：{info.name}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">
                      <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                      {stats.completedLevels}/{stats.totalLevels}
                    </span>
                    <span className="text-gray-500">
                      <StarIcon className="w-4 h-4 inline mr-1" />
                      {stats.totalScore}/{stats.maxScore}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-4 rounded-full transition-all duration-1000 ${
                      completionPercent === 100
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                        : completionPercent > 0
                        ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                        : 'bg-gray-300'
                    }`}
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>完成度 {completionPercent}%</span>
                  <span>得分率 {percent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements / Badges */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <TrophyIcon className="w-5 h-5 text-yellow-500" />
          <span>获得成就</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'Markdown 入门', condition: completedLevels >= 1, icon: '✏️', desc: '完成第一个关卡' },
            { name: '基础扎实', condition: levels.length > 0 && getStageStats(1).completedLevels === getStageStats(1).totalLevels, icon: '📝', desc: '完成第一阶段' },
            { name: '进阶达人', condition: levels.length > 0 && getStageStats(2).completedLevels === getStageStats(2).totalLevels, icon: '🚀', desc: '完成第二阶段' },
            { name: 'Quarto 新手', condition: levels.length > 0 && getStageStats(3).completedLevels === getStageStats(3).totalLevels, icon: '🔬', desc: '完成第三阶段' },
            { name: 'Quarto 大师', condition: levels.length > 0 && getStageStats(4).completedLevels === getStageStats(4).totalLevels, icon: '🎓', desc: '完成第四阶段' },
            { name: '全能冠军', condition: allComplete, icon: '👑', desc: '完成所有关卡' },
            { name: '满分学霸', condition: overallPercent === 100, icon: '💯', desc: '所有关卡满分' },
            { name: '半程英雄', condition: completedLevels >= Math.ceil(levels.length / 2), icon: '🦸', desc: '完成一半关卡' },
            { name: '坚持不懈', condition: completedLevels >= 10, icon: '💪', desc: '完成10个关卡' },
          ].map((badge) => (
            <div
              key={badge.name}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                badge.condition
                  ? 'border-yellow-300 bg-yellow-50 shadow-sm'
                  : 'border-gray-100 bg-gray-50 opacity-40 grayscale'
              }`}
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <div className={`font-semibold text-sm ${badge.condition ? 'text-gray-900' : 'text-gray-400'}`}>
                {badge.name}
              </div>
              <div className="text-xs text-gray-500 mt-1">{badge.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pb-8">
        <button
          onClick={() => navigate('/levels')}
          className="flex items-center space-x-2 px-5 py-2.5 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>返回关卡列表</span>
        </button>
        <button
          onClick={() => navigate('/leaderboard')}
          className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors active:scale-95"
        >
          <ChartBarIcon className="w-5 h-5" />
          <span>查看排行榜</span>
        </button>
      </div>
    </div>
  );
}
