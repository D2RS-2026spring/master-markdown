import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalScore } = useGameStore();

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

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full">
                  <span className="text-yellow-600 text-sm">积分:</span>
                  <span className="text-yellow-700 font-bold">{totalScore}</span>
                </div>

                <Link to="/profile" className="flex items-center space-x-2 hover:opacity-80">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      {user?.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="text-gray-700 font-medium hidden sm:block">{user?.username}</span>
                </Link>

                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-red-600 text-sm font-medium"
                >
                  退出
                </button>
              </div>
            ) : (
              <button
                onClick={() => window.location.href = '/auth/github'}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                GitHub 登录
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
