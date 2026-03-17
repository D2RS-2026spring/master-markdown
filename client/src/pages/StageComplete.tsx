import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import confetti from 'canvas-confetti';
import {
  CheckCircleIcon,
  BookOpenIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  TrophyIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

const stageInfo: Record<number, { name: string; description: string; emoji: string; knowledgePoints: string[] }> = {
  1: {
    name: 'Markdown 基础',
    description: '掌握 Markdown 核心语法',
    emoji: '📝',
    knowledgePoints: [
      '使用 # 创建不同级别的标题（H1-H6）',
      '段落之间用空行分隔',
      '使用 **粗体** 和 *斜体* 强调文本',
      '使用 - 或 * 创建无序列表，使用数字创建有序列表',
      '使用 [文字](URL) 创建超链接',
      '使用 ![替代文字](URL) 插入图片',
      '使用 > 创建引用块',
      '使用反引号创建行内代码和代码块',
    ],
  },
  2: {
    name: 'Markdown 进阶',
    description: '学习高级 Markdown 特性',
    emoji: '🚀',
    knowledgePoints: [
      '使用 --- 或 *** 创建水平分割线',
      '使用管道符 | 创建表格，支持对齐设置',
      '使用 - [ ] 和 - [x] 创建任务列表',
      '使用 [^1] 创建脚注引用',
    ],
  },
  3: {
    name: 'Quarto Markdown 入门',
    description: '开始使用 Quarto',
    emoji: '🔬',
    knowledgePoints: [
      '使用 YAML front matter (---) 设置文档元数据',
      '使用 ```{python} 或 ```{r} 创建可执行代码单元',
      '使用 #| 设置代码单元选项（如 echo, eval）',
      '使用 #| fig-cap 等选项控制图表输出',
    ],
  },
  4: {
    name: 'Quarto Markdown 进阶',
    description: '精通 Quarto 文档',
    emoji: '🎓',
    knowledgePoints: [
      '使用交叉引用 @fig- 和 @tbl- 引用图表',
      '使用 ::: {.callout-note} 创建提示框',
      '使用 Tabset 面板组织内容展示',
      '综合运用所有技巧创建专业文档',
    ],
  },
};

function fireStageConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#10b981', '#3b82f6', '#f59e0b'],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#10b981', '#3b82f6', '#f59e0b'],
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
}

export default function StageComplete() {
  const { stageId } = useParams<{ stageId: string }>();
  const navigate = useNavigate();
  const { levels, progress, fetchLevels, fetchProgress, getStageStats, isStageComplete, isAllComplete } = useGameStore();

  const stage = parseInt(stageId || '1');
  const info = stageInfo[stage];

  useEffect(() => {
    fetchLevels();
    fetchProgress();
  }, [fetchLevels, fetchProgress]);

  useEffect(() => {
    if (levels.length > 0 && isStageComplete(stage)) {
      fireStageConfetti();
    }
  }, [levels, stage, isStageComplete]);

  if (!info) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">无效的阶段</p>
        <button onClick={() => navigate('/levels')} className="mt-4 text-blue-600 hover:underline">
          返回关卡列表
        </button>
      </div>
    );
  }

  const stats = levels.length > 0 ? getStageStats(stage) : null;
  const stageComplete = levels.length > 0 && isStageComplete(stage);
  const allComplete = levels.length > 0 && isAllComplete();
  const scorePercent = stats ? Math.round((stats.totalScore / stats.maxScore) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">{info.emoji}</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {stageComplete ? '🎉 阶段完成！' : `第 ${stage} 阶段`}
        </h1>
        <p className="text-xl text-gray-600">{info.name}</p>
        <p className="text-gray-500 mt-1">{info.description}</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
            <CheckCircleIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.completedLevels}/{stats.totalLevels}</div>
            <div className="text-sm text-gray-500">完成关卡</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
            <StarIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalScore}</div>
            <div className="text-sm text-gray-500">获得分数</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
            <TrophyIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{scorePercent}%</div>
            <div className="text-sm text-gray-500">得分率</div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {stats && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">阶段进度</span>
            <span className="text-sm text-gray-500">{stats.completedLevels}/{stats.totalLevels}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(stats.completedLevels / stats.totalLevels) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Level completion list */}
      {stats && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
            <span>关卡完成情况</span>
          </h3>
          <div className="space-y-3">
            {stats.levels.map((level) => {
              const p = progress.find(pr => pr.levelId === level.id);
              const completed = !!p;
              return (
                <div key={level.id} className={`flex items-center justify-between p-3 rounded-lg ${completed ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-3">
                    {completed ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={`font-medium ${completed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {level.title}
                    </span>
                  </div>
                  {completed && (
                    <span className="text-sm text-green-600 font-medium">{p?.score}/{level.maxScore} 分</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Knowledge review */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <BookOpenIcon className="w-5 h-5 text-blue-500" />
          <span>知识点复习</span>
        </h3>
        <p className="text-sm text-gray-500 mb-4">回顾本阶段学到的核心知识：</p>
        <div className="space-y-3">
          {info.knowledgePoints.map((point, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm font-bold rounded-full flex items-center justify-center mt-0.5">
                {index + 1}
              </span>
              <p className="text-gray-700 text-sm leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/levels')}
          className="flex items-center space-x-2 px-5 py-2.5 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>返回关卡列表</span>
        </button>

        {allComplete ? (
          <button
            onClick={() => navigate('/achievement')}
            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <TrophyIcon className="w-5 h-5" />
            <span>查看最终成就</span>
          </button>
        ) : stage < 4 ? (
          <button
            onClick={() => {
              const nextStageLevels = levels.filter(l => l.stage === stage + 1);
              if (nextStageLevels.length > 0) {
                navigate(`/levels/${nextStageLevels[0].id}`);
              }
            }}
            className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors active:scale-95"
          >
            <span>进入第 {stage + 1} 阶段</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
