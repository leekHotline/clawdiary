import { NextRequest, NextResponse } from "next/server";

// 消息通知
// GET /api/notifications - 获取通知列表
// POST /api/notifications - 创建通知（系统内部调用）
// PUT /api/notifications - 标记通知为已读

// 模拟通知数据
const mockNotifications = [
  {
    id: "n1",
    type: "like",
    title: "收到新的赞",
    content: "星辰 赞了你的日记《成长的烦恼》",
    isRead: false,
    createdAt: "2024-03-10T10:30:00Z",
    data: { diaryId: "day-7", userId: "u1" },
  },
  {
    id: "n2",
    type: "comment",
    title: "新评论",
    content: "月光 评论了你的日记：写得真好！",
    isRead: false,
    createdAt: "2024-03-10T09:15:00Z",
    data: { diaryId: "day-6", userId: "u2" },
  },
  {
    id: "n3",
    type: "follow",
    title: "新粉丝",
    content: "彩虹 关注了你",
    isRead: true,
    createdAt: "2024-03-09T18:00:00Z",
    data: { userId: "u3" },
  },
  {
    id: "n4",
    type: "system",
    title: "系统通知",
    content: "恭喜！你的日记被推荐到首页",
    isRead: true,
    createdAt: "2024-03-09T12:00:00Z",
    data: {},
  },
  {
    id: "n5",
    type: "achievement",
    title: "成就解锁",
    content: "你获得了「坚持不懈」徽章！连续写日记 7 天",
    isRead: false,
    createdAt: "2024-03-08T08:00:00Z",
    data: { achievementId: "streak-7" },
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const type = searchParams.get("type"); // like, comment, follow, system, achievement
  const unreadOnly = searchParams.get("unreadOnly") === "true";

  // 筛选
  let notifications = [...mockNotifications];
  if (type) {
    notifications = notifications.filter((n) => n.type === type);
  }
  if (unreadOnly) {
    notifications = notifications.filter((n) => !n.isRead);
  }

  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedNotifications = notifications.slice(startIndex, endIndex);

  // 统计
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;
  const countByType = mockNotifications.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return NextResponse.json({
    success: true,
    data: {
      notifications: paginatedNotifications,
      pagination: {
        page,
        limit,
        total: notifications.length,
        totalPages: Math.ceil(notifications.length / limit),
      },
      stats: {
        unreadCount,
        countByType,
      },
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, title, content, data, userId } = body;

  const newNotification = {
    id: `n_${Date.now()}`,
    type: type || "system",
    title,
    content,
    isRead: false,
    createdAt: new Date().toISOString(),
    data: data || {},
  };

  return NextResponse.json({
    success: true,
    data: newNotification,
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { notificationIds, markAllRead } = body;

  if (markAllRead) {
    return NextResponse.json({
      success: true,
      data: {
        message: "所有通知已标记为已读",
        count: mockNotifications.length,
      },
    });
  }

  if (notificationIds && Array.isArray(notificationIds)) {
    return NextResponse.json({
      success: true,
      data: {
        message: "已标记为已读",
        ids: notificationIds,
      },
    });
  }

  return NextResponse.json(
    { success: false, error: "无效的请求" },
    { status: 400 }
  );
}