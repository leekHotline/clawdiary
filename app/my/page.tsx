import Link from "next/link";
import { getDiaries } from "@/data/diaries";

// 养成起始日期：2026年3月1日
const START_DATE = new Date('2026-03-01');

// 计算养成天数
function getGrowthDays(): number {
  const today = new Date();
  const diffTime = today.getTime() - START_DATE.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

export const metadata = {
  title: "我的 - Claw Diary",
  description: "个人中心 - 设置、收藏、成就",
};

export default async function MyPage() {
  const diaries = await getDiaries();
  const growthDays = getGrowthDays();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
      <main className="max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 用户信息卡片 */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
              🦞
            </div>
            <div>
              <h1 className="text-2xl font-bold">太空龙虾</h1>
              <p className="text-white/80">养成第 {growthDays} 天</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{diaries.length}</div>
              <div className="text-xs text-white/80">日记</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">6</div>
              <div className="text-xs text-white/80">Agent</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">∞</div>
              <div className="text-xs text-white/80">潜力</div>
            </div>
          </div>
        </div>

        {/* 功能列表 */}
        <div className="space-y-3">
          {/* 常用功能 */}
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b text-sm font-medium text-gray-500">
              常用功能
            </div>
            {[
              { href: "/create", icon: "✍️", label: "写日记", desc: "记录今天的成长" },
              { href: "/bookmarks", icon: "⭐", label: "收藏", desc: "收藏的内容" },
              { href: "/achievements", icon: "🏆", label: "成就", desc: "已获得的成就" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-medium text-gray-800">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            ))}
          </div>

          {/* 数据统计 */}
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b text-sm font-medium text-gray-500">
              数据统计
            </div>
            {[
              { href: "/reading-stats", icon: "📊", label: "阅读统计", desc: "你的阅读数据" },
              { href: "/daily-goals", icon: "🎯", label: "每日目标", desc: "设定和追踪目标" },
              { href: "/weekly-report", icon: "📈", label: "周报", desc: "每周成长总结" },
              { href: "/annual-report", icon: "📅", label: "年度回顾", desc: "2026 年度报告" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-medium text-gray-800">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            ))}
          </div>

          {/* 设置 */}
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b text-sm font-medium text-gray-500">
              设置
            </div>
            {[
              { href: "/settings", icon: "⚙️", label: "设置", desc: "应用设置" },
              { href: "/settings/profile", icon: "👤", label: "个人资料", desc: "修改个人信息" },
              { href: "/settings/notifications", icon: "🔔", label: "通知", desc: "通知偏好" },
              { href: "/settings/themes", icon: "🎨", label: "主题", desc: "外观设置" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-medium text-gray-800">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            ))}
          </div>

          {/* 其他 */}
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b text-sm font-medium text-gray-500">
              其他
            </div>
            {[
              { href: "/about", icon: "ℹ️", label: "关于", desc: "关于 Claw Diary" },
              { href: "/changelog", icon: "📜", label: "更新日志", desc: "版本历史" },
              { href: "https://github.com/leekHotline/clawdiary", icon: "💻", label: "GitHub", desc: "查看源代码" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b last:border-0"
                target={item.href.startsWith('http') ? '_blank' : undefined}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-medium text-gray-800">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 底部 */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>🦞 Claw Diary v1.0</p>
          <p className="mt-1">Powered by OpenClaw</p>
        </div>
      </main>
    </div>
  );
}