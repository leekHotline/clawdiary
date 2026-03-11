import Link from "next/link";
import { getUserChallenges, getChallengeCategories } from "@/lib/challenges";

export const metadata = {
  title: "我的挑战 - Claw Diary",
  description: "查看我参与的挑战进度",
};

const statusColors = {
  active: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  paused: "bg-gray-100 text-gray-700",
};

const statusLabels = {
  active: "进行中",
  completed: "已完成",
  paused: "已暂停",
};

export default async function MyChallengesPage() {
  // 模拟用户ID，实际应从session获取
  const userId = "demo-user";
  const [userChallenges, categories] = await Promise.all([
    getUserChallenges(userId),
    getChallengeCategories(),
  ]);

  const activeChallenges = userChallenges.filter(
    ({ challenge }) => challenge.status === "active"
  );
  const completedChallenges = userChallenges.filter(
    ({ challenge, progress }) => progress.current >= challenge.goal
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 right-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-10 w-56 h-56 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-3xl mx-auto px-6 pt-8 pb-16">
        {/* 返回 */}
        <Link href="/challenges" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <span>←</span>
          <span>返回挑战中心</span>
        </Link>

        {/* 头部 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">我的挑战</h1>
          <p className="text-gray-500 mt-1">追踪你的挑战进度</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm">
            <div className="text-3xl font-bold text-indigo-600">{activeChallenges.length}</div>
            <div className="text-sm text-gray-500 mt-1">进行中</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600">{completedChallenges.length}</div>
            <div className="text-sm text-gray-500 mt-1">已完成</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm">
            <div className="text-3xl font-bold text-amber-600">0</div>
            <div className="text-sm text-gray-500 mt-1">徽章</div>
          </div>
        </div>

        {userChallenges.length === 0 ? (
          /* 空状态 */
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">还没有参与任何挑战</h3>
            <p className="text-gray-500 mb-6">去挑战中心选择一个感兴趣的挑战吧！</p>
            <Link
              href="/challenges"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              浏览挑战
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 进行中的挑战 */}
            {activeChallenges.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🔥</span>
                  <span>进行中</span>
                </h2>
                <div className="space-y-4">
                  {activeChallenges.map(({ challenge, progress }) => {
                    const percentage = Math.min(100, Math.round((progress.current / challenge.goal) * 100));
                    return (
                      <Link
                        key={challenge.id}
                        href={`/challenges/${challenge.id}`}
                        className="block bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{challenge.title.split(" ")[0]}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">
                              {challenge.title.split(" ").slice(1).join(" ")}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3">{challenge.description}</p>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-600">
                                {progress.current}/{challenge.goal}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-amber-600 font-bold">+{challenge.rewards.points}</div>
                            <div className="text-xs text-gray-400">积分</div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 已完成的挑战 */}
            {completedChallenges.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>✅</span>
                  <span>已完成</span>
                </h2>
                <div className="space-y-4">
                  {completedChallenges.map(({ challenge }) => (
                    <Link
                      key={challenge.id}
                      href={`/challenges/${challenge.id}`}
                      className="block bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl opacity-75">{challenge.title.split(" ")[0]}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-600 line-through">
                            {challenge.title.split(" ").slice(1).join(" ")}
                          </h3>
                          <p className="text-sm text-gray-400">{challenge.rewards.badge || "已完成"}</p>
                        </div>
                        <div className="text-green-500 text-xl">✓</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 发现更多 */}
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold mb-1">发现更多挑战</h3>
              <p className="text-white/80 text-sm">找到适合你的新挑战</p>
            </div>
            <Link
              href="/challenges"
              className="px-5 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              去看看
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}