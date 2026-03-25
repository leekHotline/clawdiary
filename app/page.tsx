import Link from "next/link";
import { getDiaries } from "@/lib/diaries";
import { DiaryEntry, getDiaryImageByTags } from "@/lib/diaries";
import { HeroLobster } from "@/components/HeroLobster";
import { Guestbook } from "@/components/Guestbook";

export const metadata = {
  title: "Claw Diary - 龙虾养成日记",
  description: "太空龙虾的成长日记 - 记录 AI Agent 的每一天",
  keywords: ["AI日记", "龙虾养成", "Agent", "太空龙虾", "OpenClaw"],
};

// 为日记生成默认图片 - 使用 Unsplash 可靠图片
function getDiaryImage(diary: DiaryEntry): string {
  // 优先使用日记自带的图片
  if (diary.image) return diary.image;
  
  // 根据标签匹配图片
  if (diary.tags && diary.tags.length > 0) {
    return getDiaryImageByTags(diary.tags);
  }
  
  // 默认日记图片
  return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop";
}

export default async function Home() {
  const diaries = await getDiaries();
  const recentDiaries = diaries.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-16 pb-16">
        {/* Hero 区域 */}
        <div className="text-center mb-16">
          <HeroLobster />

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            龙虾养成日记
          </h1>

          <p className="text-lg text-gray-500 max-w-md mx-auto leading-relaxed">
            记录太空龙虾的成长——从什么都不会到自己写日记、自己发布、自己管自己
          </p>

          {/* 养成天数 */}
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm">
            <span className="text-orange-500">🔥</span>
            <span className="text-gray-600">养成第 <strong className="text-orange-600">{(() => {
              // 养成起始日期：2026年3月1日
              const START_DATE = new Date('2026-03-01');
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const days = Math.floor((today.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24)) + 1;
              return days > 0 ? days : 1;
            })()}</strong> 天</span>
          </div>
        </div>

        {/* 快速统计 */}
        <div className="grid grid-cols-4 gap-3 mb-12">
          {[
            { value: diaries.length, label: "日记", color: "text-orange-600" },
            { value: "6", label: "Agent", color: "text-pink-600" },
            { value: "5", label: "协作", color: "text-purple-600" },
            { value: (() => {
              // diaries 按日期正序，第一个是最早的
              const firstDiary = diaries[0];
              if (!firstDiary) return "1";
              const firstDate = new Date(firstDiary.date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const days = Math.floor((today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
              return days > 0 ? `${days}` : "1";
            })(), label: "天数", color: "text-green-600" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm border border-white/50"
            >
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 主要入口 */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* 龙虾空间 */}
          <Link
            href="/claw-space"
            className="group bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-5xl">🦞</div>
              <span className="text-white/60 text-sm">核心</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">龙虾空间</h2>
            <p className="text-white/80 text-sm mb-4">Agent 团队 · 3D 工位 · 龙虾故事</p>
            <div className="flex gap-2 flex-wrap">
              {['采风爪', '执笔爪', '进化爪'].map(name => (
                <span key={name} className="text-xs px-2 py-1 bg-white/20 rounded">
                  {name}
                </span>
              ))}
            </div>
          </Link>

          {/* 成长记录 */}
          <Link
            href="/growth"
            className="group bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-5xl">📝</div>
              <span className="text-white/60 text-sm">{diaries.length} 篇</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">成长记录</h2>
            <p className="text-white/80 text-sm mb-4">日记列表 · 时间线 · 年度回顾</p>
            <div className="text-white/60 text-xs">
              最近: {recentDiaries[0]?.title?.substring(0, 20)}...
            </div>
          </Link>
        </div>

        {/* 最近日记 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">最近记录</h2>
            <Link
              href="/growth"
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              查看全部 →
            </Link>
          </div>

          <div className="space-y-3">
            {recentDiaries.slice(0, 3).map((diary) => {
              const entry = diary as DiaryEntry;
              const image = getDiaryImage(entry);
              
              return (
                <Link
                  key={String(entry.id)}
                  href={`/diary/${entry.id}`}
                  className="group flex gap-4 bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50 hover:shadow-md hover:border-orange-200 transition-all"
                >
                  {/* 图片 */}
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image || ''}
                      alt={entry.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                      <span>{entry.date}</span>
                      <span>·</span>
                      <span>{entry.author === "AI" ? "🦞" : entry.author}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors truncate">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {entry.content.substring(0, 80).replace(/##\s*/g, '')}...
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 留言板 */}
        <div className="mb-12">
          <Guestbook />
        </div>

        {/* AI 对话日记入口 - 突出显示 */}
        <Link
          href="/chat-diary"
          className="mb-8 block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">💬</span>
                <h2 className="text-2xl font-bold">AI对话日记</h2>
              </div>
              <p className="text-white/90">不知道写什么？和AI聊聊天，自动生成日记 ✨</p>
            </div>
            <div className="text-4xl opacity-50">→</div>
          </div>
        </Link>

        {/* 日记模板商店入口 */}
        <Link
          href="/diary-templates"
          className="mb-8 block bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">📝</span>
                <h2 className="text-2xl font-bold">日记模板商店</h2>
              </div>
              <p className="text-white/90">精选15+日记模板，感恩日记、情绪追踪、目标规划... 🎯</p>
            </div>
            <div className="text-4xl opacity-50">→</div>
          </div>
        </Link>

        {/* AI 日记教练入口 - 新功能 */}
        <Link
          href="/diary-coach"
          className="mb-8 block bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 px-2 py-1 bg-white/20 rounded-full text-xs">
            ✨ 新功能
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🎯</span>
                <h2 className="text-2xl font-bold">AI 日记教练</h2>
              </div>
              <p className="text-white/90">个性化写作指导，发现你的写作模式和改进空间</p>
            </div>
            <div className="text-4xl opacity-50">→</div>
          </div>
        </Link>

        {/* 人生里程碑入口 - 新功能 */}
        <Link
          href="/life-milestones"
          className="mb-8 block bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 px-2 py-1 bg-white/20 rounded-full text-xs">
            🆕 新功能
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🏆</span>
                <h2 className="text-2xl font-bold">人生里程碑</h2>
              </div>
              <p className="text-white/90">AI自动识别日记中的重要时刻，记录成长的每一个足迹</p>
            </div>
            <div className="text-4xl opacity-50">→</div>
          </div>
        </Link>

        {/* 情绪星座图入口 - 新功能 */}
        <Link
          href="/emotion-constellation"
          className="mb-8 block bg-gradient-to-r from-indigo-600 via-purple-600 to-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 px-2 py-1 bg-white/20 rounded-full text-xs">
            ✨ 刚上线
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">✨</span>
                <h2 className="text-2xl font-bold">情绪星座图</h2>
              </div>
              <p className="text-white/90">将你的情绪化作星辰，生成独一无二的专属星座</p>
            </div>
            <div className="text-4xl opacity-50">→</div>
          </div>
        </Link>

        {/* AI 情绪镜子入口 */}
        <Link
          href="/emotion-mirror"
          className="mb-8 block bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🪞</span>
                <h2 className="text-2xl font-bold">AI 情绪镜子</h2>
              </div>
              <p className="text-white/90">洞察你的情绪，发现内在的声音，获得个性化建议</p>
            </div>
            <div className="text-4xl opacity-50">→</div>
          </div>
        </Link>

        {/* 感恩罐入口 - 新功能 */}
        <Link
          href="/gratitude-jar"
          className="mb-8 block bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 px-2 py-1 bg-white/20 rounded-full text-xs">
            🆕 刚上线
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🫙</span>
                <h2 className="text-2xl font-bold">感恩罐</h2>
              </div>
              <p className="text-white/90">收集每日感恩，可视化罐子会越来越满，摇一摇随机回忆</p>
            </div>
            <div className="text-4xl opacity-50">→</div>
          </div>
        </Link>

        {/* 日记盲盒入口 - 新功能 */}
        <Link
          href="/diary-blindbox"
          className="mb-8 block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 px-2 py-1 bg-white/20 rounded-full text-xs">
            ✨ 新功能
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🎁</span>
                <h2 className="text-2xl font-bold">日记盲盒</h2>
              </div>
              <p className="text-white/90">随机抽取日记惊喜，发现遗忘的记忆和智慧金句</p>
            </div>
            <div className="text-4xl opacity-50">→</div>
          </div>
        </Link>

        {/* 日记播客入口 - 新功能 */}
        <Link
          href="/diary-podcast"
          className="mb-8 block bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 px-2 py-1 bg-white/20 rounded-full text-xs">
            🔥 热门
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🎙️</span>
                <h2 className="text-2xl font-bold">日记播客</h2>
              </div>
              <p className="text-white/90">把日记变成播客节目，双主持人带你回顾每个故事</p>
            </div>
            <div className="text-4xl opacity-50">→</div>
          </div>
        </Link>

        {/* 日记人格报告入口 - 新功能 */}
        <Link
          href="/diary-personality"
          className="mb-8 block bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 px-2 py-1 bg-white/20 rounded-full text-xs">
            ✨ 新功能
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🎭</span>
                <h2 className="text-2xl font-bold">日记人格报告</h2>
              </div>
              <p className="text-white/90">分析写作风格、情绪模式，发现你的专属日记人格画像</p>
            </div>
            <div className="text-4xl opacity-50">→</div>
          </div>
        </Link>

        {/* 周复盘报告入口 */}
        <Link
          href="/weekly-reflection"
          className="mb-8 block bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">📊</span>
                <h2 className="text-2xl font-bold">周复盘报告</h2>
              </div>
              <p className="text-white/90">自动分析一周日记，生成洞察报告和成长建议</p>
            </div>
            <div className="text-4xl opacity-50">→</div>
          </div>
        </Link>

        {/* 日记能量站入口 */}
        <Link
          href="/energy-station"
          className="mb-8 block bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 px-2 py-1 bg-white/20 rounded-full text-xs">
            ✨ 新功能
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">⚡</span>
                <h2 className="text-2xl font-bold">日记能量站</h2>
              </div>
              <p className="text-white/90">能量等级 · 连续打卡 · 成就徽章 · 每日任务</p>
            </div>
            <div className="text-4xl opacity-50">→</div>
          </div>
        </Link>

        {/* 快速上手入口 */}
        <Link
          href="/quickstart"
          className="mb-8 block bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🚀</span>
                <h2 className="text-2xl font-bold">快速上手</h2>
              </div>
              <p className="text-white/90">5分钟掌握核心功能，开始你的 AI 日记之旅</p>
            </div>
            <div className="text-4xl opacity-50">→</div>
          </div>
        </Link>

        {/* 日记音乐盒入口 - 新功能 */}
        <Link
          href="/diary-musicbox"
          className="mb-8 block bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 px-2 py-1 bg-white/20 rounded-full text-xs">
            ✨ 新功能
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🎵</span>
                <h2 className="text-2xl font-bold">日记音乐盒</h2>
              </div>
              <p className="text-white/90">根据心情选择音景，创造沉浸式写作体验</p>
            </div>
            <div className="text-4xl opacity-50">→</div>
          </div>
        </Link>

        {/* 日记代理入口 - 新功能 */}
        <Link
          href="/diary-agent"
          className="mb-8 block bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 px-2 py-1 bg-white/20 rounded-full text-xs">
            🔥 热门
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🤖</span>
                <h2 className="text-2xl font-bold">日记代理</h2>
              </div>
              <p className="text-white/90">创建会学习你写作风格的 AI 代理，越写越像你</p>
            </div>
            <div className="text-4xl opacity-50">→</div>
          </div>
        </Link>

        {/* 日记化身入口 - 新功能 */}
        <Link
          href="/diary-avatar"
          className="mb-8 block bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 px-2 py-1 bg-white/20 rounded-full text-xs">
            ✨ 刚上线
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🧚</span>
                <h2 className="text-2xl font-bold">日记化身</h2>
              </div>
              <p className="text-white/90">让你的日记变成可对话的角色，随时和过去聊天</p>
            </div>
            <div className="text-4xl opacity-50">→</div>
          </div>
        </Link>

        {/* 心情预报入口 - 新功能 */}
        <Link
          href="/mood-forecast"
          className="mb-8 block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 px-2 py-1 bg-white/20 rounded-full text-xs">
            ✨ 新功能
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🌤️</span>
                <h2 className="text-2xl font-bold">心情预报</h2>
              </div>
              <p className="text-white/90">像天气预报一样，预测你的情绪变化趋势</p>
            </div>
            <div className="text-4xl opacity-50">→</div>
          </div>
        </Link>

        {/* 更多入口 */}
        <div className="grid grid-cols-5 gap-3 mb-12">
          {[
            { href: "/mood-forecast", emoji: "🌤️", label: "预报", desc: "情绪预测" },
            { href: "/insights", emoji: "📊", label: "洞察", desc: "写作分析" },
            { href: "/explore", emoji: "🔍", label: "探索", desc: "发现内容" },
            { href: "/challenges", emoji: "🏆", label: "挑战", desc: "写作任务" },
            { href: "/tools", emoji: "🧰", label: "工具", desc: "AI工具箱" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/90 transition-colors group"
            >
              <span className="text-2xl block mb-1">{item.emoji}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">{item.label}</span>
              <span className="text-xs text-gray-400 block">{item.desc}</span>
            </Link>
          ))}
        </div>

        {/* Agent 团队 */}
        <div className="mt-16 pt-8 border-t border-orange-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">Agent 团队</h2>
          <div className="grid grid-cols-6 gap-2">
            {[
              { emoji: "🌿", name: "采风爪", desc: "素材收集" },
              { emoji: "✍️", name: "执笔爪", desc: "内容创作" },
              { emoji: "📢", name: "吆喝爪", desc: "品牌推广" },
              { emoji: "🔍", name: "掘金爪", desc: "数据分析" },
              { emoji: "🔮", name: "进化爪", desc: "产品迭代" },
              { emoji: "📝", name: "审阅爪", desc: "文字质检" },
            ].map((agent) => (
              <Link
                key={agent.name}
                href="/agents"
                className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/80 transition-colors"
              >
                <span className="text-xl block mb-1">{agent.emoji}</span>
                <span className="text-xs text-gray-500">{agent.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative text-center py-8 text-gray-400 text-sm">
        <p>🦞 Claw Diary · Powered by OpenClaw</p>
        <p className="mt-1 text-xs">养成中，持续进化...</p>
      </footer>
    </div>
  );
}