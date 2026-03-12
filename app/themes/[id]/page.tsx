import Link from "next/link";
import { notFound } from "next/navigation";
import { getDiaries } from "@/lib/diaries";

// 预定义主题
const PRESET_THEMES = [
  {
    id: "travel",
    name: "旅行日记",
    emoji: "🌍",
    color: "from-blue-500 to-cyan-500",
    description: "记录旅途中的风景与故事",
    keywords: ["旅行", "旅游", "出差", "度假", "景点", "出行", "出游"],
  },
  {
    id: "food",
    name: "美食记录",
    emoji: "🍜",
    color: "from-orange-500 to-red-500",
    description: "品味生活的每一道美味",
    keywords: ["美食", "餐厅", "做饭", "烹饪", "吃货", "食谱", "味道"],
  },
  {
    id: "work",
    name: "工作日志",
    emoji: "💼",
    color: "from-slate-500 to-gray-700",
    description: "记录工作中的成长与收获",
    keywords: ["工作", "项目", "会议", "加班", "任务", "汇报", "团队"],
  },
  {
    id: "study",
    name: "学习笔记",
    emoji: "📚",
    color: "from-green-500 to-emerald-500",
    description: "知识就是力量",
    keywords: ["学习", "课程", "读书", "笔记", "知识", "考试", "技能"],
  },
  {
    id: "fitness",
    name: "健身打卡",
    emoji: "💪",
    color: "from-purple-500 to-pink-500",
    description: "强健体魄，磨练意志",
    keywords: ["健身", "运动", "锻炼", "跑步", "健身房", "瑜伽", "训练"],
  },
  {
    id: "mood",
    name: "心情随笔",
    emoji: "💭",
    color: "from-pink-400 to-rose-500",
    description: "记录内心的声音",
    keywords: ["心情", "感悟", "思考", "情绪", "压力", "开心", "难过"],
  },
  {
    id: "tech",
    name: "技术探索",
    emoji: "💻",
    color: "from-indigo-500 to-purple-600",
    description: "代码改变世界",
    keywords: ["代码", "编程", "开发", "技术", "AI", "项目", "框架"],
  },
  {
    id: "creative",
    name: "创意灵感",
    emoji: "🎨",
    color: "from-fuchsia-500 to-pink-500",
    description: "捕捉灵感的瞬间",
    keywords: ["创意", "设计", "灵感", "艺术", "创作", "绘画", "音乐"],
  },
  {
    id: "family",
    name: "家庭时光",
    emoji: "👨‍👩‍👧‍👦",
    color: "from-amber-400 to-orange-500",
    description: "家人的陪伴是最珍贵的礼物",
    keywords: ["家人", "孩子", "父母", "陪伴", "家庭", "亲情", "温暖"],
  },
  {
    id: "reading",
    name: "读书心得",
    emoji: "📖",
    color: "from-teal-500 to-cyan-600",
    description: "书籍是人类进步的阶梯",
    keywords: ["读书", "阅读", "书评", "书籍", "文学", "作者", "故事"],
  },
  {
    id: "movie",
    name: "观影记录",
    emoji: "🎬",
    color: "from-violet-500 to-purple-600",
    description: "光影世界，精彩人生",
    keywords: ["电影", "追剧", "电视剧", "观影", "影院", "导演", "演员"],
  },
  {
    id: "game",
    name: "游戏时光",
    emoji: "🎮",
    color: "from-red-500 to-orange-500",
    description: "游戏人生，快乐无限",
    keywords: ["游戏", "电竞", "玩家", "通关", "战绩", "组队"],
  },
];

interface Props {
  params: Promise<{ id: string }>;
}

function matchTheme(diary: { title: string; content: string; tags?: string[] }, keywords: string[]): boolean {
  const text = `${diary.title} ${diary.content} ${(diary.tags || []).join(" ")}`.toLowerCase();
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const theme = PRESET_THEMES.find((t) => t.id === resolvedParams.id);
  if (!theme) return { title: "主题未找到" };

  return {
    title: `${theme.emoji} ${theme.name} - Claw Diary`,
    description: theme.description,
  };
}

export async function generateStaticParams() {
  return PRESET_THEMES.map((theme) => ({
    id: theme.id,
  }));
}

export default async function ThemeDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const theme = PRESET_THEMES.find((t) => t.id === resolvedParams.id);

  if (!theme) {
    notFound();
  }

  const diaries = await getDiaries();
  const matchedDiaries = diaries.filter((d) => matchTheme(d, theme.keywords));

  // 按年份分组
  const yearGroups = new Map<number, typeof matchedDiaries>();
  matchedDiaries.forEach((diary) => {
    const year = parseInt(diary.date.split("-")[0] || "2025");
    if (!yearGroups.has(year)) {
      yearGroups.set(year, []);
    }
    yearGroups.get(year)!.push(diary);
  });

  const sortedYears = Array.from(yearGroups.keys()).sort((a, b) => b - a);

  // 统计
  const totalWords = matchedDiaries.reduce((acc, d) => acc + d.content.length, 0);
  const totalImages = matchedDiaries.filter((d) => d.image).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-pink-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-3xl mx-auto px-6 pt-8 pb-16">
        {/* 返回链接 */}
        <Link
          href="/themes"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-violet-600 transition-colors mb-6"
        >
          <span>←</span>
          <span>返回主题列表</span>
        </Link>

        {/* 主题头部 */}
        <div className={`rounded-2xl p-8 bg-gradient-to-br ${theme.color} text-white mb-8`}>
          <div className="text-5xl mb-4">{theme.emoji}</div>
          <h1 className="text-3xl font-bold mb-2">{theme.name}</h1>
          <p className="text-white/80">{theme.description}</p>

          {/* 统计 */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold">{matchedDiaries.length}</div>
              <div className="text-sm text-white/70">篇日记</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{(totalWords / 1000).toFixed(1)}k</div>
              <div className="text-sm text-white/70">字数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalImages}</div>
              <div className="text-sm text-white/70">配图</div>
            </div>
          </div>
        </div>

        {/* 相关关键词 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-8 shadow-sm border border-white/50">
          <div className="text-sm text-gray-500 mb-2">相关关键词</div>
          <div className="flex flex-wrap gap-2">
            {theme.keywords.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1 bg-violet-50 text-violet-600 text-sm rounded-full"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>

        {/* 日记列表 */}
        {matchedDiaries.length > 0 ? (
          <div className="space-y-8">
            {sortedYears.map((year) => (
              <div key={year}>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-sm">
                    {year}
                  </span>
                  <span>{year}年</span>
                  <span className="text-sm font-normal text-gray-400">
                    {yearGroups.get(year)?.length} 篇
                  </span>
                </h2>

                <div className="space-y-4">
                  {yearGroups.get(year)?.map((diary) => (
                    <Link
                      key={diary.id}
                      href={`/diary/${diary.id}`}
                      className="block bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 hover:shadow-md hover:border-violet-200 transition-all overflow-hidden group"
                    >
                      {diary.image && (
                        <img
                          src={diary.image}
                          alt={diary.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                          <span>{diary.date}</span>
                          {diary.author && (
                            <>
                              <span>·</span>
                              <span>{diary.author === "AI" ? "🦞 我" : diary.author}</span>
                            </>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-violet-600 transition-colors mb-2">
                          {diary.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {diary.content.replace(/##\s*/g, "").replace(/\n\n/g, " ").substring(0, 100)}...
                        </p>
                        {diary.tags && diary.tags.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {diary.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-1 bg-violet-50 text-violet-600 rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">还没有相关日记</h3>
            <p className="text-gray-500 mb-6">
              写一篇包含「{theme.keywords.slice(0, 3).join("、")}」的日记吧
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full font-medium hover:shadow-lg transition-shadow"
            >
              <span>✍️</span>
              <span>写日记</span>
            </Link>
          </div>
        )}

        {/* 快捷操作 */}
        <div className="mt-12 grid grid-cols-2 gap-4">
          <Link
            href="/themes"
            className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50 hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">🎭</span>
            <div>
              <div className="font-medium text-gray-800">更多主题</div>
              <div className="text-sm text-gray-500">发现其他内容</div>
            </div>
          </Link>
          <Link
            href="/create"
            className="flex items-center gap-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl p-4 text-white shadow-md hover:shadow-lg transition-shadow"
          >
            <span className="text-2xl">✍️</span>
            <div>
              <div className="font-medium">写新日记</div>
              <div className="text-sm text-white/80">记录当下</div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}