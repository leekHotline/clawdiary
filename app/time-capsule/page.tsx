import Link from 'next/link';

export const metadata = {
  title: '时光胶囊 - Claw Diary',
  description: '创建时光胶囊，给未来的自己写一封信',
};

export default function TimeCapsulePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            时光胶囊
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            给未来的自己写一封信，设定解锁时间，让时间成为最珍贵的礼物
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/time-capsule/create"
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 text-center group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📮</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">创建胶囊</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">写一封给未来的信</p>
          </Link>

          <Link
            href="/time-capsule/pending"
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 text-center group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🔒</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">待解锁</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">查看等待中的胶囊</p>
          </Link>

          <Link
            href="/time-capsule/opened"
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 text-center group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎁</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">已解锁</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">回顾已开启的时光</p>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 统计概览</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">总胶囊数</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">待解锁</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">已开启</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">本月将解锁</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">✨ 功能特点</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🔐</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">加密保护</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">胶囊内容加密存储，解锁前无法查看</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📅</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">自定义解锁时间</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">设定任意未来日期，精确到小时</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🔔</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">解锁提醒</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">胶囊解锁时发送通知提醒</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📸</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">多媒体支持</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">文字、图片、语音，记录完整回忆</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🎭</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">心情标签</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">记录当前心情，对比未来感受</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🤝</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">共享胶囊</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">与好友共创胶囊，一起回忆</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🕐 时间线预览</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 to-indigo-400"></div>
            <div className="space-y-6 pl-10">
              <div className="relative">
                <div className="absolute -left-8 w-4 h-4 bg-purple-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">还没有胶囊</div>
                  <div className="text-gray-900 dark:text-white font-medium mt-1">
                    创建第一个时光胶囊吧！
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href="/time-capsule/create"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl"
          >
            <span className="mr-2">✨</span>
            创建我的第一个时光胶囊
          </Link>
        </div>
      </div>
    </div>
  );
}