import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  BookOpenIcon,
  TrophyIcon,
  CodeBracketIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: BookOpenIcon,
      title: '渐进式学习',
      description: '从 Markdown 基础到 Quarto Markdown 进阶，循序渐进掌握知识'
    },
    {
      icon: CodeBracketIcon,
      title: '实时代码编辑',
      description: '内置 Monaco 编辑器，提供专业级的代码编辑体验'
    },
    {
      icon: TrophyIcon,
      title: '积分排行榜',
      description: '与全球玩家竞技，登上积分排行榜'
    },
    {
      icon: RocketLaunchIcon,
      title: '实战练习',
      description: '20+ 精心设计的关卡，巩固所学知识'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          掌握 <span className="text-blue-600">Markdown</span> 与{' '}
          <span className="text-green-600">Quarto</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          通过有趣的闯关游戏，从零开始学习 Markdown 和 Quarto Markdown。
          完成挑战，获得积分，成为 MD Master！
        </p>

        <div className="flex justify-center space-x-4">
          {isAuthenticated ? (
            <Link
              to="/levels"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              开始闯关
            </Link>
          ) : (
            <>
              <button
                onClick={() => window.location.href = '/auth/github'}
                className="bg-gray-900 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                GitHub 登录
              </button>
              <Link
                to="/levels"
                className="bg-white text-gray-900 border-2 border-gray-300 px-8 py-3 rounded-lg text-lg font-semibold hover:border-gray-400 transition-colors"
              >
                试玩
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 py-12">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex-shrink-0">
              <feature.icon className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">准备好开始了吗？</h2>
        <p className="text-blue-100 mb-6">
          20 个精心设计的关卡，从入门到精通，等你来挑战！
        </p>
        <Link
          to="/levels"
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          查看所有关卡
        </Link>
      </div>
    </div>
  );
}
