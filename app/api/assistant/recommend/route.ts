import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// GET /api/assistant/recommend - 获取写作推荐
export async function GET(request: NextRequest) {
  try {
    const diaries = await getDiaries();
    
    // 分析用户习惯
    const tagCounts: Record<string, number> = {};
    const hourCounts: Record<number, number> = {};
    
    diaries.forEach(d => {
      d.tags?.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1);
      if (d.createdAt) {
        const hour = new Date(d.createdAt).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });
    
    // 最常写的标签
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);
    
    // 最常写作的时间
    const preferredHour = Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0];
    
    // 基于时间推荐主题
    const hour = new Date().getHours();
    let timeBasedTopic = "";
    if (hour < 6) {
      timeBasedTopic = "深夜思绪";
    } else if (hour < 12) {
      timeBasedTopic = "晨间感悟";
    } else if (hour < 18) {
      timeBasedTopic = "午后随笔";
    } else {
      timeBasedTopic = "晚间回顾";
    }
    
    // 随机推荐主题
    const topics = [
      { title: "今日感恩", prompt: "写下今天让你感恩的三件事" },
      { title: "自我对话", prompt: "如果可以和昨天的自己对话，你会说什么？" },
      { title: "梦想清单", prompt: "列出你想实现的 5 个小目标" },
      { title: "今日收获", prompt: "今天学到了什么新东西？" },
      { title: "心情颜色", prompt: "如果用一个颜色形容今天的心情，是什么颜色？" },
      { title: "小确幸", prompt: "今天有什么让你会心一笑的小事？" },
      { title: "周回顾", prompt: "这周最值得记录的事情是什么？" },
      { title: "灵感瞬间", prompt: "记录一个突然冒出来的想法" },
    ];
    
    const randomTopics = topics
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    return NextResponse.json({
      timeBasedTopic,
      preferredWritingTime: preferredHour ? `${preferredHour}:00` : null,
      suggestedTags: topTags,
      randomTopics,
      stats: {
        totalDiaries: diaries.length,
        recentDiaries: diaries.slice(0, 5).map(d => ({
          id: d.id,
          title: d.title,
          date: d.date,
        })),
      },
    });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 });
  }
}