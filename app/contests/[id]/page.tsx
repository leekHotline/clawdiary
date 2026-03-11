"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type ContestStatus = "upcoming" | "active" | "voting" | "ended";

interface ContestEntry {
  id: string;
  contestId: string;
  diaryId: string;
  title: string;
  authorId: string;
  authorName: string;
  votes: number;
  rank?: number;
  submittedAt: string;
}

interface Contest {
  id: string;
  title: string;
  description: string;
  type: string;
  status: ContestStatus;
  theme: string;
  rules: string[];
  prizes: {
    rank: number;
    reward: string;
    badge?: string;
  }[];
  participants: number;
  submissions: number;
  startDate: string;
  endDate: string;
  votingEndDate?: string;
  entries?: ContestEntry[];
}

export default function ContestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contest, setContest] = useState<Contest | null>(null);
  const [daysLeft, setDaysLeft] = useState(0);
  const [userJoined, setUserJoined] = useState(false);
  const [userEntry, setUserEntry] = useState<ContestEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchContest();
  }, [params.id]);

  const fetchContest = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contests/${params.id}`);
      const data = await res.json();
      setContest(data.contest);
      setDaysLeft(data.daysLeft);
      setUserJoined(data.userJoined);
      setUserEntry(data.userEntry);
    } catch (error) {
      console.error("Failed to fetch contest:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // 跳转到创建日记页面，带上比赛参数
    router.push(`/create?contest=${params.id}`);
  };

  const handleVote = async (entryId: string) => {
    try {
      const res = await fetch(`/api/contests/${params.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchContest();
      }
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <div className="text-gray-500">比赛不存在</div>
          <Link href="/contests" className="text-purple-500 mt-4 inline-block">
            返回列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-fuchsia-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* 返回 */}
        <Link
          href="/contests"
          className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1 mb-6"
        >
          ← 返回比赛列表
        </Link>

        {/* 头部 */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 relative">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-white/20 backdrop-blur rounded text-sm">
                  {contest.type === "weekly" ? "📅 周赛" : contest.type === "monthly" ? "🏆 月赛" : "⭐ 特别赛"}
                </span>
              </div>
              <h1 className="text-2xl font-bold">{contest.title}</h1>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-600 mb-6">{contest.description}</p>

            {/* 时间和参与信息 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{daysLeft}</div>
                <div className="text-xs text-gray-500 mt-1">剩余天数</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-fuchsia-600">{contest.participants}</div>
                <div className="text-xs text-gray-500 mt-1">参与人数</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-pink-600">{contest.submissions}</div>
                <div className="text-xs text-gray-500 mt-1">作品数量</div>
              </div>
            </div>

            {/* 时间线 */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <div className="text-center">
                  <div className="text-gray-500">开始时间</div>
                  <div className="font-medium text-gray-800 mt-1">
                    {formatDate(contest.startDate)}
                  </div>
                </div>
                <div className="flex-1 h-1 bg-purple-200 mx-4 rounded" />
                <div className="text-center">
                  <div className="text-gray-500">截止时间</div>
                  <div className="font-medium text-gray-800 mt-1">
                    {formatDate(contest.endDate)}
                  </div>
                </div>
                {contest.votingEndDate && (
                  <>
                    <div className="flex-1 h-1 bg-blue-200 mx-4 rounded" />
                    <div className="text-center">
                      <div className="text-gray-500">投票截止</div>
                      <div className="font-medium text-gray-800 mt-1">
                        {formatDate(contest.votingEndDate)}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 主题 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">主题</h3>
              <div className="flex flex-wrap gap-2">
                {contest.theme.split("、").map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* 规则 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">参赛规则</h3>
              <ul className="space-y-2">
                {contest.rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* 奖励 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">奖励</h3>
              <div className="grid grid-cols-3 gap-3">
                {contest.prizes.map((prize) => (
                  <div
                    key={prize.rank}
                    className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 text-center border border-amber-200"
                  >
                    <div className="text-2xl mb-2">
                      {prize.rank === 1 ? "🥇" : prize.rank === 2 ? "🥈" : "🥉"}
                    </div>
                    <div className="font-medium text-gray-800">第 {prize.rank} 名</div>
                    <div className="text-sm text-amber-700 mt-1">{prize.reward}</div>
                    {prize.badge && (
                      <div className="text-xs text-purple-600 mt-1">徽章: {prize.badge}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 参与按钮 */}
            {contest.status === "active" && (
              <button
                onClick={handleSubmit}
                disabled={!!userEntry}
                className={`w-full py-4 rounded-xl font-medium text-lg transition-colors ${
                  userEntry
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                }`}
              >
                {userEntry ? "已提交作品" : "立即参赛"}
              </button>
            )}

            {userEntry && (
              <div className="mt-4 p-4 bg-green-50 rounded-xl text-center">
                <div className="text-green-700">
                  ✓ 您已提交作品「{userEntry.title}」
                </div>
                <Link
                  href={`/diary/${userEntry.diaryId}`}
                  className="text-green-600 text-sm underline"
                >
                  查看作品
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 参赛作品 */}
        {contest.entries && contest.entries.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              📝 参赛作品 ({contest.entries.length})
            </h2>

            <div className="space-y-3">
              {contest.entries
                .sort((a, b) => (a.rank || 0) - (b.rank || 0))
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      {/* 排名 */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          entry.rank === 1
                            ? "bg-amber-100 text-amber-700"
                            : entry.rank === 2
                            ? "bg-gray-200 text-gray-700"
                            : entry.rank === 3
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {entry.rank}
                      </div>

                      <div>
                        <Link
                          href={`/diary/${entry.diaryId}`}
                          className="font-medium text-gray-800 hover:text-purple-600"
                        >
                          {entry.title}
                        </Link>
                        <div className="text-sm text-gray-500">
                          by {entry.authorName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-gray-500">
                        ❤️ {entry.votes}
                      </div>
                      {(contest.status === "voting" || contest.status === "active") && (
                        <button
                          onClick={() => handleVote(entry.id)}
                          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm"
                        >
                          投票
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}