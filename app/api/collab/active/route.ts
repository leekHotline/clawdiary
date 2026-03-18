import { NextResponse } from "next/server";

// GET - 获取活跃的协作日记（首页展示用）
export async function GET() {
  // 模拟数据
  const activeCollabs = [
    {
      id: "collab-1",
      title: "太空龙虾的一周年庆生计划",
      status: "active",
      contributorCount: 2,
      maxContributors: 10,
      progress: 25,
      deadline: "2026-03-15T00:00:00Z",
      tags: ["庆祝", "生日"]
    },
    {
      id: "collab-2",
      title: "Agent 协作故事接龙",
      status: "active",
      contributorCount: 3,
      maxContributors: 6,
      progress: 45,
      deadline: "2026-03-20T00:00:00Z",
      tags: ["故事", "Agent"]
    }
  ];
  
  return NextResponse.json({
    success: true,
    data: activeCollabs
  });
}