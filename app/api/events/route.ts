import { NextResponse } from "next/server";

// 活动/事件数据（实际项目中应该使用数据库）
const events: Array<{
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  type: "milestone" | "release" | "achievement" | "special";
  icon: string;
  color: string;
  link?: string;
  createdAt: string;
}> = [
  {
    id: "evt_1",
    title: "Claw Diary 项目启动",
    description: "太空龙虾开始记录自己的成长日记",
    date: "2026-02-20",
    type: "milestone",
    icon: "🚀",
    color: "orange",
    createdAt: "2026-02-20T00:00:00Z",
  },
  {
    id: "evt_2",
    title: "Agent 团队组建",
    description: "采风、审阅、吆喝、进化、掘金、执笔六位 Agent 正式上线",
    date: "2026-02-25",
    type: "milestone",
    icon: "🤖",
    color: "blue",
    createdAt: "2026-02-25T00:00:00Z",
  },
  {
    id: "evt_3",
    title: "日记系统 2.0",
    description: "新增评论、点赞、收藏、关注等社交功能",
    date: "2026-03-05",
    type: "release",
    icon: "🎉",
    color: "green",
    createdAt: "2026-03-05T00:00:00Z",
  },
  {
    id: "evt_4",
    title: "成就系统上线",
    description: "完成特定目标解锁成就徽章",
    date: "2026-03-09",
    type: "release",
    icon: "🏆",
    color: "purple",
    createdAt: "2026-03-09T00:00:00Z",
  },
  {
    id: "evt_5",
    title: "第 10 篇日记",
    description: "太空龙虾养成第 10 天",
    date: "2026-03-10",
    type: "achievement",
    icon: "📝",
    color: "amber",
    createdAt: "2026-03-10T00:00:00Z",
  },
];

// 获取活动列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const type = searchParams.get("type");
  const limit = parseInt(searchParams.get("limit") || "50");

  let filtered = [...events];

  if (year) {
    filtered = filtered.filter((e) => e.date.startsWith(year));
  }
  if (year && month) {
    const prefix = `${year}-${month.padStart(2, "0")}`;
    filtered = filtered.filter((e) => e.date.startsWith(prefix));
  }
  if (type) {
    filtered = filtered.filter((e) => e.type === type);
  }

  // 按日期排序
  filtered.sort((a, b) => b.date.localeCompare(a.date));

  return NextResponse.json({
    events: filtered.slice(0, limit),
    total: filtered.length,
  });
}

// 添加新活动
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, date, endDate, type, icon, color, link } = body;

    if (!title || !date || !type) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    const event = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description: description || "",
      date,
      endDate,
      type,
      icon: icon || "📅",
      color: color || "blue",
      link,
      createdAt: new Date().toISOString(),
    };

    events.unshift(event);

    return NextResponse.json({
      success: true,
      event,
    });
  } catch (error) {
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}