import { Link } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { useAuthStore } from '../stores/authStore';
import { UserCircleIcon } from '@heroicons/react/24/solid';

export default function Navbar() {
  const { totalScore, completedLevels } = useGameStore();
  const { user } = useAuthStore();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">MD Master</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/levels" className="text-gray-700 hover:text-blue-600 font-medium">
              关卡
            </Link>
            <Link to="/leaderboard" className="text-gray-700 hover:text-blue-600 font-medium">
              排行榜
            </Link>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full">
                <span className="text-yellow-600 text-sm">积分:</span>
                <span className="text-yellow-700 font-bold">{totalScore}</span>
              </div>
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <span className="text-green-600 text-sm">已完成:</span>
                <span className="text-green-700 font-bold">{completedLevels}</span>
              </div>
            </div>

            <Link
              to="/profile"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
              title="个人中心"
            >
              <UserCircleIcon className="w-7 h-7" />
              <span className="text-sm font-medium max-w-[80px] truncate">
                {user?.nickname || '匿名玩家'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
