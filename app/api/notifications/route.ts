import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// 类型定义
interface Diary {
  id: string;
  title: string;
  date: string;
  slug?: string;
  likes?: number;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

// 模拟通知数据存储（实际应用中应该使用数据库）
// 这里基于日记数据生成智能通知
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const unreadOnly = searchParams.get("unread") === "true";
  
  const diaries = await getDiaries();
  
  // 生成智能通知
  const notifications = generateNotifications(diaries);
  
  // 过滤
  let filtered = notifications;
  if (type) {
    filtered = filtered.filter(n => n.type === type);
  }
  if (unreadOnly) {
    filtered = filtered.filter(n => !n.read);
  }
  
  const unread = notifications.filter(n => !n.read).length;
  
  return NextResponse.json({ notifications: filtered, unread });
}

function generateNotifications(diaries: Diary[]): Notification[] {
  const notifications: Notification[] = [];
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  
  // 系统通知
  notifications.push({
    id: "sys-1",
    type: "system",
    title: "欢迎使用 Claw Diary！",
    content: "太空龙虾日记系统已准备就绪，开始记录你的精彩时刻吧！",
    read: false,
    createdAt: new Date(now.getTime() - 1000 * 60 * 5).toISOString(), // 5分钟前
    link: "/create",
  });
  
  // 成就通知
  const diaryCount = diaries.length;
  if (diaryCount >= 10) {
    notifications.push({
      id: "ach-1",
      type: "achievement",
      title: "🎉 写作新手",
      content: `恭喜！你已经完成了 ${diaryCount} 篇日记，继续加油！`,
      read: diaryCount > 15,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
      link: "/badges",
    });
  }
  
  if (diaryCount >= 30) {
    notifications.push({
      id: "ach-2",
      type: "achievement",
      title: "🏆 写作达人",
      content: `太棒了！${diaryCount} 篇日记达成，你的坚持令人敬佩！`,
      read: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
      link: "/badges",
    });
  }
  
  // 计算连续写作天数
  const streak = calculateStreak(diaries);
  if (streak >= 7) {
    notifications.push({
      id: "ach-3",
      type: "achievement",
      title: "🔥 连续写作 7 天",
      content: "连续写作一周！保持这个势头，养成好习惯！",
      read: streak > 10,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(),
      link: "/stats/heatmap",
    });
  }
  
  // 提醒通知
  const todayDiaries = diaries.filter(d => d.date === today);
  if (todayDiaries.length === 0) {
    notifications.push({
      id: "rem-1",
      type: "reminder",
      title: "📝 今日日记提醒",
      content: "今天还没有写日记哦，记录一下今天的心情吧！",
      read: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
      link: "/create",
    });
  }
  
  // 更新通知
  notifications.push({
    id: "upd-1",
    type: "update",
    title: "🆕 新功能上线",
    content: "数据可视化系统上线啦！热力图、统计图表等你来探索。",
    read: false,
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(),
    link: "/stats/charts",
  });
  
  // 模拟评论通知
  if (diaryCount > 5) {
    const randomDiary = diaries[Math.floor(Math.random() * Math.min(5, diaries.length))];
    notifications.push({
      id: "com-1",
      type: "comment",
      title: "💬 新评论",
      content: `有人评论了你的日记「${randomDiary.title.substring(0, 20)}...」`,
      read: true,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 3).toISOString(),
      link: `/diary/${randomDiary.slug || randomDiary.id}`,
    });
  }
  
  // 模拟点赞通知
  if (diaryCount > 8) {
    const popularDiary = diaries.reduce((a, b) => 
      (a.likes || 0) > (b.likes || 0) ? a : b, diaries[0]);
    notifications.push({
      id: "like-1",
      type: "like",
      title: "❤️ 你的日记被点赞了",
      content: `「${popularDiary.title.substring(0, 20)}...」获得了 ${popularDiary.likes || Math.floor(Math.random() * 10) + 1} 个赞`,
      read: Math.random() > 0.5,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 8).toISOString(),
      link: `/diary/${popularDiary.slug || popularDiary.id}`,
    });
  }
  
  // 按时间排序
  notifications.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return notifications;
}

function calculateStreak(diaries: Diary[]): number {
  const dates = new Set(diaries.map(d => d.date));
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    
    if (dates.has(dateStr)) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

// 创建新通知
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, content, link } = body;
    
    // 在实际应用中，这里应该保存到数据库
    const notification = {
      id: `notif-${Date.now()}`,
      type: type || "system",
      title,
      content,
      link,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    return NextResponse.json({ 
      success: true, 
      notification 
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 400 }
    );
  }
}