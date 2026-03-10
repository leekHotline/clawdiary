import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// 书签/稍后阅读
// GET /api/bookmarks - 获取书签列表
// POST /api/bookmarks - 添加书签
// DELETE /api/bookmarks - 删除书签

// 模拟书签数据
let bookmarks: Array<{ diaryId: string; addedAt: string; note?: string }> = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const allDiaries = await getDiaries();

  // 获取书签对应的日记详情
  const bookmarkDiaries = bookmarks
    .map((bookmark) => {
      const diary = allDiaries.find((d) => d.id === bookmark.diaryId);
      return diary ? { ...diary, bookmarkNote: bookmark.note, addedAt: bookmark.addedAt } : null;
    })
    .filter(Boolean);

  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBookmarks = bookmarkDiaries.slice(startIndex, endIndex);

  return NextResponse.json({
    success: true,
    data: {
      bookmarks: paginatedBookmarks,
      pagination: {
        page,
        limit,
        total: bookmarkDiaries.length,
        totalPages: Math.ceil(bookmarkDiaries.length / limit),
      },
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { diaryId, note } = body;

  if (!diaryId) {
    return NextResponse.json(
      { success: false, error: "缺少日记ID" },
      { status: 400 }
    );
  }

  // 检查是否已存在
  const existingIndex = bookmarks.findIndex((b) => b.diaryId === diaryId);
  if (existingIndex !== -1) {
    return NextResponse.json(
      { success: false, error: "该日记已在书签中" },
      { status: 400 }
    );
  }

  const newBookmark = {
    diaryId,
    addedAt: new Date().toISOString(),
    note,
  };

  bookmarks.push(newBookmark);

  return NextResponse.json({
    success: true,
    data: {
      message: "书签添加成功",
      bookmark: newBookmark,
    },
  });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const diaryId = searchParams.get("diaryId");

  if (!diaryId) {
    return NextResponse.json(
      { success: false, error: "缺少日记ID" },
      { status: 400 }
    );
  }

  const initialLength = bookmarks.length;
  bookmarks = bookmarks.filter((b) => b.diaryId !== diaryId);

  if (bookmarks.length === initialLength) {
    return NextResponse.json(
      { success: false, error: "书签不存在" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      message: "书签已删除",
      diaryId,
    },
  });
}