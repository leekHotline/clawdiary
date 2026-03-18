import { NextRequest, NextResponse } from "next/server";

// 书签分组 API
interface BookmarkGroup {
  id: string;
  name: string;
  icon: string;
  color: string;
  bookmarkCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Bookmark {
  id: string;
  diaryId: string;
  diaryTitle: string;
  groupId: string;
  note: string;
  createdAt: string;
}

// 模拟数据
const bookmarkGroups: BookmarkGroup[] = [
  {
    id: "1",
    name: "重要日记",
    icon: "⭐",
    color: "#FFD700",
    bookmarkCount: 5,
    createdAt: "2026-03-09T00:00:00.000Z",
    updatedAt: "2026-03-11T00:00:00.000Z",
  },
  {
    id: "2",
    name: "学习笔记",
    icon: "📚",
    color: "#4A90D9",
    bookmarkCount: 8,
    createdAt: "2026-03-09T00:00:00.000Z",
    updatedAt: "2026-03-11T00:00:00.000Z",
  },
  {
    id: "3",
    name: "灵感记录",
    icon: "💡",
    color: "#FF6B6B",
    bookmarkCount: 3,
    createdAt: "2026-03-10T00:00:00.000Z",
    updatedAt: "2026-03-11T00:00:00.000Z",
  },
];

const bookmarks: Bookmark[] = [
  {
    id: "1",
    diaryId: "3",
    diaryTitle: "🎉 Claw Diary 上线了！",
    groupId: "1",
    note: "产品里程碑",
    createdAt: "2026-03-10T00:00:00.000Z",
  },
  {
    id: "2",
    diaryId: "6",
    diaryTitle: "🤖 6 Agent 协作启动！",
    groupId: "1",
    note: "Agent 协作记录",
    createdAt: "2026-03-10T10:00:00.000Z",
  },
  {
    id: "3",
    diaryId: "4",
    diaryTitle: "🐛 复盘：图片生成 API 问题与修复",
    groupId: "2",
    note: "技术复盘方法论",
    createdAt: "2026-03-10T03:00:00.000Z",
  },
];

// GET - 获取所有书签分组
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeBookmarks = searchParams.get("includeBookmarks") === "true";

  const result = bookmarkGroups.map((group) => ({
    ...group,
    bookmarks: includeBookmarks
      ? bookmarks.filter((b) => b.groupId === group.id)
      : undefined,
  }));

  return NextResponse.json({
    success: true,
    groups: result,
    total: bookmarkGroups.length,
  });
}

// POST - 创建新书签分组
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, icon, color } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newGroup: BookmarkGroup = {
      id: Date.now().toString(),
      name,
      icon: icon || "📁",
      color: color || "#6B7280",
      bookmarkCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    bookmarkGroups.push(newGroup);

    return NextResponse.json({
      success: true,
      group: newGroup,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create bookmark group" },
      { status: 500 }
    );
  }
}

// PUT - 更新书签分组
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, icon, color } = body;

    const index = bookmarkGroups.findIndex((g) => g.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    bookmarkGroups[index] = {
      ...bookmarkGroups[index],
      name: name || bookmarkGroups[index].name,
      icon: icon || bookmarkGroups[index].icon,
      color: color || bookmarkGroups[index].color,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      group: bookmarkGroups[index],
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update bookmark group" },
      { status: 500 }
    );
  }
}