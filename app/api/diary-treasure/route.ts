import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// 宝藏类型定义
type TreasureType = "quote" | "moment" | "growth" | "person" | "place" | "insight";

interface Treasure {
  id: string;
  type: TreasureType;
  title: string;
  content: string;
  sourceDate: string;
  sourceTitle: string;
  sourceId: string;
  emoji: string;
}

// 模拟 AI 提取宝藏的逻辑
function extractTreasuresFromDiary(diary: {
  id: string | number;
  date: string;
  title: string;
  content: string;
  tags?: string[];
}): Treasure[] {
  const treasures: Treasure[] = [];
  const content = diary.content || "";
  
  // 提取金句（寻找引号或感叹号结尾的句子）
  const quotePatterns = [
    /"([^"]+)"/g,
    /"([^"]+)"/g,
    /「([^」]+)」/g,
  ];
  
  for (const pattern of quotePatterns) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].length > 10) {
        treasures.push({
          id: `${diary.id}-quote-${Date.now()}`,
          type: "quote",
          title: "金句发现",
          content: match[1],
          sourceDate: diary.date,
          sourceTitle: diary.title,
          sourceId: String(diary.id),
          emoji: "💎",
        });
      }
    }
  }

  // 提取成长瞬间（关键词检测）
  const growthKeywords = ["学会", "成长", "进步", "突破", "终于", "第一次", "成功", "理解"];
  for (const keyword of growthKeywords) {
    if (content.includes(keyword)) {
      // 找到包含关键词的句子
      const sentences = content.split(/[。！？\n]/);
      const growthSentence = sentences.find((s) => s.includes(keyword));
      if (growthSentence && growthSentence.length > 10) {
        treasures.push({
          id: `${diary.id}-growth-${Date.now()}`,
          type: "growth",
          title: `成长瞬间：${keyword}`,
          content: growthSentence.trim().substring(0, 100),
          sourceDate: diary.date,
          sourceTitle: diary.title,
          sourceId: String(diary.id),
          emoji: "🌱",
        });
        break; // 每篇日记只提取一个成长瞬间
      }
    }
  }

  // 提取顿悟（关键词检测）
  const insightKeywords = ["意识到", "发现", "明白", "懂得", "突然", "原来", "领悟"];
  for (const keyword of insightKeywords) {
    if (content.includes(keyword)) {
      const sentences = content.split(/[。！？\n]/);
      const insightSentence = sentences.find((s) => s.includes(keyword));
      if (insightSentence && insightSentence.length > 10) {
        treasures.push({
          id: `${diary.id}-insight-${Date.now()}`,
          type: "insight",
          title: "顿悟时刻",
          content: insightSentence.trim().substring(0, 100),
          sourceDate: diary.date,
          sourceTitle: diary.title,
          sourceId: String(diary.id),
          emoji: "💡",
        });
        break;
      }
    }
  }

  // 提取重要时刻（日期关键词）
  const momentKeywords = ["启动", "发布", "上线", "开始", "完成", "达成", "庆祝", "纪念"];
  for (const keyword of momentKeywords) {
    if (content.includes(keyword)) {
      treasures.push({
        id: `${diary.id}-moment-${Date.now()}`,
        type: "moment",
        title: `重要时刻：${keyword}`,
        content: `在 ${diary.date}，${keyword}了一件重要的事`,
        sourceDate: diary.date,
        sourceTitle: diary.title,
        sourceId: String(diary.id),
        emoji: "✨",
      });
      break;
    }
  }

  return treasures;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "20");

    // 获取日记数据
    const diaries = await getDiaries();
    
    // 从每篇日记中提取宝藏
    let allTreasures: Treasure[] = [];
    
    for (const diary of diaries) {
      const treasures = extractTreasuresFromDiary(diary);
      allTreasures = allTreasures.concat(treasures);
    }

    // 按类型筛选
    if (type && type !== "all") {
      allTreasures = allTreasures.filter((t) => t.type === type);
    }

    // 按日期排序并限制数量
    allTreasures.sort((a, b) => 
      new Date(b.sourceDate).getTime() - new Date(a.sourceDate).getTime()
    );
    allTreasures = allTreasures.slice(0, limit);

    // 统计各类型数量
    const counts = {
      quote: allTreasures.filter((t) => t.type === "quote").length,
      moment: allTreasures.filter((t) => t.type === "moment").length,
      growth: allTreasures.filter((t) => t.type === "growth").length,
      person: allTreasures.filter((t) => t.type === "person").length,
      place: allTreasures.filter((t) => t.type === "place").length,
      insight: allTreasures.filter((t) => t.type === "insight").length,
    };

    return NextResponse.json({
      success: true,
      treasures: allTreasures,
      counts,
      total: allTreasures.length,
    });
  } catch (error) {
    console.error("Error extracting treasures:", error);
    return NextResponse.json(
      { success: false, error: "Failed to extract treasures" },
      { status: 500 }
    );
  }
}

// 挖掘新宝藏（随机发现）
export async function POST(request: NextRequest) {
  try {
    const diaries = await getDiaries();
    
    if (diaries.length === 0) {
      return NextResponse.json({
        success: false,
        error: "没有日记可以挖掘",
      });
    }

    // 随机选择一篇日记
    const randomDiary = diaries[Math.floor(Math.random() * diaries.length)];
    
    // 提取宝藏
    const treasures = extractTreasuresFromDiary(randomDiary);
    
    if (treasures.length === 0) {
      // 如果没有提取到，生成一个默认的
      const defaultTreasure: Treasure = {
        id: `dig-${Date.now()}`,
        type: "insight",
        title: "隐藏的智慧",
        content: `每一次回顾日记，都是与过去的自己重新对话的机会。那些被遗忘的细节，往往藏着最珍贵的智慧。`,
        sourceDate: randomDiary.date,
        sourceTitle: randomDiary.title,
        sourceId: String(randomDiary.id),
        emoji: "💡",
      };
      treasures.push(defaultTreasure);
    }

    // 随机返回一个
    const randomTreasure = treasures[Math.floor(Math.random() * treasures.length)];

    return NextResponse.json({
      success: true,
      treasure: randomTreasure,
    });
  } catch (error) {
    console.error("Error digging treasure:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dig treasure" },
      { status: 500 }
    );
  }
}