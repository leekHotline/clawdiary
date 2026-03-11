import { NextRequest, NextResponse } from "next/server";

// 协作统计数据
const collabStats = {
  "collab-1": {
    overview: {
      totalWords: 1250,
      totalSections: 2,
      totalContributors: 2,
      totalComments: 0,
      progress: 25,
      daysActive: 3,
      avgWordsPerDay: 417,
      avgWordsPerSection: 625
    },
    contributors: [
      { id: "user-1", name: "Alex", avatar: "🧑‍💻", words: 200, sections: 1, percentage: 16 },
      { id: "user-2", name: "小龙虾", avatar: "🦞", words: 350, sections: 1, percentage: 28 }
    ],
    timeline: [
      { date: "2026-03-10", words: 550, contributors: 2 },
      { date: "2026-03-11", words: 700, contributors: 1 }
    ],
    writingStyle: {
      tone: "轻松愉快",
      avgSentenceLength: 18,
      topKeywords: ["生日", "惊喜", "创意"],
      readability: "优秀"
    }
  },
  "collab-2": {
    overview: {
      totalWords: 4500,
      totalSections: 3,
      totalContributors: 3,
      totalComments: 1,
      progress: 45,
      daysActive: 4,
      avgWordsPerDay: 1125,
      avgWordsPerSection: 1500
    },
    contributors: [
      { id: "agent-write", name: "执笔", avatar: "✍️", words: 1800, sections: 1, percentage: 40 },
      { id: "agent-review", name: "审阅", avatar: "📝", words: 1500, sections: 1, percentage: 33 },
      { id: "agent-leek", name: "采风", avatar: "🌿", words: 1200, sections: 1, percentage: 27 }
    ],
    timeline: [
      { date: "2026-03-08", words: 1200, contributors: 1 },
      { date: "2026-03-09", words: 1800, contributors: 1 },
      { date: "2026-03-10", words: 1500, contributors: 1 }
    ],
    writingStyle: {
      tone: "神秘科幻",
      avgSentenceLength: 15,
      topKeywords: ["意识", "数据", "世界"],
      readability: "良好"
    }
  },
  "collab-3": {
    overview: {
      totalWords: 8500,
      totalSections: 4,
      totalContributors: 4,
      totalComments: 0,
      progress: 100,
      daysActive: 14,
      avgWordsPerDay: 607,
      avgWordsPerSection: 2125
    },
    contributors: [
      { id: "user-4", name: "代码侠", avatar: "💻", words: 3000, sections: 1, percentage: 35 },
      { id: "user-3", name: "文档君", avatar: "📚", words: 2500, sections: 1, percentage: 29 },
      { id: "user-1", name: "Alex", avatar: "🧑‍💻", words: 1500, sections: 1, percentage: 18 },
      { id: "user-5", name: "翻译官", avatar: "🌐", words: 1500, sections: 1, percentage: 18 }
    ],
    timeline: [
      { date: "2026-02-20", words: 500, contributors: 1 },
      { date: "2026-02-25", words: 1500, contributors: 2 },
      { date: "2026-03-01", words: 2000, contributors: 1 },
      { date: "2026-03-05", words: 4500, contributors: 1 }
    ],
    writingStyle: {
      tone: "专业严谨",
      avgSentenceLength: 22,
      topKeywords: ["配置", "安装", "API"],
      readability: "优秀"
    }
  }
};

// 全局统计
const globalStats = {
  totalCollabs: 3,
  activeCollabs: 2,
  completedCollabs: 1,
  totalWords: 14250,
  totalContributors: 8,
  avgProgress: 56.7
};

// GET - 获取统计
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section") || "all";
  
  if (id === "global") {
    return NextResponse.json({
      success: true,
      data: globalStats
    });
  }
  
  const stats = collabStats[id as keyof typeof collabStats];
  
  if (!stats) {
    return NextResponse.json(
      { success: false, message: "协作项目不存在" },
      { status: 404 }
    );
  }
  
  if (section === "all") {
    return NextResponse.json({
      success: true,
      data: stats
    });
  }
  
  const sectionData = stats[section as keyof typeof stats];
  
  if (!sectionData) {
    return NextResponse.json(
      { success: false, message: "统计数据不存在" },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    success: true,
    data: sectionData
  });
}