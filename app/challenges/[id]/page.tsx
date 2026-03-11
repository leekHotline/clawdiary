import { notFound } from "next/navigation";
import Link from "next/link";
import { getChallengeById, getChallengeProgress } from "@/lib/challenges";

export const metadata = {
  title: "挑战详情 - Claw Diary",
};

const difficultyColors = {
  easy: "bg-green-100 text-green-700",
  normal: "bg-blue-100 text-blue-700",
  hard: "bg-orange-100 text-orange-700",
  extreme: "bg-red-100 text-red-700",
};

const difficultyLabels = {
  easy: "简单",
  normal: "普通",
  hard: "困难",
  extreme: "地狱",
};

export default async function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challenge = await getChallengeById(id);

  if (!challenge) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-10 w-56 h-56 bg-pink-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-3xl mx-auto px-6 pt-8 pb-16">
        {/* 返回 */}
        <Link href="/challenges" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <span>←</span>
          <span>返回挑战列表</span>
        </Link>

        {/* 挑战头图 */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 text-white mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{challenge.title.split(" ")[0]}</span>
            <span className={`px-3 py-1 rounded-full text-sm ${difficultyColors[challenge.difficulty]}`}>
              {difficultyLabels[challenge.difficulty]}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {challenge.title.split(" ").slice(1).join(" ")}
          </h1>
          <p className="text-white/80">{challenge.description}</p>
        </div>

        {/* 挑战信息 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{challenge.goal}</div>
            <div className="text-sm text-gray-500">{challenge.unit}</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{challenge.duration > 0 ? `${challenge.duration}天` : "无限期"}</div>
            <div className="text-sm text-gray-500">持续时间</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-amber-600">+{challenge.rewards.points}</div>
            <div className="text-sm text-gray-500">积分奖励</div>
          </div>
        </div>

        {/* 奖励 */}
        {challenge.rewards.badge && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-6 border border-amber-200">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>🏅</span>
              <span>完成奖励</span>
            </h3>
            <div className="flex items-center gap-4">
              <div className="text-4xl">{challenge.rewards.badge.split(" ")[0]}</div>
              <div>
                <div className="font-semibold text-gray-800">{challenge.rewards.badge.split(" ").slice(1).join(" ")}</div>
                <div className="text-sm text-gray-500">专属徽章</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-xl font-bold text-amber-600">+{challenge.rewards.points}</div>
                <div className="text-sm text-gray-500">积分</div>
              </div>
            </div>
          </div>
        )}

        {/* 参与统计 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📊</span>
            <span>参与统计</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600">{challenge.participants.length}</div>
              <div className="text-sm text-gray-500 mt-1">参与人数</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600">{challenge.completions}</div>
              <div className="text-sm text-gray-500 mt-1">完成人数</div>
            </div>
          </div>
          {challenge.participants.length > 0 && (
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${Math.round((challenge.completions / challenge.participants.length) * 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center">
                完成率: {Math.round((challenge.completions / challenge.participants.length) * 100)}%
              </div>
            </div>
          )}
        </div>

        {/* 参与者列表 */}
        {challenge.participants.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>👥</span>
              <span>参与者</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {challenge.participants.slice(0, 10).map((participant) => (
                <div
                  key={participant.userId}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {participant.userId.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700">{participant.userId}</span>
                  {participant.completed && <span className="text-green-500">✓</span>}
                </div>
              ))}
              {challenge.participants.length > 10 && (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  +{challenge.participants.length - 10} 更多
                </div>
              )}
            </div>
          </div>
        )}

        {/* 参与按钮 */}
        <div className="flex gap-3">
          <button className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-md">
            🎯 立即参与
          </button>
          <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            分享
          </button>
        </div>
      </main>
    </div>
  );
}