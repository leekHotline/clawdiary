import { NextRequest, NextResponse } from "next/server";

// 模拟版本历史数据存储
const versionStore: Map<string, any[]> = new Map();

// 获取日记的所有版本历史
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const versions = versionStore.get(id) || [];
    
    // 如果没有版本历史，返回模拟数据
    if (versions.length === 0) {
      const mockVersions = [
        {
          id: `${id}-v1`,
          diaryId: id,
          version: 1,
          title: "初始版本",
          content: "这是日记的初始内容...",
          mood: "happy",
          tags: ["日常", "生活"],
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          changeSummary: "创建日记",
          wordCount: 150,
        },
        {
          id: `${id}-v2`,
          diaryId: id,
          version: 2,
          title: "更新后的标题",
          content: "这是更新后的内容，增加了更多细节...",
          mood: "excited",
          tags: ["日常", "生活", "心情"],
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          changeSummary: "修改标题，添加心情标签，扩充内容",
          wordCount: 280,
        },
        {
          id: `${id}-v3`,
          diaryId: id,
          version: 3,
          title: "最终版本",
          content: "最终完善的内容，包含完整的思考记录...",
          mood: "peaceful",
          tags: ["日常", "生活", "心情", "反思"],
          createdAt: new Date().toISOString(),
          changeSummary: "最终编辑，添加反思标签",
          wordCount: 350,
        },
      ];
      return NextResponse.json({
        diaryId: id,
        versions: mockVersions,
        total: mockVersions.length,
        latestVersion: 3,
      });
    }
    
    return NextResponse.json({
      diaryId: id,
      versions,
      total: versions.length,
      latestVersion: versions.length,
    });
  } catch (error) {
    console.error("获取版本历史失败:", error);
    return NextResponse.json(
      { error: "获取版本历史失败" },
      { status: 500 }
    );
  }
}

// 创建新版本
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { title, content, mood, tags, changeSummary } = body;
    
    const versions = versionStore.get(id) || [];
    const newVersion = versions.length + 1;
    
    const newVersionData = {
      id: `${id}-v${newVersion}`,
      diaryId: id,
      version: newVersion,
      title: title || "",
      content: content || "",
      mood: mood || "neutral",
      tags: tags || [],
      createdAt: new Date().toISOString(),
      changeSummary: changeSummary || "自动保存",
      wordCount: content ? content.length : 0,
    };
    
    versions.push(newVersionData);
    versionStore.set(id, versions);
    
    return NextResponse.json({
      success: true,
      version: newVersionData,
      message: "版本已保存",
    });
  } catch (error) {
    console.error("创建版本失败:", error);
    return NextResponse.json(
      { error: "创建版本失败" },
      { status: 500 }
    );
  }
}