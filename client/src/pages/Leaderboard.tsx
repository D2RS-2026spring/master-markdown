import { useEffect, useState } from 'react';
import { leaderboardApi } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import type { LeaderboardEntry } from '../types';
import { TrophyIcon } from '@heroicons/react/24/solid';

export default function Leaderboard() {
  const { user } = useAuthStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<{ rank: number; totalScore?: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await leaderboardApi.getAll();
        setLeaderboard(data);

        if (user) {
          const rank = await leaderboardApi.getRank(user.id);
          setUserRank(rank);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-2xl">🥇</span>;
      case 2:
        return <span className="text-2xl">🥈</span>;
      case 3:
        return <span className="text-2xl">🥉</span>;
      default:
        return <span className="text-gray-500 font-medium">{rank}</span>;
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <TrophyIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">积分排行榜</h1>
        <p className="text-gray-600">与其他玩家一起竞技，展示你的 Markdown 技能</p>
      </div>

      {userRank && userRank.rank > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold text-blue-600">#{userRank.rank}</div>
              <div>
                <p className="font-medium text-gray-900">你的排名</p>
                <p className="text-sm text-gray-500">继续加油，向更高名次进发！</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-600">{userRank.totalScore}</p>
              <p className="text-sm text-gray-500">总积分</p>
            </div>
          </div>
        </div>
      )}

      {leaderboard.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500 text-lg">还没有玩家上榜</p>
          <p className="text-gray-400 text-sm mt-2">完成关卡获得积分，成为第一个上榜的玩家！</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">排名</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">玩家</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">完成关卡</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">总积分</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboard.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={entry.id === user?.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center w-10">
                      {getRankIcon(index + 1)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        {entry.nickname[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{entry.nickname}</span>
                      {entry.id === user?.id && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">你</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    {entry.completedLevels}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-yellow-600">{entry.totalScore}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
