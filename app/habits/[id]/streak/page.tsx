'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Flame, 
  Trophy,
  Target,
  TrendingUp,
  Medal,
  Star,
  Zap,
  Calendar,
  Gift
} from 'lucide-react';

interface StreakData {
  id: string;
  name: string;
  icon: string;
  color: string;
  currentStreak: number;
  longestStreak: number;
  totalStreaks: number;
  streakHistory: {
    streak: number;
    startDate: string;
    endDate: string;
    reason?: string;
  }[];
  milestones: {
    days: number;
    achieved: boolean;
    achievedDate?: string;
    reward: string;
  }[];
  recentActivity: {
    date: string;
    completed: boolean;
    streakAfter: number;
  }[];
}

export default function HabitStreakPage() {
  const params = useParams();
  const router = useRouter();
  const habitId = params.id as string;
  
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreakData();
  }, [habitId]);

  const fetchStreakData = async () => {
    try {
      const res = await fetch(`/api/habits/${habitId}/streak`);
      if (res.ok) {
        const data = await res.json();
        setStreakData(data);
      } else {
        // Mock data
        setStreakData(generateMockData());
      }
    } catch (error) {
      setStreakData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (): StreakData => {
    const milestones = [7, 14, 21, 30, 60, 90, 100, 180, 365].map((days, index) => ({
      days,
      achieved: 7 >= days,
      achievedDate: 7 >= days ? new Date(Date.now() - (7 - days) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      reward: getReward(index)
    }));

    return {
      id: habitId,
      name: '晨间冥想',
      icon: '🧘',
      color: '#8B5CF6',
      currentStreak: 7,
      longestStreak: 21,
      totalStreaks: 5,
      streakHistory: [
        { streak: 7, startDate: '2026-03-05', endDate: '今天', reason: '当前连续' },
        { streak: 21, startDate: '2026-01-15', endDate: '2026-02-04', reason: '春节坚持练习' },
        { streak: 14, startDate: '2025-12-01', endDate: '2025-12-14' },
        { streak: 10, startDate: '2025-11-01', endDate: '2025-11-10' },
        { streak: 5, startDate: '2025-10-15', endDate: '2025-10-19' },
      ],
      milestones,
      recentActivity: generateRecentActivity()
    };
  };

  const generateRecentActivity = () => {
    const activity = [];
    let streak = 7;
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const completed = i < 7 ? true : Math.random() > 0.3;
      activity.push({
        date: date.toISOString().split('T')[0],
        completed,
        streakAfter: completed ? streak - i : 0
      });
    }
    return activity.reverse();
  };

  const getReward = (index: number): string => {
    const rewards = [
      '初学者徽章 🌱',
      '坚持一周 🌟',
      '两周达人 ✨',
      '习惯养成者 🏆',
      '双月强者 💪',
      '三个月大师 🎯',
      '百日传奇 ⭐',
      '半年英雄 🔥',
      '年度巨匠 👑'
    ];
    return rewards[index] || '传奇成就 🌟';
  };

  const getNextMilestone = () => {
    if (!streakData) return null;
    return streakData.milestones.find(m => !m.achieved);
  };

  const getProgressToNextMilestone = () => {
    const next = getNextMilestone();
    if (!next || !streakData) return 100;
    const prev = streakData.milestones.filter(m => m.achieved).pop();
    const prevDays = prev?.days || 0;
    return Math.round(((streakData.currentStreak - prevDays) / (next.days - prevDays)) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!streakData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <p className="text-gray-500">习惯不存在</p>
      </div>
    );
  }

  const nextMilestone = getNextMilestone();
  const progress = getProgressToNextMilestone();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{streakData.icon}</span>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{streakData.name}</h1>
                <p className="text-sm text-gray-500">连续记录详情</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Current Streak Hero */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          <div className="relative">
            <Flame className="w-16 h-16 mx-auto mb-4 animate-pulse" />
            <p className="text-sm opacity-80 mb-2">当前连续</p>
            <p className="text-7xl font-bold mb-2">{streakData.currentStreak}</p>
            <p className="text-xl">天</p>
          </div>
        </div>

        {/* Progress to Next Milestone */}
        {nextMilestone && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-500" />
                下一个里程碑
              </h3>
              <span className="text-2xl font-bold text-orange-500">{nextMilestone.days} 天</span>
            </div>
            <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">已连续 {streakData.currentStreak} 天</span>
              <span className="text-orange-500 font-medium">还需 {nextMilestone.days - streakData.currentStreak} 天</span>
            </div>
            <div className="mt-4 p-3 bg-orange-50 rounded-lg flex items-center gap-3">
              <Gift className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-700">奖励：{nextMilestone.reward}</span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold text-gray-800">{streakData.longestStreak}</p>
            <p className="text-xs text-gray-500">最长连续</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold text-gray-800">{streakData.totalStreaks}</p>
            <p className="text-xs text-gray-500">连续次数</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <Medal className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold text-gray-800">
              {streakData.milestones.filter(m => m.achieved).length}
            </p>
            <p className="text-xs text-gray-500">里程碑</p>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            里程碑成就
          </h3>
          <div className="space-y-3">
            {streakData.milestones.map((milestone, index) => (
              <div 
                key={milestone.days}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  milestone.achieved 
                    ? 'border-yellow-400 bg-yellow-50' 
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    milestone.achieved ? 'bg-yellow-400' : 'bg-gray-200'
                  }`}>
                    <span className="text-lg font-bold text-white">{milestone.days}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{milestone.days} 天里程碑</p>
                    <p className="text-sm text-gray-500">{milestone.reward}</p>
                  </div>
                </div>
                {milestone.achieved ? (
                  <div className="text-right">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <p className="text-xs text-gray-400 mt-1">{milestone.achievedDate}</p>
                  </div>
                ) : (
                  <div className="text-right">
                    <Zap className="w-6 h-6 text-gray-300" />
                    <p className="text-xs text-gray-400 mt-1">未达成</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Streak History */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            连续记录历史
          </h3>
          <div className="space-y-2">
            {streakData.streakHistory.map((record, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{record.streak} 天连续</p>
                    <p className="text-sm text-gray-500">
                      {record.startDate} - {record.endDate}
                    </p>
                  </div>
                </div>
                {record.reason && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                    {record.reason}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">最近 14 天活动</h3>
          <div className="grid grid-cols-7 gap-2">
            {streakData.recentActivity.map((activity, index) => (
              <div 
                key={index}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs ${
                  activity.completed 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-50 text-red-400'
                }`}
              >
                <span className="font-medium">
                  {new Date(activity.date).getDate()}
                </span>
                {activity.completed && (
                  <Flame className="w-3 h-3 mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// Add missing import
function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}