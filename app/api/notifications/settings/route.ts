import { NextRequest, NextResponse } from "next/server";

// 通知设置 API
interface NotificationSetting {
  id: string;
  type: "email" | "push" | "sms" | "webhook";
  enabled: boolean;
  events: {
    newDiary: boolean;
    weeklyReport: boolean;
    achievements: boolean;
    mentions: boolean;
    systemUpdates: boolean;
  };
  config: {
    email?: string;
    webhookUrl?: string;
    pushToken?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// 模拟数据
let notificationSettings: NotificationSetting[] = [
  {
    id: "1",
    type: "email",
    enabled: true,
    events: {
      newDiary: true,
      weeklyReport: true,
      achievements: true,
      mentions: true,
      systemUpdates: false,
    },
    config: {
      email: "user@example.com",
    },
    createdAt: "2026-03-09T00:00:00.000Z",
    updatedAt: "2026-03-11T00:00:00.000Z",
  },
  {
    id: "2",
    type: "push",
    enabled: true,
    events: {
      newDiary: true,
      weeklyReport: false,
      achievements: true,
      mentions: true,
      systemUpdates: false,
    },
    config: {},
    createdAt: "2026-03-09T00:00:00.000Z",
    updatedAt: "2026-03-11T00:00:00.000Z",
  },
];

// GET - 获取通知设置
export async function GET() {
  return NextResponse.json({
    success: true,
    settings: notificationSettings,
    summary: {
      totalEnabled: notificationSettings.filter((s) => s.enabled).length,
      emailEnabled: notificationSettings.find((s) => s.type === "email")?.enabled || false,
      pushEnabled: notificationSettings.find((s) => s.type === "push")?.enabled || false,
    },
  });
}

// POST - 创建通知设置
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, enabled, events, config } = body;

    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    const newSetting: NotificationSetting = {
      id: Date.now().toString(),
      type,
      enabled: enabled ?? true,
      events: events || {
        newDiary: true,
        weeklyReport: true,
        achievements: true,
        mentions: true,
        systemUpdates: false,
      },
      config: config || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    notificationSettings.push(newSetting);

    return NextResponse.json({
      success: true,
      setting: newSetting,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create notification setting" },
      { status: 500 }
    );
  }
}

// PUT - 更新通知设置
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, enabled, events, config } = body;

    const index = notificationSettings.findIndex((s) => s.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 });
    }

    notificationSettings[index] = {
      ...notificationSettings[index],
      enabled: enabled ?? notificationSettings[index].enabled,
      events: events || notificationSettings[index].events,
      config: config || notificationSettings[index].config,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      setting: notificationSettings[index],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update notification setting" },
      { status: 500 }
    );
  }
}