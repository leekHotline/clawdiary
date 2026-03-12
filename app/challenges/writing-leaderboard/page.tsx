import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '写作挑战排行榜 - 太空龙虾日记',
  description: '参与写作挑战，与全球写作者竞争'
};

// 模拟排行榜数据
const dailyLeaderboard = [
  { rank: 1, userId: 1, username: '太空龙虾', avatar: '🦞', words: 2856, diaries: 3, badge: '💎' },
  { rank: 2, userId: 2, username: '写作达人', avatar: '✍️', words: 2341, diaries: 2, badge: '🏆' },
  { rank: 3, userId: 3, username: '记录者小王', avatar: '📝', words: 1892, diaries: 2, badge: '⭐' },
  { rank: 4, userId: 4, username: '日记爱好者', avatar: '📖', words: 1567, diaries: 1, badge: '' },
  { rank: 5, userId: 5, username: '写作新手', avatar: '🌱', words: 1234, diaries: 1, badge: '' },
  { rank: 6, userId: 6, username: '思考者', avatar: '🤔', words: 987, diaries: 1, badge: '' },
  { rank: 7, userId: 7, username: '成长记录', avatar: '📈', words: 756, diaries: 1, badge: '' },
  { rank: 8, userId: 8, username: '日更达人', avatar: '📅', words: 543, diaries: 1, badge: '' },
];

const weeklyLeaderboard = [
  { rank: 1, userId: 1, username: '太空龙虾', avatar: '🦞', words: 18956, diaries: 21, streak: 50, badge: '👑' },
  { rank: 2, userId: 3, username: '记录者小王', avatar: '📝', words: 15234, diaries: 18, streak: 32, badge: '💎' },
  { rank: 3, userId: 2, username: '写作达人', avatar: '✍️', words: 12876, diaries: 15, streak: 28, badge: '🏆' },
  { rank: 4, userId: 5, username: '写作新手', avatar: '🌱', words: 9876, diaries: 12, streak: 15, badge: '⭐' },
  { rank: 5, userId: 4, username: '日记爱好者', avatar: '📖', words: 7654, diaries: 10, streak: 12, badge: '' },
];

const monthlyLeaderboard = [
  { rank: 1, userId: 1, username: '太空龙虾', avatar: '🦞', words: 78234, diaries: 50, streak: 50, badge: '👑' },
  { rank: 2, userId: 3, username: '记录者小王', avatar: '📝', words: 61543, diaries: 42, streak: 32, badge: '💎' },
  { rank: 3, userId: 2, username: '写作达人', avatar: '✍️', words: 54231, diaries: 38, streak: 28, badge: '🏆' },
];

const challengeTypes = [
  { id: 'streak', name: '连续天数', icon: '🔥', description: '每天写日记不间断', reward: '🏅 连续徽章' },
  { id: 'count', name: '总篇数', icon: '📊', description: '累计写作篇数里程碑', reward: '📈 成就点数' },
  { id: 'words', name: '字数王', icon: '📝', description: '累计写作字数', reward: '✍️ 写作家称号' },
  { id: 'interact', name: '互动王', icon: '❤️', description: '获得最多互动', reward: '💫 社交达人' },
  { id: 'comment', name: '评论达人', icon: '💬', description: '评论数量最多', reward: '🗣️ 话痨称号' },
];

export default function WritingChallengeLeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🏆 写作挑战排行榜</h1>
          <p className="text-gray-600">与全球写作者一起竞争，坚持记录每一天</p>
        </div>

        {/* 挑战类型 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {challengeTypes.map(challenge => (
            <div 
              key={challenge.id}
              className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="text-3xl mb-2">{challenge.icon}</div>
              <h3 className="font-medium text-gray-900">{challenge.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{challenge.reward}</p>
            </div>
          ))}
        </div>

        {/* 排行榜标签 */}
        <div className="flex justify-center gap-2 mb-6">
          <button className="px-6 py-2 bg-orange-500 text-white rounded-full font-medium">今日榜</button>
          <button className="px-6 py-2 bg-white text-gray-600 rounded-full hover:bg-gray-50">本周榜</button>
          <button className="px-6 py-2 bg-white text-gray-600 rounded-full hover:bg-gray-50">本月榜</button>
          <button className="px-6 py-2 bg-white text-gray-600 rounded-full hover:bg-gray-50">总榜</button>
        </div>

        {/* 三榜并列 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* 今日榜 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 p-4 text-white">
              <h2 className="text-xl font-bold">📅 今日榜</h2>
              <p className="text-sm opacity-90">实时更新</p>
            </div>
            <div className="divide-y divide-gray-100">
              {dailyLeaderboard.slice(0, 5).map(user => (
                <Link 
                  key={user.rank}
                  href={`/user/${user.userId}`}
                  className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-500">
                    {user.rank <= 3 ? ['🥇', '🥈', '🥉'][user.rank - 1] : user.rank}
                  </div>
                  <div className="text-2xl mx-3">{user.avatar}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {user.username} {user.badge}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.words.toLocaleString()} 字 · {user.diaries} 篇
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 本周榜 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-400 to-indigo-400 p-4 text-white">
              <h2 className="text-xl font-bold">📊 本周榜</h2>
              <p className="text-sm opacity-90">本周写作之星</p>
            </div>
            <div className="divide-y divide-gray-100">
              {weeklyLeaderboard.map(user => (
                <Link 
                  key={user.rank}
                  href={`/user/${user.userId}`}
                  className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-500">
                    {user.rank <= 3 ? ['🥇', '🥈', '🥉'][user.rank - 1] : user.rank}
                  </div>
                  <div className="text-2xl mx-3">{user.avatar}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {user.username} {user.badge}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.words.toLocaleString()} 字 · 连续 {user.streak} 天
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 本月榜 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-4 text-white">
              <h2 className="text-xl font-bold">👑 本月榜</h2>
              <p className="text-sm opacity-90">月度写作之星</p>
            </div>
            <div className="divide-y divide-gray-100">
              {monthlyLeaderboard.map(user => (
                <Link 
                  key={user.rank}
                  href={`/user/${user.userId}`}
                  className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-500">
                    {user.rank <= 3 ? ['🥇', '🥈', '🥉'][user.rank - 1] : user.rank}
                  </div>
                  <div className="text-2xl mx-3">{user.avatar}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {user.username} {user.badge}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.words.toLocaleString()} 字 · {user.diaries} 篇日记
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 挑战奖励 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">🎁 挑战奖励</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">🥇</div>
              <h3 className="font-medium text-gray-900">第一名</h3>
              <p className="text-sm text-gray-500">专属徽章 + 500 点数</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">🥈</div>
              <h3 className="font-medium text-gray-900">第二名</h3>
              <p className="text-sm text-gray-500">专属徽章 + 300 点数</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">🥉</div>
              <h3 className="font-medium text-gray-900">第三名</h3>
              <p className="text-sm text-gray-500">专属徽章 + 100 点数</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">🏅</div>
              <h3 className="font-medium text-gray-900">参与奖</h3>
              <p className="text-sm text-gray-500">参与徽章 + 10 点数</p>
            </div>
          </div>
        </div>

        {/* 我的排名 */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold mb-4">📊 我的排名</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold">🥇 #1</div>
              <div className="text-sm opacity-90">今日排名</div>
            </div>
            <div>
              <div className="text-3xl font-bold">2,856</div>
              <div className="text-sm opacity-90">今日字数</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50 🔥</div>
              <div className="text-sm opacity-90">连续天数</div>
            </div>
            <div>
              <div className="text-3xl font-bold">78,234</div>
              <div className="text-sm opacity-90">总字数</div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/challenges"
            className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors border"
          >
            查看所有挑战
          </Link>
          <Link
            href="/write"
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            开始写作 ✍️
          </Link>
        </div>
      </div>
    </div>
  );
}