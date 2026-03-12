import { NextRequest, NextResponse } from "next/server";

// 提醒数据
const reminders = [
  {
    id: 1,
    type: "daily",
    name: "晚间写作提醒",
    time: "21:00",
    days: [0, 1, 2, 3, 4, 5, 6], // 0-6: 日-六
    enabled: true,
    streak: 45,
    lastTriggered: "2026-03-12T21:00:00",
    createdAt: "2025-12-01",
  },
  {
    id: 2,
    type: "daily",
    name: "晨间反思",
    time: "08:00",
    days: [1, 3, 5], // 周一三五
    enabled: true,
    streak: 12,
    lastTriggered: "2026-03-10T08:00:00",
    createdAt: "2026-01-15",
  },
  {
    id: 3,
    type: "goal",
    name: "周目标检查",
    time: "20:00",
    days: [0], // 周日
    enabled: false,
    streak: 0,
    lastTriggered: null,
    createdAt: "2026-02-01",
  },
];

// 提醒历史
const reminderHistory = [
  { id: 1, reminderId: 1, date: "2026-03-12", time: "21:00", response: "completed", responseTime: 120 },
  { id: 2, reminderId: 1, date: "2026-03-11", time: "21:00", response: "completed", responseTime: 90 },
  { id: 3, reminderId: 2, date: "2026-03-11", time: "08:00", response: "skipped", responseTime: 0 },
  { id: 4, reminderId: 1, date: "2026-03-10", time: "21:00", response: "completed", responseTime: 180 },
  { id: 5, reminderId: 2, date: "2026-03-10", time: "08:00", response: "completed", responseTime: 150 },
];

// 提醒类型配置
const reminderTypes = {
  daily: {
    name: "每日提醒",
    icon: "📅",
    description: "每天固定时间提醒写作",
  },
  streak: {
    name: "连续提醒",
    icon: "🔥",
    description: "保持写作连续性，断档时提醒",
  },
  mood: {
    name: "心情提醒",
    icon: "😊",
    description: "定期记录心情变化",
  },
  goal: {
    name: "目标提醒",
    icon: "🎯",
    description: "达成写作目标时提醒",
  },
  anniversary: {
    name: "纪念日提醒",
    icon: "🎂",
    description: "特别日子的提醒",
  },
};

// 统计数据
function getStats() {
  const completed = reminderHistory.filter(h => h.response === "completed").length;
  const total = reminderHistory.length;
  
  return {
    totalReminders: 156,
    completionRate: Math.round((completed / total) * 100),
    currentStreak: 45,
    longestStreak: 62,
    avgResponseTime: "2分钟",
    bestTime: "21:00",
    responseDistribution: {
      completed: 139,
      skipped: 12,
      snoozed: 5,
    },
    weeklyCompletion: [
      { day: "周一", rate: 92 },
      { day: "周二", rate: 88 },
      { day: "周三", rate: 95 },
      { day: "周四", rate: 90 },
      { day: "周五", rate: 85 },
      { day: "周六", rate: 78 },
      { day: "周日", rate: 82 },
    ],
  };
}

// 智能建议
function getSmartSuggestions() {
  return [
    {
      id: 1,
      icon: "📊",
      title: "最佳写作时间",
      desc: "根据你的历史数据，21:00 是你最可能完成写作的时间",
      action: "设置此时间",
      priority: "high",
    },
    {
      id: 2,
      icon: "🎯",
      title: "目标提醒建议",
      desc: "每周日晚上检查本周目标完成情况",
      action: "添加提醒",
      priority: "medium",
    },
    {
      id: 3,
      icon: "🔥",
      title: "连续性保护",
      desc: "已连续45天写作，建议开启连续保护提醒",
      action: "开启保护",
      priority: "high",
    },
    {
      id: 4,
      icon: "📅",
      title: "周末提醒优化",
      desc: "周末完成率较低，建议调整提醒时间",
      action: "调整时间",
      priority: "low",
    },
  ];
}

// 创建提醒
function createReminder(data: {
  type: string;
  name: string;
  time: string;
  days: number[];
  enabled?: boolean;
}) {
  const newReminder = {
    id: reminders.length + 1,
    type: data.type,
    name: data.name,
    time: data.time,
    days: data.days,
    enabled: data.enabled ?? true,
    streak: 0,
    lastTriggered: null,
    createdAt: new Date().toISOString().split("T")[0],
  };
  
  reminders.push(newReminder);
  return newReminder;
}

// 更新提醒
function updateReminder(id: number, data: Partial<typeof reminders[0]>) {
  const index = reminders.findIndex(r => r.id === id);
  if (index === -1) return null;
  
  reminders[index] = { ...reminders[index], ...data };
  return reminders[index];
}

// 记录响应
function recordResponse(reminderId: number, response: "completed" | "skipped" | "snoozed") {
  const history = {
    id: reminderHistory.length + 1,
    reminderId,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    response,
    responseTime: Math.floor(Math.random() * 300), // 模拟响应时间
  };
  
  reminderHistory.push(history);
  
  // 更新连续天数
  if (response === "completed") {
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder) {
      reminder.streak++;
      reminder.lastTriggered = new Date().toISOString();
    }
  }
  
  return history;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action") || "list";
  
  switch (action) {
    case "list":
      return NextResponse.json({
        success: true,
        data: reminders,
      });
      
    case "types":
      return NextResponse.json({
        success: true,
        data: reminderTypes,
      });
      
    case "stats":
      return NextResponse.json({
        success: true,
        data: getStats(),
      });
      
    case "suggestions":
      return NextResponse.json({
        success: true,
        data: getSmartSuggestions(),
      });
      
    case "history":
      const limit = parseInt(searchParams.get("limit") || "10");
      return NextResponse.json({
        success: true,
        data: reminderHistory.slice(-limit).reverse(),
      });
      
    case "get":
      const id = parseInt(searchParams.get("id") || "0");
      const reminder = reminders.find(r => r.id === id);
      if (!reminder) {
        return NextResponse.json({ success: false, error: "提醒不存在" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: reminder });
      
    default:
      return NextResponse.json({ success: false, error: "未知操作" }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, ...data } = body;
  
  switch (action) {
    case "create":
      const reminder = createReminder(data);
      return NextResponse.json({
        success: true,
        data: reminder,
        message: "提醒创建成功",
      });
      
    case "update":
      const updated = updateReminder(data.id, data);
      if (!updated) {
        return NextResponse.json({ success: false, error: "提醒不存在" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        data: updated,
        message: "提醒更新成功",
      });
      
    case "response":
      const history = recordResponse(data.reminderId, data.response);
      return NextResponse.json({
        success: true,
        data: history,
        message: "响应已记录",
      });
      
    case "delete":
      const index = reminders.findIndex(r => r.id === data.id);
      if (index === -1) {
        return NextResponse.json({ success: false, error: "提醒不存在" }, { status: 404 });
      }
      reminders.splice(index, 1);
      return NextResponse.json({
        success: true,
        message: "提醒已删除",
      });
      
    default:
      return NextResponse.json({ success: false, error: "未知操作" }, { status: 400 });
  }
}