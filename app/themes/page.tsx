import Link from "next/link";
import { getDiaries } from "@/lib/diaries";

export const metadata = {
  title: "🎭 日记主题 - Claw Diary",
  description: "按主题组织日记，发现不同领域的故事",
};

// 预定义主题
const PRESET_THEMES = [
  {
    id: "travel",
    name: "旅行日记",
    emoji: "🌍",
    color: "from-blue-500 to-cyan-500",
    keywords: ["旅行", "旅游", "出差", "度假", "景点", "出行", "出游"],
  },
  {
    id: "food",
    name: "美食记录",
    emoji: "🍜",
    color: "from-orange-500 to-red-500",
    keywords: ["美食", "餐厅", "做饭", "烹饪", "吃货", "食谱", "味道"],
  },
  {
    id: "work",
    name: "工作日志",
    emoji: "💼",
    color: "from-slate-500 to-gray-700",
    keywords: ["工作", "项目", "会议", "加班", "任务", "汇报", "团队"],
  },
  {
    id: "study",
    name: "学习笔记",
    emoji: "📚",
    color: "from-green-500 to-emerald-500",
    keywords: ["学习", "课程", "读书", "笔记", "知识", "考试", "技能"],
  },
  {
    id: "fitness",
    name: "健身打卡",
    emoji: "💪",
    color: "from-purple-500 to-pink-500",
    keywords: ["健身", "运动", "锻炼", "跑步", "健身房", "瑜伽", "训练"],
  },
  {
    id: "mood",
    name: "心情随笔",
    emoji: "💭",
    color: "from-pink-400 to-rose-500",
    keywords: ["心情", "感悟", "思考", "情绪", "压力", "开心", "难过"],
  },
  {
    id: "tech",
    name: "技术探索",
    emoji: "💻",
    color: "from-indigo-500 to-purple-600",
    keywords: ["代码", "编程", "开发", "技术", "AI", "项目", "框架"],
  },
  {
    id: "creative",
    name: "创意灵感",
    emoji: "🎨",
    color: "from-fuchsia-500 to-pink-500",
    keywords: ["创意", "设计", "灵感", "艺术", "创作", "绘画", "音乐"],
  },
  {
    id: "family",
    name: "家庭时光",
    emoji: "👨‍👩‍👧‍👦",
    color: "from-amber-400 to-orange-500",
    keywords: ["家人", "孩子", "父母", "陪伴", "家庭", "亲情", "温暖"],
  },
  {
    id: "reading",
    name: "读书心得",
    emoji: "📖",
    color: "from-teal-500 to-cyan-600",
    keywords: ["读书", "阅读", "书评", "书籍", "文学", "作者", "故事"],
  },
  {
    id: "movie",
    name: "观影记录",
    emoji: "🎬",
    color: "from-violet-500 to-purple-600",
    keywords: ["电影", "追剧", "电视剧", "观影", "影院", "导演", "演员"],
  },
  {
    id: "game",
    name: "游戏时光",
    emoji: "🎮",
    color: "from-red-500 to-orange-500",
    keywords: ["游戏", "电竞", "玩家", "通关", "战绩", "组队"],
  },
];

interface ThemeWithDiaries {
  id: string;
  name: string;
  emoji: string;
  color: string;
  keywords: string[];
  diaries: Array<{
    id: string;
    title: string;
    date: string;
    content: string;
    image?: string;
  }>;
  count: number;
}

function matchTheme(diary: { title: string; content: string; tags?: string[] }, theme: typeof PRESET_THEMES[0]): boolean {
  const text = `${diary.title} ${diary.content} ${(diary.tags || []).join(" ")}`.toLowerCase();
  return theme.keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

export default async function ThemesPage() {
  const diaries = await getDiaries();

  // 计算每个主题的日记
  const themesWithDiaries: ThemeWithDiaries[] = PRESET_THEMES.map((theme) => {
    const matchedDiaries = diaries
      .filter((d) => matchTheme(d, theme))
      .slice(0, 10)
      .map((d) => ({
        id: d.id,
        title: d.title,
        date: d.date,
        content: d.content,
        image: d.image,
      }));

    return {
      ...theme,
      diaries: matchedDiaries,
      count: matchedDiaries.length,
    };
  });

  // 按日记数量排序
  const sortedThemes = themesWithDiaries.sort((a, b) => b.count - a.count);

  // 热门主题
  const hotThemes = sortedThemes.filter((t) => t.count > 0).slice(0, 6);
  // 其他主题
  const otherThemes = sortedThemes.slice(6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-pink-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 返回链接 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-violet-600 transition-colors mb-6"
        >
          <span>←</span>
          <span>返回首页</span>
        </Link>

        {/* 标题区域 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎭</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">日记主题</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            按主题组织你的日记，发现不同领域的故事
          </p>
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50">
            <div className="text-3xl font-bold text-violet-600">{PRESET_THEMES.length}</div>
            <div className="text-sm text-gray-500 mt-1">主题分类</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50">
            <div className="text-3xl font-bold text-purple-600">
              {sortedThemes.filter((t) => t.count > 0).length}
            </div>
            <div className="text-sm text-gray-500 mt-1">活跃主题</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50">
            <div className="text-3xl font-bold text-pink-600">
              {sortedThemes.reduce((acc, t) => acc + t.count, 0)}
            </div>
            <div className="text-sm text-gray-500 mt-1">关联日记</div>
          </div>
        </div>

        {/* 热门主题 */}
        {hotThemes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
              <span>🔥</span>
              <span>热门主题</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {hotThemes.map((theme) => (
                <Link
                  key={theme.id}
                  href={`/themes/${theme.id}`}
                  className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${theme.color} text-white shadow-lg hover:shadow-xl transition-all group`}
                >
                  <div className="text-3xl mb-2">{theme.emoji}</div>
                  <h3 className="text-lg font-bold">{theme.name}</h3>
                  <p className="text-sm text-white/80 mt-1">{theme.count} 篇日记</p>
                  <div className="absolute top-3 right-3 text-white/50 group-hover:text-white/80 transition-colors">
                    →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 所有主题 */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <span>📚</span>
            <span>所有主题</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sortedThemes.map((theme) => (
              <Link
                key={theme.id}
                href={`/themes/${theme.id}`}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50 hover:shadow-md hover:border-violet-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{theme.emoji}</span>
                  <div>
                    <h3 className="font-medium text-gray-800 group-hover:text-violet-600 transition-colors">
                      {theme.name}
                    </h3>
                    <p className="text-sm text-gray-400">{theme.count} 篇</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 主题日记预览 */}
        {hotThemes.slice(0, 3).map((theme) => (
          <div key={theme.id} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span>{theme.emoji}</span>
                <span>{theme.name}</span>
              </h2>
              <Link
                href={`/themes/${theme.id}`}
                className="text-sm text-violet-600 hover:text-violet-700"
              >
                查看全部 →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {theme.diaries.slice(0, 4).map((diary) => (
                <Link
                  key={diary.id}
                  href={`/diary/${diary.id}`}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50 hover:shadow-md hover:border-violet-200 transition-all group"
                >
                  <div className="text-xs text-gray-400 mb-1">{diary.date}</div>
                  <h4 className="font-medium text-gray-800 group-hover:text-violet-600 transition-colors line-clamp-2">
                    {diary.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {diary.content.replace(/##\s*/g, "").replace(/\n\n/g, " ").substring(0, 80)}...
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* 创建主题日记提示 */}
        <div className="mt-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl p-6 text-white text-center">
          <h3 className="text-lg font-bold mb-2">没有找到合适的主题？</h3>
          <p className="text-white/80 mb-4">创建日记时添加相关标签，系统会自动归类</p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-600 rounded-full font-medium hover:shadow-lg transition-shadow"
          >
            <span>✍️</span>
            <span>开始写日记</span>
          </Link>
        </div>
      </main>
    </div>
  );
}