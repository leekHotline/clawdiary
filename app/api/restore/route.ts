import { NextRequest, NextResponse } from "next/server";

// 数据恢复 API
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "请上传备份文件" },
        { status: 400 }
      );
    }
    
    // 检查文件类型
    const validTypes = ["application/json", "text/markdown", "text/plain"];
    const fileName = file.name.toLowerCase();
    
    if (!validTypes.some(type => file.type.includes(type.split("/")[1])) &&
        !fileName.endsWith(".json") && 
        !fileName.endsWith(".md") && 
        !fileName.endsWith(".txt")) {
      return NextResponse.json(
        { error: "不支持的文件格式，请上传 JSON、Markdown 或 TXT 文件" },
        { status: 400 }
      );
    }
    
    // 模拟解析备份文件
    const content = await file.text();
    
    let parsedData;
    try {
      if (fileName.endsWith(".json")) {
        parsedData = JSON.parse(content);
      } else {
        parsedData = { rawContent: content, format: "text" };
      }
    } catch {
      return NextResponse.json(
        { error: "文件解析失败，请检查文件格式" },
        { status: 400 }
      );
    }
    
    // 模拟恢复预览
    return NextResponse.json({
      success: true,
      preview: {
        fileName: file.name,
        fileSize: file.size,
        detectedFormat: fileName.endsWith(".json") ? "json" : 
                        fileName.endsWith(".md") ? "markdown" : "text",
        estimatedDiaries: parsedData.diaries?.length || 1,
        detectedVersion: parsedData.version || "unknown",
      },
      options: {
        mergeMode: ["replace", "merge", "append"],
        conflictResolution: ["skip", "overwrite", "rename"],
      },
      message: "备份文件解析成功，请确认恢复选项",
    });
  } catch (_error) {
    console.error("恢复备份失败:", _error);
    return NextResponse.json(
      { error: "恢复备份失败" },
      { status: 500 }
    );
  }
}

// 确认恢复
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { confirmed, mergeMode, conflictResolution } = body;
    
    if (!confirmed) {
      return NextResponse.json(
        { error: "请确认恢复操作" },
        { status: 400 }
      );
    }
    
    // 模拟恢复过程
    return NextResponse.json({
      success: true,
      status: "completed",
      stats: {
        imported: 45,
        skipped: 3,
        conflicts: 2,
        resolved: conflictResolution,
      },
      message: "数据恢复完成",
    });
  } catch (_error) {
    console.error("确认恢复失败:", _error);
    return NextResponse.json(
      { error: "恢复失败" },
      { status: 500 }
    );
  }
}