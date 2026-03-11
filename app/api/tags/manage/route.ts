import { NextRequest, NextResponse } from "next/server";

// 获取所有标签及其统计信息
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "count"; // count | name | recent
    const order = searchParams.get("order") || "desc";
    
    // 模拟标签数据
    const tags = [
      { name: "日常", count: 156, lastUsed: new Date().toISOString(), color: "#FF6B6B" },
      { name: "心情", count: 89, lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), color: "#4ECDC4" },
      { name: "工作", count: 67, lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), color: "#45B7D1" },
      { name: "旅行", count: 45, lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), color: "#96CEB4" },
      { name: "读书", count: 38, lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), color: "#FFEAA7" },
      { name: "美食", count: 32, lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), color: "#DDA0DD" },
      { name: "电影", count: 28, lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), color: "#98D8C8" },
      { name: "运动", count: 25, lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), color: "#F7DC6F" },
      { name: "音乐", count: 21, lastUsed: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), color: "#BB8FCE" },
      { name: "学习", count: 18, lastUsed: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), color: "#85C1E9" },
      { name: "反思", count: 15, lastUsed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), color: "#F8B500" },
      { name: "家人", count: 12, lastUsed: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), color: "#FF8C94" },
      { name: "朋友", count: 10, lastUsed: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), color: "#91EAE4" },
      { name: "健康", count: 8, lastUsed: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), color: "#A8E6CF" },
      { name: "梦想", count: 6, lastUsed: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), color: "#FFD93D" },
    ];
    
    // 排序
    const sortedTags = [...tags].sort((a, b) => {
      if (sort === "name") {
        return order === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sort === "recent") {
        return order === "asc" 
          ? new Date(a.lastUsed).getTime() - new Date(b.lastUsed).getTime()
          : new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
      }
      return order === "asc" ? a.count - b.count : b.count - a.count;
    });
    
    const totalTags = tags.length;
    const totalUsage = tags.reduce((sum, tag) => sum + tag.count, 0);
    
    return NextResponse.json({
      tags: sortedTags,
      stats: {
        totalTags,
        totalUsage,
        avgPerTag: Math.round(totalUsage / totalTags),
        topTag: sortedTags[0]?.name || null,
      },
    });
  } catch (error) {
    console.error("获取标签列表失败:", error);
    return NextResponse.json(
      { error: "获取标签列表失败" },
      { status: 500 }
    );
  }
}

// 创建新标签
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: "标签名称不能为空" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      tag: {
        name,
        count: 0,
        lastUsed: null,
        color: color || `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
        createdAt: new Date().toISOString(),
      },
      message: "标签创建成功",
    });
  } catch (error) {
    console.error("创建标签失败:", error);
    return NextResponse.json(
      { error: "创建标签失败" },
      { status: 500 }
    );
  }
}

// 批量合并标签
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceTags, targetTag } = body;
    
    if (!sourceTags?.length || !targetTag) {
      return NextResponse.json(
        { error: "参数不完整" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `已将 ${sourceTags.length} 个标签合并到 "${targetTag}"`,
      mergedCount: sourceTags.length,
      targetTag,
    });
  } catch (error) {
    console.error("合并标签失败:", error);
    return NextResponse.json(
      { error: "合并标签失败" },
      { status: 500 }
    );
  }
}