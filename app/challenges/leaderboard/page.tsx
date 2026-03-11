import Link from "next/link";
import { getChallengeLeaderboard } from "@/lib/challenges";

export const metadata = {
  title: "🏆 排行榜 - Claw Diary",
  description: "挑战排行榜，看看谁是日记达人",
};

export default async function LeaderboardPage() {
  const leaderboard = await getChallengeLeaderboard("all", 20);

  const rankColors = [
    "from-amber-400 to-yellow-300", // 1st
    "from-gray-300 to-gray-200", // 2nd
    "from-orange-400 to-orange-300", // 3rd
  ];

  const rankEmojis = ["🥇", "🥈", "🥉"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-3xl mx-auto px-6 pt-8 pb-16">
        {/* 返回 */}
        <Link href="/challenges" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <span>←</span>
          <span>返回挑战中心</span>
        </Link>

        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">排行榜</h1>
          <p className="text-gray-500">看看谁是日记达人</p>
        </div>

        {/* 前三名 */}
        <div className="flex justify-center items-end gap-4 mb-10">
          {leaderboard.slice(0, 3).map((entry, index) => (
            <div
              key={entry.userId}
              className={`relative ${index === 0 ? "order-2" : index === 1 ? "order-1" : "order-3"}`}
            >
              {index === 0 && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl">👑</div>
              )}
              <div
                className={`bg-gradient-to-br ${rankColors[index]} rounded-2xl p-4 text-center ${
                  index === 0 ? "w-36" : "w-28"
                }`}
              >
                <div className="text-3xl mb-2">{rankEmojis[index]}</div>
                <div className="w-12 h-12 mx-auto bg-white/50 rounded-full flex items-center justify-center text-xl font-bold text-gray-700 mb-2">
                  {entry.userName.charAt(0)}
                </div>
                <div className="font-bold text-gray-800 text-sm truncate">{entry.userName}</div>
                <div className="text-xs text-gray-600 mt-1">{entry.totalPoints} 分</div>
                <div className="text-xs text-gray-500 mt-1">🔥 {entry.streak}天连胜</div>
              </div>
            </div>
          ))}
        </div>

        {/* 完整榜单 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800">完整榜单</h2>
            <div className="flex gap-2 text-xs">
              <button className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full">全部</button>
              <button className="px-3 py-1 text-gray-500 hover:bg-gray-100 rounded-full">本周</button>
              <button className="px-3 py-1 text-gray-500 hover:bg-gray-100 rounded-full">本月</button>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {leaderboard.slice(3).map((entry) => (
              <div
                key={entry.userId}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 text-center font-bold text-gray-400">
                  {entry.rank}
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium">
                  {entry.userName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{entry.userName}</div>
                  <div className="text-xs text-gray-500">
                    🔥 {entry.streak}天连胜 · {entry.completedChallenges}个挑战
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-amber-600">{entry.totalPoints}</div>
                  <div className="text-xs text-gray-400">积分</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 我的排名 */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                🦞
              </div>
              <div>
                <div className="font-medium">我的排名</div>
                <div className="text-sm text-white/80">继续努力，冲刺榜单！</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">#12</div>
              <div className="text-sm text-white/80">280 积分</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}