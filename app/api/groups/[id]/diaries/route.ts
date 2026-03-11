import { NextRequest, NextResponse } from "next/server";

// 群组日记 API
// GET /api/groups/[id]/diaries - 获取群组日记列表

const mockGroupDiaries = [
  {
    id: "gd1",
    groupId: "g1",
    title: "今天的写作灵感",
    content: "清晨醒来，脑海中浮现出无数灵感...",
    author: { id: "u1", name: "星辰", avatar: "⭐" },
    likes: 12,
    comments: 5,
    reactions: { "❤️": 8, "👍": 4 },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isPinned: true,
    tags: ["写作", "灵感"],
  },
  {
    id: "gd2",
    groupId: "g1",
    title: "分享一个写作技巧",
    content: "最近发现一个提高写作效率的方法...",
    author: { id: "u2", name: "月光", avatar: "🌙" },
    likes: 8,
    comments: 3,
    reactions: { "❤️": 5, "🔥": 3 },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isPinned: false,
    tags: ["技巧", "分享"],
  },
  {
    id: "gd3",
    groupId: "g1",
    title: "本月写作目标完成情况",
    content: "这个月我完成了20篇日记...",
    author: { id: "u3", name: "彩虹", avatar: "🌈" },
    likes: 15,
    comments: 8,
    reactions: { "🎉": 10, "💪": 5 },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isPinned: false,
    tags: ["目标", "总结"],
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: groupId } = await params;
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");
  const tag = searchParams.get("tag");
  const authorId = searchParams.get("authorId");

  let filteredDiaries = [...mockGroupDiaries];

  // 标签过滤
  if (tag) {
    filteredDiaries = filteredDiaries.filter((d) => d.tags.includes(tag));
  }

  // 作者过滤
  if (authorId) {
    filteredDiaries = filteredDiaries.filter((d) => d.author.id === authorId);
  }

  // 排序：置顶优先，然后按时间
  filteredDiaries.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // 分页
  const paginatedDiaries = filteredDiaries.slice(offset, offset + limit);

  return NextResponse.json({
    success: true,
    data: {
      diaries: paginatedDiaries,
      total: filteredDiaries.length,
      hasMore: offset + limit < filteredDiaries.length,
    },
  });
}