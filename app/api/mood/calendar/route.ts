import { NextRequest, NextResponse } from "next/server";

// 心情日历数据接口
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());
  const month = parseInt(searchParams.get("month") || (new Date().getMonth() + 1).toString());

  // 生成模拟心情数据
  const moods: Record<string, { date: string; mood: number; emoji: string; note?: string }> = {};
  
  const daysInMonth = new Date(year, month, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    // 随机生成心情数据（约70%的概率有数据）
    if (Math.random() > 0.3) {
      const mood = Math.floor(Math.random() * 5) + 1;
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const emojis: Record<number, string> = { 1: "😢", 2: "😕", 3: "😐", 4: "😊", 5: "😄" };
      
      moods[dateStr] = {
        date: dateStr,
        mood,
        emoji: emojis[mood],
        note: Math.random() > 0.5 ? getRandomNote(mood) : undefined,
      };
    }
  }

  return NextResponse.json({
    year,
    month,
    moods,
    stats: {
      totalDays: daysInMonth,
      recordedDays: Object.keys(moods).length,
      avgMood: Object.values(moods).reduce((sum, m) => sum + m.mood, 0) / Object.keys(moods).length || 0,
    },
  });
}

function getRandomNote(mood: number): string {
  const notes: Record<number, string[]> = {
    1: ["今天有点难过", "不太顺利的一天", "心情低落"],
    2: ["有点累", "一般般吧", "希望能更好"],
    3: ["平常的一天", "没什么特别的", "还好"],
    4: ["今天还不错", "开心的一天", "有些小确幸"],
    5: ["超级开心！", "完美的一天！", "太棒了！"],
  };
  return notes[mood][Math.floor(Math.random() * notes[mood].length)];
}