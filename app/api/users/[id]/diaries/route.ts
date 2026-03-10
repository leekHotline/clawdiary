import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// 用户日记列表
// GET /api/users/[id]/diaries - 获取用户的日记列表

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const tag = searchParams.get("tag");
  const sortBy = searchParams.get("sortBy") || "date"; // date, likes, views

  const allDiaries = await getDiaries();

  // 筛选用户的日记（这里模拟，实际应该根据 userId 筛选）
  let userDiaries = allDiaries.map((diary) => ({
    ...diary,
    views: Math.floor(Math.random() * 500) + 50,
    likes: Math.floor(Math.random() * 100) + 10,
    comments: Math.floor(Math.random() * 20),
  }));

  // 标签筛选
  if (tag) {
    userDiaries = userDiaries.filter((d) => d.tags?.includes(tag));
  }

  // 排序
  if (sortBy === "likes") {
    userDiaries.sort((a, b) => b.likes - a.likes);
  } else if (sortBy === "views") {
    userDiaries.sort((a, b) => b.views - a.views);
  } else {
    // 默认按日期排序
    userDiaries.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedDiaries = userDiaries.slice(startIndex, endIndex);

  return NextResponse.json({
    success: true,
    data: {
      userId,
      diaries: paginatedDiaries,
      pagination: {
        page,
        limit,
        total: userDiaries.length,
        totalPages: Math.ceil(userDiaries.length / limit),
      },
      filters: {
        tag,
        sortBy,
      },
    },
  });
}