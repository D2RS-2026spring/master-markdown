import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import CodeEditor from '../components/CodeEditor';
import MarkdownPreview from '../components/MarkdownPreview';
import type { LevelContent } from '../types';
import confetti from 'canvas-confetti';
import {
  LightBulbIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// GitHub-style confetti celebration — single center burst
function fireConfetti() {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];

  confetti({
    particleCount: 150,
    spread: 100,
    origin: { x: 0.5, y: 0.5 },
    colors,
    gravity: 0.8,
    ticks: 200,
  });
}

// Toast notification component
function Toast({ message, type, onClose }: { message: string; type: 'error' | 'success'; onClose: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 max-w-sm ${exiting ? 'toast-exit' : 'toast-enter'}`}>
      <div className={`flex items-center space-x-3 px-5 py-4 rounded-xl shadow-2xl border ${
        type === 'error'
          ? 'bg-red-50 border-red-200 text-red-800'
          : 'bg-green-50 border-green-200 text-green-800'
      }`}>
        {type === 'error' ? (
          <XCircleIcon className="w-6 h-6 flex-shrink-0 text-red-500" />
        ) : (
          <CheckCircleIcon className="w-6 h-6 flex-shrink-0 text-green-500" />
        )}
        <div className="flex-1">
          <p className="font-semibold text-sm">
            {type === 'error' ? '回答错误' : '回答正确！'}
          </p>
          {message && (
            <p className="text-xs mt-0.5 opacity-80">{message}</p>
          )}
        </div>
        <button
          onClick={() => { setExiting(true); setTimeout(onClose, 300); }}
          className="text-current opacity-40 hover:opacity-70 transition-opacity ml-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function LevelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { levels, progress, fetchLevels, submitAnswer, getLevelStatus } = useGameStore();

  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ correct: boolean; message?: string } | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const editorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  const level = levels.find(l => l.id === parseInt(id || '0'));
  const status = level ? getLevelStatus(level.id) : { completed: false, score: 0, attempts: 0 };

  useEffect(() => {
    if (level) {
      const existingProgress = progress.find(p => p.levelId === level.id);
      if (existingProgress?.code) {
        setCode(existingProgress.code);
      } else {
        const content: LevelContent = JSON.parse(level.content);
        setCode(content.template || '');
      }
    }
  }, [level, progress]);

  // Reset result when navigating to a different level
  useEffect(() => {
    setResult(null);
    setToast(null);
  }, [id]);

  const dismissToast = useCallback(() => setToast(null), []);

  if (!level) {
    return <div className="text-center py-12">加载中...</div>;
  }

  const content: LevelContent = JSON.parse(level.content);
  const hints: string[] = JSON.parse(level.hints);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setResult(null);
    setToast(null);

    const response = await submitAnswer(level.id, code);
    setResult(response);
    setIsSubmitting(false);

    if (response.correct) {
      // 🎉 Fire confetti celebration!
      fireConfetti();
    } else {
      // 💢 Shake the editor and show error toast
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setToast({
        message: response.message || '请再试一次',
        type: 'error',
      });
    }
  };

  const goToNextLevel = () => {
    const nextLevel = levels.find(l => l.id === level.id + 1);
    if (nextLevel) {
      navigate(`/levels/${nextLevel.id}`);
    }
  };

  const goToPrevLevel = () => {
    if (level.id > 1) {
      navigate(`/levels/${level.id - 1}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Toast notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={dismissToast} />
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/levels')}
            className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>返回关卡列表</span>
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {level.stageName} · 关卡 {level.id}
            </span>
            {status.completed && (
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                已完成 · {status.score} 分
              </span>
            )}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{level.title}</h1>
        <p className="text-gray-600">{level.description}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">任务</h3>
            <p className="text-gray-700 mb-4">{content.task || content.question}</p>
            {content.instruction && (
              <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                💡 {content.instruction}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">代码编辑器</h3>
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-yellow-600 hover:text-yellow-700 flex items-center space-x-1 text-sm"
              >
                <LightBulbIcon className="w-4 h-4" />
                <span>提示</span>
              </button>
            </div>

            {showHints && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-yellow-800 mb-2">提示</h4>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                  {hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Editor container with shake animation */}
            <div
              ref={editorContainerRef}
              className={isShaking ? 'animate-shake' : ''}
            >
              <CodeEditor
                value={code}
                onChange={setCode}
                height="300px"
                language={level.type === 'qmd' ? 'markdown' : 'markdown'}
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPrevLevel}
                  disabled={level.id === 1}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNextLevel}
                  disabled={level.id === levels.length}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || status.completed}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  status.completed
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                } disabled:opacity-50`}
              >
                {status.completed ? '已完成' : isSubmitting ? '提交中...' : '提交答案'}
              </button>
            </div>

            {/* Success result with fade-in animation */}
            {result && result.correct && (
              <div className="mt-4 p-4 rounded-lg flex items-start space-x-3 bg-green-50 text-green-800 animate-fade-in-up">
                <CheckCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">
                    🎉 回答正确！
                  </p>
                  {result.message && (
                    <p className="text-sm mt-1 whitespace-pre-line">{result.message}</p>
                  )}
                  {level.id < levels.length && (
                    <button
                      onClick={goToNextLevel}
                      className="mt-3 text-sm bg-white px-3 py-1 rounded border border-current hover:bg-gray-50 transition-colors"
                    >
                      进入下一关 →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">实时预览</h3>
          <div className="prose prose-blue max-w-none">
            <MarkdownPreview content={code} />
          </div>
        </div>
      </div>
    </div>
  );
}
