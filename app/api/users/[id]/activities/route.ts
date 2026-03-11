import { NextResponse } from "next/server";

// 用户活动流 API
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "current";
  const type = searchParams.get("type") || "all"; // all, diaries, comments, likes
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  // 模拟活动数据
  const activities = [
    {
      id: "act1",
      type: "diary",
      action: "published",
      title: "成长的思考",
      targetId: "d1",
      targetUrl: "/diary/d1",
      createdAt: "2026-03-12T06:30:00Z",
      stats: { views: 156, likes: 23, comments: 8 },
    },
    {
      id: "act2",
      type: "comment",
      action: "commented_on",
      title: "回复了「一个人的云南之旅」",
      targetId: "d2",
      targetUrl: "/diary/d2",
      createdAt: "2026-03-12T05:00:00Z",
    },
    {
      id: "act3",
      type: "like",
      action: "liked",
      title: "喜欢了「技术学习笔记」",
      targetId: "d3",
      targetUrl: "/diary/d3",
      createdAt: "2026-03-12T04:00:00Z",
    },
    {
      id: "act4",
      type: "follow",
      action: "followed",
      title: "关注了 星辰",
      targetId: "u1",
      targetUrl: "/user/u1",
      createdAt: "2026-03-11T20:00:00Z",
    },
    {
      id: "act5",
      type: "achievement",
      action: "earned",
      title: "获得成就「日记达人」",
      targetId: "ach1",
      targetUrl: "/achievements",
      createdAt: "2026-03-11T18:00:00Z",
    },
    {
      id: "act6",
      type: "group",
      action: "joined",
      title: "加入了「写作爱好者联盟」",
      targetId: "g1",
      targetUrl: "/groups/g1",
      createdAt: "2026-03-11T15:00:00Z",
    },
    {
      id: "act7",
      type: "contest",
      action: "participated",
      title: "参加了「春日物语」写作大赛",
      targetId: "c1",
      targetUrl: "/contests/c1",
      createdAt: "2026-03-10T10:00:00Z",
    },
    {
      id: "act8",
      type: "bookmark",
      action: "saved",
      title: "收藏了「晨间日记的力量」",
      targetId: "d4",
      targetUrl: "/diary/d4",
      createdAt: "2026-03-10T08:00:00Z",
    },
  ];

  // 按类型筛选
  const filteredActivities = type === "all"
    ? activities
    : activities.filter(a => a.type === type);

  // 分页
  const paginatedActivities = filteredActivities.slice(offset, offset + limit);

  return NextResponse.json({
    success: true,
    data: {
      activities: paginatedActivities,
      total: filteredActivities.length,
      hasMore: offset + limit < filteredActivities.length,
    },
  });
}