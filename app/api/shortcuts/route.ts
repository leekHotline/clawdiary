import { NextRequest, NextResponse } from "next/server";

// 快捷方式/导航 API
interface Shortcut {
  id: string;
  title: string;
  icon: string;
  path: string;
  description: string;
  category: "quick" | "tools" | "stats" | "settings";
  order: number;
  isVisible: boolean;
  createdAt: string;
}

// 默认快捷方式
const shortcuts: Shortcut[] = [
  // 快速操作
  {
    id: "1",
    title: "写日记",
    icon: "✏️",
    path: "/write",
    description: "创建一篇新日记",
    category: "quick",
    order: 1,
    isVisible: true,
    createdAt: "2026-03-09T00:00:00.000Z",
  },
  {
    id: "2",
    title: "随机阅读",
    icon: "🎲",
    path: "/random",
    description: "随机推荐一篇日记",
    category: "quick",
    order: 2,
    isVisible: true,
    createdAt: "2026-03-09T00:00:00.000Z",
  },
  {
    id: "3",
    title: "今日心情",
    icon: "😊",
    path: "/mood",
    description: "记录今天的心情",
    category: "quick",
    order: 3,
    isVisible: true,
    createdAt: "2026-03-09T00:00:00.000Z",
  },

  // 工具
  {
    id: "4",
    title: "AI 助手",
    icon: "🤖",
    path: "/assistant",
    description: "智能写作助手",
    category: "tools",
    order: 1,
    isVisible: true,
    createdAt: "2026-03-09T00:00:00.000Z",
  },
  {
    id: "5",
    title: "搜索",
    icon: "🔍",
    path: "/search",
    description: "搜索日记内容",
    category: "tools",
    order: 2,
    isVisible: true,
    createdAt: "2026-03-09T00:00:00.000Z",
  },
  {
    id: "6",
    title: "标签管理",
    icon: "🏷️",
    path: "/tags",
    description: "管理日记标签",
    category: "tools",
    order: 3,
    isVisible: true,
    createdAt: "2026-03-09T00:00:00.000Z",
  },
  {
    id: "7",
    title: "收藏夹",
    icon: "⭐",
    path: "/favorites",
    description: "查看收藏的日记",
    category: "tools",
    order: 4,
    isVisible: true,
    createdAt: "2026-03-09T00:00:00.000Z",
  },
  {
    id: "8",
    title: "草稿箱",
    icon: "📝",
    path: "/drafts",
    description: "继续编辑草稿",
    category: "tools",
    order: 5,
    isVisible: true,
    createdAt: "2026-03-09T00:00:00.000Z",
  },

  // 统计
  {
    id: "9",
    title: "数据统计",
    icon: "📊",
    path: "/stats",
    description: "查看写作统计",
    category: "stats",
    order: 1,
    isVisible: true,
    createdAt: "2026-03-09T00:00:00.000Z",
  },
  {
    id: "10",
    title: "年度报告",
    icon: "📅",
    path: "/annual-report",
    description: "回顾一年的成长",
    category: "stats",
    order: 2,
    isVisible: true,
    createdAt: "2026-03-09T00:00:00.000Z",
  },
  {
    id: "11",
    title: "AI 洞察",
    icon: "🔮",
    path: "/insights",
    description: "智能分析和建议",
    category: "stats",
    order: 3,
    isVisible: true,
    createdAt: "2026-03-09T00:00:00.000Z",
  },
  {
    id: "12",
    title: "成就系统",
    icon: "🏆",
    path: "/my/achievements",
    description: "查看获得的成就",
    category: "stats",
    order: 4,
    isVisible: true,
    createdAt: "2026-03-09T00:00:00.000Z",
  },

  // 设置
  {
    id: "13",
    title: "个人设置",
    icon: "⚙️",
    path: "/settings",
    description: "调整应用设置",
    category: "settings",
    order: 1,
    isVisible: true,
    createdAt: "2026-03-09T00:00:00.000Z",
  },
  {
    id: "14",
    title: "主题换肤",
    icon: "🎨",
    path: "/settings/themes",
    description: "更换应用主题",
    category: "settings",
    order: 2,
    isVisible: true,
    createdAt: "2026-03-09T00:00:00.000Z",
  },
  {
    id: "15",
    title: "帮助中心",
    icon: "❓",
    path: "/help",
    description: "获取帮助和反馈",
    category: "settings",
    order: 3,
    isVisible: true,
    createdAt: "2026-03-09T00:00:00.000Z",
  },
];

// GET - 获取快捷方式
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let result = shortcuts;
  if (category) {
    result = shortcuts.filter((s) => s.category === category);
  }

  return NextResponse.json({
    success: true,
    shortcuts: result.sort((a, b) => a.order - b.order),
    total: result.length,
    categories: {
      quick: shortcuts.filter((s) => s.category === "quick").length,
      tools: shortcuts.filter((s) => s.category === "tools").length,
      stats: shortcuts.filter((s) => s.category === "stats").length,
      settings: shortcuts.filter((s) => s.category === "settings").length,
    },
  });
}

// POST - 添加自定义快捷方式
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, icon, path, description, category } = body;

    if (!title || !path) {
      return NextResponse.json(
        { error: "Title and path are required" },
        { status: 400 }
      );
    }

    const newShortcut: Shortcut = {
      id: Date.now().toString(),
      title,
      icon: icon || "🔗",
      path,
      description: description || "",
      category: category || "quick",
      order: shortcuts.filter((s) => s.category === (category || "quick")).length + 1,
      isVisible: true,
      createdAt: new Date().toISOString(),
    };

    shortcuts.push(newShortcut);

    return NextResponse.json({
      success: true,
      shortcut: newShortcut,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create shortcut" },
      { status: 500 }
    );
  }
}

// PUT - 更新快捷方式顺序或可见性
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, order, isVisible } = body;

    const index = shortcuts.findIndex((s) => s.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Shortcut not found" }, { status: 404 });
    }

    if (order !== undefined) shortcuts[index].order = order;
    if (isVisible !== undefined) shortcuts[index].isVisible = isVisible;

    return NextResponse.json({
      success: true,
      shortcut: shortcuts[index],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update shortcut" },
      { status: 500 }
    );
  }
}

// DELETE - 删除快捷方式
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const index = shortcuts.findIndex((s) => s.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Shortcut not found" }, { status: 404 });
    }

    shortcuts.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: "Shortcut deleted",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete shortcut" },
      { status: 500 }
    );
  }
}