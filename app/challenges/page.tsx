import Link from "next/link";
import { getChallenges, getChallengeCategories, getRecommendedChallenges } from "@/lib/challenges";

export const metadata = {
  title: "🏆 挑战中心 - Claw Diary",
  description: "参与挑战，养成写日记习惯，解锁成就徽章",
};

const difficultyColors = {
  easy: "bg-green-100 text-green-700 border-green-200",
  normal: "bg-blue-100 text-blue-700 border-blue-200",
  hard: "bg-orange-100 text-orange-700 border-orange-200",
  extreme: "bg-red-100 text-red-700 border-red-200",
};

const difficultyLabels = {
  easy: "简单",
  normal: "普通",
  hard: "困难",
  extreme: "地狱",
};

export default async function ChallengesPage() {
  const [challenges, categories, recommendations] = await Promise.all([
    getChallenges(20, 0),
    getChallengeCategories(),
    getRecommendedChallenges(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-10 w-56 h-56 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-4 text-sm">
            <span>←</span>
            <span>返回首页</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl">🏆</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">挑战中心</h1>
              <p className="text-gray-500">参与挑战，养成习惯，解锁成就</p>
            </div>
          </div>
        </div>

        {/* 快速统计 */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { value: challenges.length, label: "进行中", color: "text-purple-600", bg: "bg-purple-50" },
            { value: "12", label: "徽章", color: "text-amber-600", bg: "bg-amber-50" },
            { value: "350", label: "积分", color: "text-green-600", bg: "bg-green-50" },
            { value: "7", label: "连胜", color: "text-orange-600", bg: "bg-orange-50" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} rounded-2xl p-4 text-center shadow-sm border border-white/50`}
            >
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 推荐挑战 */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span>⭐</span>
              <span>推荐挑战</span>
            </h2>
            <Link href="/challenges/leaderboard" className="text-sm text-purple-600 hover:text-purple-700">
              查看排行 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.slice(0, 4).map((challenge) => (
              <Link
                key={challenge.id}
                href={`/challenges/${challenge.id}`}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50 hover:shadow-md hover:border-purple-200 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{challenge.title.split(" ")[0]}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${difficultyColors[challenge.difficulty]}`}>
                      {difficultyLabels[challenge.difficulty]}
                    </span>
                  </div>
                  <span className="text-amber-600 font-bold text-sm">+{challenge.rewards.points}分</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">
                  {challenge.title.split(" ").slice(1).join(" ")}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{challenge.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>🎯 目标: {challenge.goal}{challenge.unit}</span>
                  <span>👥 {challenge.participants.length}人参与</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 挑战分类 */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📂</span>
            <span>挑战分类</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/challenges?category=${category.id}`}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-4 hover:bg-white/90 transition-all border border-white/50 hover:shadow-sm"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="font-medium text-gray-800">{category.name}</div>
                <div className="text-xs text-gray-500 mt-1">{category.description}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* 全部挑战 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span>🎯</span>
              <span>全部挑战</span>
            </h2>
            <Link
              href="/challenges/create"
              className="text-sm px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              + 创建挑战
            </Link>
          </div>

          <div className="space-y-3">
            {challenges.map((challenge) => (
              <Link
                key={challenge.id}
                href={`/challenges/${challenge.id}`}
                className="group block bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50 hover:shadow-md hover:border-purple-200 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{challenge.title.split(" ")[0]}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                        {challenge.title.split(" ").slice(1).join(" ")}
                      </h3>
                      <p className="text-sm text-gray-500">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-600 font-bold">+{challenge.rewards.points}</div>
                    <div className="text-xs text-gray-400">{challenge.goal} {challenge.unit}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs">
                  <span className={`px-2 py-0.5 rounded-full border ${difficultyColors[challenge.difficulty]}`}>
                    {difficultyLabels[challenge.difficulty]}
                  </span>
                  <span className="text-gray-400">👥 {challenge.participants.length}人参与</span>
                  <span className="text-gray-400">✅ {challenge.completions}人完成</span>
                  {challenge.duration > 0 && (
                    <span className="text-gray-400">⏱️ {challenge.duration}天</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 我的挑战入口 */}
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">查看我的挑战</h3>
              <p className="text-white/80 text-sm">追踪进度，解锁徽章</p>
            </div>
            <Link
              href="/challenges/my"
              className="px-6 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              我的挑战 →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}