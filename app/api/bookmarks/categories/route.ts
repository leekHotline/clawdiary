import { NextRequest, NextResponse } from "next/server";

// 书签分组管理 API

interface BookmarkGroup {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  bookmarkCount: number;
  createdAt: string;
  updatedAt: string;
}

let groupsStore: BookmarkGroup[] = [
  {
    id: "learning",
    name: "学习资源",
    icon: "📚",
    color: "blue",
    description: "技术文档和教程",
    bookmarkCount: 12,
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-03-11T00:00:00.000Z",
  },
  {
    id: "tools",
    name: "实用工具",
    icon: "🔧",
    color: "green",
    description: "在线工具和服务",
    bookmarkCount: 8,
    createdAt: "2026-03-05T00:00:00.000Z",
    updatedAt: "2026-03-11T00:00:00.000Z",
  },
  {
    id: "inspiration",
    name: "灵感素材",
    icon: "✨",
    color: "purple",
    description: "设计灵感和创意来源",
    bookmarkCount: 15,
    createdAt: "2026-03-08T00:00:00.000Z",
    updatedAt: "2026-03-11T00:00:00.000Z",
  },
  {
    id: "reading",
    name: "待读文章",
    icon: "📖",
    color: "amber",
    description: "稍后阅读的长文",
    bookmarkCount: 23,
    createdAt: "2026-03-10T00:00:00.000Z",
    updatedAt: "2026-03-11T00:00:00.000Z",
  },
  {
    id: "reference",
    name: "参考资料",
    icon: "📋",
    color: "gray",
    description: "API 文档和速查表",
    bookmarkCount: 18,
    createdAt: "2026-03-10T00:00:00.000Z",
    updatedAt: "2026-03-11T00:00:00.000Z",
  },
];

// 获取所有分组
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const order = searchParams.get("order") || "desc";

  let groups = [...groupsStore];

  // 排序
  groups.sort((a, b) => {
    const aVal = a[sortBy as keyof BookmarkGroup] || "";
    const bVal = b[sortBy as keyof BookmarkGroup] || "";
    if (typeof aVal === "number" && typeof bVal === "number") {
      return order === "asc" ? aVal - bVal : bVal - aVal;
    }
    if (typeof aVal === "string" && typeof bVal === "string") {
      return order === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return 0;
  });

  return NextResponse.json({
    success: true,
    data: groups,
    total: groups.length,
  });
}

// 创建分组
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, icon, color, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "分组名称不能为空" },
        { status: 400 }
      );
    }

    // 检查重复
    if (groupsStore.some((g) => g.name === name)) {
      return NextResponse.json(
        { success: false, error: "分组名称已存在" },
        { status: 400 }
      );
    }

    const newGroup: BookmarkGroup = {
      id: `group-${Date.now()}`,
      name,
      icon: icon || "📁",
      color: color || "gray",
      description,
      bookmarkCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    groupsStore.push(newGroup);

    return NextResponse.json({
      success: true,
      message: "分组创建成功",
      data: newGroup,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "创建分组失败" },
      { status: 500 }
    );
  }
}

// 更新分组
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "分组 ID 不能为空" },
        { status: 400 }
      );
    }

    const index = groupsStore.findIndex((g) => g.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "分组不存在" },
        { status: 404 }
      );
    }

    groupsStore[index] = {
      ...groupsStore[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "分组更新成功",
      data: groupsStore[index],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "更新分组失败" },
      { status: 500 }
    );
  }
}

// 删除分组
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "分组 ID 不能为空" },
        { status: 400 }
      );
    }

    const index = groupsStore.findIndex((g) => g.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "分组不存在" },
        { status: 404 }
      );
    }

    groupsStore.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: "分组删除成功",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "删除分组失败" },
      { status: 500 }
    );
  }
}