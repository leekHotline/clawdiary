import { NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

interface Diary {
  id: string;
  title: string;
  date: string;
  content: string;
  image?: string;
  tags?: string[];
  author?: string;
  mood?: string;
}

interface OnThisDayResult {
  today: {
    month: number;
    day: number;
    year: number;
  };
  exactMatches: Array<{
    yearsAgo: number;
    year: number;
    diary: Diary;
  }>;
  nearbyMatches: Array<{
    daysDiff: number;
    year: number;
    diary: Diary;
  }>;
  stats: {
    totalYears: number;
    totalMatches: number;
    earliestYear: number | null;
    latestYear: number | null;
  };
}

function getMonthDay(dateStr: string): { month: number; day: number } {
  const parts = dateStr.split("-");
  return {
    month: parseInt(parts[1] || "1"),
    day: parseInt(parts[2] || "1"),
  };
}

function getYear(dateStr: string): number {
  return parseInt(dateStr.split("-")[0] || "2025");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const day = searchParams.get("day");
    const range = parseInt(searchParams.get("range") || "3");

    const diaries = await getDiaries();
    const today = new Date();
    const currentMonth = month ? parseInt(month) : today.getMonth() + 1;
    const currentDay = day ? parseInt(day) : today.getDate();
    const currentYear = today.getFullYear();

    // 精确匹配（同月同日）
    const exactMatches: OnThisDayResult["exactMatches"] = [];
    // 相近匹配（前后 range 天）
    const nearbyMatches: OnThisDayResult["nearbyMatches"] = [];

    diaries.forEach((diary) => {
      const diaryMonthDay = getMonthDay(diary.date);
      const diaryYear = getYear(diary.date);

      // 跳过今年
      if (diaryYear === currentYear) return;

      if (diaryMonthDay.month === currentMonth && diaryMonthDay.day === currentDay) {
        exactMatches.push({
          yearsAgo: currentYear - diaryYear,
          year: diaryYear,
          diary,
        });
      } else if (diaryMonthDay.month === currentMonth) {
        const daysDiff = Math.abs(diaryMonthDay.day - currentDay);
        if (daysDiff <= range && daysDiff > 0) {
          nearbyMatches.push({
            daysDiff,
            year: diaryYear,
            diary,
          });
        }
      }
    });

    // 按年份排序
    exactMatches.sort((a, b) => b.year - a.year);
    nearbyMatches.sort((a, b) => a.daysDiff - b.daysDiff);

    // 统计
    const years = new Set(exactMatches.map((m) => m.year));
    const allYears = [...exactMatches.map((m) => m.year), ...nearbyMatches.map((m) => m.year)];

    const result: OnThisDayResult = {
      today: {
        month: currentMonth,
        day: currentDay,
        year: currentYear,
      },
      exactMatches,
      nearbyMatches: nearbyMatches.slice(0, 10),
      stats: {
        totalYears: years.size,
        totalMatches: exactMatches.length + nearbyMatches.length,
        earliestYear: allYears.length > 0 ? Math.min(...allYears) : null,
        latestYear: allYears.length > 0 ? Math.max(...allYears) : null,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching on-this-day data:", error);
    return NextResponse.json(
      { error: "Failed to fetch on-this-day data" },
      { status: 500 }
    );
  }
}