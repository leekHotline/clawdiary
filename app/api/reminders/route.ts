import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// 提醒 API
export async function GET() {
  const diaries = await getDiaries();
  
  // 基于用户习惯生成智能提醒建议
  const suggestions = generateSmartReminders(diaries);
  
  // 默认提醒列表
  const defaultReminders = [
    {
      id: "rem-1",
      title: "每日写作提醒",
      message: "今天写日记了吗？记录一下今天的心情吧！",
      time: "21:00",
      frequency: "daily",
      active: true,
      icon: "📝",
      createdAt: new Date().toISOString(),
    },
    {
      id: "rem-2",
      title: "周末复盘提醒",
      message: "一周过去了，来写个周复盘吧！",
      time: "10:00",
      frequency: "weekly",
      active: true,
      icon: "📊",
      createdAt: new Date().toISOString(),
    },
  ];
  
  return NextResponse.json({
    reminders: defaultReminders,
    suggestions,
  });
}

function generateSmartReminders(diaries: any[]) {
  const suggestions = [];
  
  // 分析用户写作时间偏好
  const hourlyStats = new Array(24).fill(0);
  diaries.forEach(d => {
    const date = new Date(d.createdAt || d.date);
    hourlyStats[date.getHours()]++;
  });
  
  // 找出最活跃的时段
  const peakHours = hourlyStats
    .map((count, hour) => ({ hour, count }))
    .filter(h => h.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  
  if (peakHours.length > 0) {
    const bestHour = peakHours[0].hour;
    suggestions.push({
      type: "peak-time",
      title: "最佳写作时间提醒",
      message: `你通常在 ${bestHour}:00 左右写作，设置一个提醒？`,
      suggestedTime: `${bestHour.toString().padStart(2, '0')}:00`,
      reason: `你在 ${peakHours[0].count} 篇日记中选择这个时间`,
    });
  }
  
  // 检查是否连续写作
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const wroteYesterday = diaries.some(d => d.date === yesterday);
  
  if (wroteYesterday) {
    suggestions.push({
      type: "streak",
      title: "保持连续写作",
      message: "昨天你写了日记，今天继续吧！",
      suggestedTime: "21:00",
      reason: "保持写作习惯",
    });
  }
  
  return suggestions;
}

// 创建新提醒
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, time, frequency, icon } = body;
    
    const reminder = {
      id: `rem-${Date.now()}`,
      title: title || "写作提醒",
      message: message || "该写日记啦！",
      time: time || "21:00",
      frequency: frequency || "daily",
      icon: icon || "📝",
      active: true,
      createdAt: new Date().toISOString(),
    };
    
    return NextResponse.json({
      success: true,
      reminder,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create reminder" },
      { status: 400 }
    );
  }
}