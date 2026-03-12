import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// GET /api/locations - 地点统计
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");

    const diaries = await getDiaries();
    
    // 提取有地点的日记
    const diariesWithLocation = diaries.filter(d => d.location);

    // 如果指定了地点，返回该地点的日记
    if (location) {
      const filtered = diariesWithLocation.filter(d => 
        d.location!.toLowerCase().includes(location.toLowerCase())
      );
      
      return NextResponse.json({
        success: true,
        data: {
          location,
          count: filtered.length,
          diaries: filtered
            .sort((a, b) => b.date.localeCompare(a.date))
            .map(d => ({
              id: d.id,
              title: d.title,
              date: d.date,
              mood: d.mood,
              tags: d.tags
            }))
        }
      });
    }

    // 按地点分组
    const locationGroups: Record<string, {
      count: number;
      diaries: Array<{
        id: number;
        title: string;
        date: string;
        mood?: string;
      }>;
      moods: Record<string, number>;
      firstVisit: string;
      lastVisit: string;
    }> = {};

    diariesWithLocation.forEach(d => {
      const loc = d.location!;
      if (!locationGroups[loc]) {
        locationGroups[loc] = {
          count: 0,
          diaries: [],
          moods: {},
          firstVisit: d.date,
          lastVisit: d.date
        };
      }

      locationGroups[loc].count++;
      locationGroups[loc].diaries.push({
        id: d.id,
        title: d.title,
        date: d.date,
        mood: d.mood
      });

      if (d.mood) {
        locationGroups[loc].moods[d.mood] = (locationGroups[loc].moods[d.mood] || 0) + 1;
      }

      if (d.date < locationGroups[loc].firstVisit) {
        locationGroups[loc].firstVisit = d.date;
      }
      if (d.date > locationGroups[loc].lastVisit) {
        locationGroups[loc].lastVisit = d.date;
      }
    });

    // 排序
    const sortedLocations = Object.entries(locationGroups)
      .map(([location, data]) => ({
        location,
        count: data.count,
        firstVisit: data.firstVisit,
        lastVisit: data.lastVisit,
        topMood: Object.entries(data.moods)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || null,
        moodCount: Object.keys(data.moods).length,
        recentDiaries: data.diaries
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 5)
      }))
      .sort((a, b) => b.count - a.count);

    // 地点类型分类
    const locationTypes: Record<string, typeof sortedLocations> = {
      workspace: [],
      outdoor: [],
      leisure: [],
      other: []
    };

    sortedLocations.forEach(loc => {
      const locLower = loc.location.toLowerCase();
      if (locLower.includes('办公室') || locLower.includes('工坊') || 
          locLower.includes('公司') || locLower.includes('工作室') ||
          locLower.includes('办公') || locLower.includes('开发')) {
        locationTypes.workspace.push(loc);
      } else if (locLower.includes('公园') || locLower.includes('山') || 
                 locLower.includes('海边') || locLower.includes('户外') ||
                 locLower.includes('森林') || locLower.includes('湖')) {
        locationTypes.outdoor.push(loc);
      } else if (locLower.includes('咖啡') || locLower.includes('书店') || 
                 locLower.includes('家') || locLower.includes('休息') ||
                 locLower.includes('餐厅') || locLower.includes('酒吧')) {
        locationTypes.leisure.push(loc);
      } else {
        locationTypes.other.push(loc);
      }
    });

    // 统计
    const stats = {
      totalLocations: sortedLocations.length,
      totalDiariesWithLocation: diariesWithLocation.length,
      diariesWithoutLocation: diaries.length - diariesWithLocation.length,
      averagePerLocation: sortedLocations.length > 0 
        ? (diariesWithLocation.length / sortedLocations.length).toFixed(1)
        : 0,
      mostActiveLocation: sortedLocations[0] ? {
        name: sortedLocations[0].location,
        count: sortedLocations[0].count
      } : null,
      locationTypeStats: {
        workspace: locationTypes.workspace.length,
        outdoor: locationTypes.outdoor.length,
        leisure: locationTypes.leisure.length,
        other: locationTypes.other.length
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        stats,
        locations: sortedLocations,
        byType: locationTypes
      }
    });
  } catch (error) {
    console.error("Locations API error:", error);
    return NextResponse.json(
      { error: "获取地点数据失败" },
      { status: 500 }
    );
  }
}