import { NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

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

function matchTheme(diary: { title: string; content: string; tags?: string[] }, keywords: string[]): boolean {
  const text = `${diary.title} ${diary.content} ${(diary.tags || []).join(" ")}`.toLowerCase();
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

// 获取所有主题
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const withDiaries = searchParams.get("withDiaries") === "true";

    // 单个主题详情
    if (id) {
      const theme = PRESET_THEMES.find((t) => t.id === id);
      if (!theme) {
        return NextResponse.json({ error: "Theme not found" }, { status: 404 });
      }

      const diaries = await getDiaries();
      const matchedDiaries = diaries
        .filter((d) => matchTheme(d, theme.keywords))
        .map((d) => ({
          id: d.id,
          title: d.title,
          date: d.date,
          content: d.content.substring(0, 200),
          image: d.image,
          tags: d.tags,
        }));

      return NextResponse.json({
        theme: {
          ...theme,
          count: matchedDiaries.length,
        },
        diaries: withDiaries ? matchedDiaries : undefined,
      });
    }

    // 所有主题统计
    const diaries = await getDiaries();
    const themesWithStats = PRESET_THEMES.map((theme) => {
      const count = diaries.filter((d) => matchTheme(d, theme.keywords)).length;
      return {
        ...theme,
        count,
      };
    });

    return NextResponse.json({
      themes: themesWithStats,
      total: PRESET_THEMES.length,
      active: themesWithStats.filter((t) => t.count > 0).length,
    });
  } catch (error) {
    console.error("Error fetching themes:", error);
    return NextResponse.json({ error: "Failed to fetch themes" }, { status: 500 });
  }
}