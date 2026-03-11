"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type ContestStatus = "upcoming" | "active" | "voting" | "ended";
type ContestType = "weekly" | "monthly" | "special";

interface Contest {
  id: string;
  title: string;
  description: string;
  type: ContestType;
  status: ContestStatus;
  theme: string;
  participants: number;
  submissions: number;
  startDate: string;
  endDate: string;
  prizes: {
    rank: number;
    reward: string;
    badge?: string;
  }[];
}

const statusConfig: Record<ContestStatus, { label: string; color: string; bg: string }> = {
  active: { label: "进行中", color: "text-green-700", bg: "bg-green-100" },
  voting: { label: "投票中", color: "text-blue-700", bg: "bg-blue-100" },
  upcoming: { label: "即将开始", color: "text-amber-700", bg: "bg-amber-100" },
  ended: { label: "已结束", color: "text-gray-700", bg: "bg-gray-100" },
};

const typeConfig: Record<ContestType, { label: string; icon: string }> = {
  weekly: { label: "周赛", icon: "📅" },
  monthly: { label: "月赛", icon: "🏆" },
  special: { label: "特别赛", icon: "⭐" },
};

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, upcoming: 0, totalParticipants: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ContestStatus | "all">("all");

  useEffect(() => {
    fetchContests();
  }, [filter]);

  const fetchContests = async () => {
    setLoading(true);
    try {
      const url = filter === "all" ? "/api/contests" : `/api/contests?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setContests(data.contests || []);
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch contests:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-fuchsia-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* 头部 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold text-gray-800">写作大赛</h1>
          <p className="text-gray-500 mt-2">展示才华，赢取奖励</p>
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{stats.active}</div>
            <div className="text-xs text-gray-500 mt-1">进行中</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-amber-600">{stats.upcoming}</div>
            <div className="text-xs text-gray-500 mt-1">即将开始</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-pink-600">{stats.totalParticipants}</div>
            <div className="text-xs text-gray-500 mt-1">参与人次</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-fuchsia-600">{stats.total}</div>
            <div className="text-xs text-gray-500 mt-1">总比赛数</div>
          </div>
        </div>

        {/* 筛选 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(["all", "active", "voting", "upcoming", "ended"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === s
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {s === "all" ? "全部" : statusConfig[s].label}
            </button>
          ))}
        </div>

        {/* 比赛列表 */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : contests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎉</div>
            <div className="text-gray-500">暂无比赛</div>
          </div>
        ) : (
          <div className="space-y-4">
            {contests.map((contest) => (
              <Link
                key={contest.id}
                href={`/contests/${contest.id}`}
                className="block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* 顶部颜色条 */}
                <div
                  className={`h-2 ${
                    contest.status === "active"
                      ? "bg-gradient-to-r from-green-400 to-emerald-500"
                      : contest.status === "voting"
                      ? "bg-gradient-to-r from-blue-400 to-cyan-500"
                      : contest.status === "upcoming"
                      ? "bg-gradient-to-r from-amber-400 to-orange-500"
                      : "bg-gradient-to-r from-gray-300 to-gray-400"
                  }`}
                />

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm px-2 py-1 bg-purple-100 text-purple-700 rounded-lg">
                        {typeConfig[contest.type].icon} {typeConfig[contest.type].label}
                      </span>
                      <span
                        className={`text-sm px-2 py-1 rounded-lg ${
                          statusConfig[contest.status].bg
                        } ${statusConfig[contest.status].color}`}
                      >
                        {statusConfig[contest.status].label}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {contest.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {contest.description}
                  </p>

                  {/* 主题标签 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {contest.theme.split("、").map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* 信息 */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>👥 {contest.participants} 人参与</span>
                      <span>📝 {contest.submissions} 篇作品</span>
                    </div>
                    <span>
                      {formatDate(contest.startDate)} - {formatDate(contest.endDate)}
                    </span>
                  </div>

                  {/* 奖励预览 */}
                  {contest.prizes.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                      <span className="text-xs text-gray-500">奖励:</span>
                      {contest.prizes.slice(0, 3).map((prize) => (
                        <span
                          key={prize.rank}
                          className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded"
                        >
                          🥇 #{prize.rank}: {prize.badge || prize.reward}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}