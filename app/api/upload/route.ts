import { NextRequest, NextResponse } from "next/server";

// 文件上传
// POST /api/upload - 上传文件（图片等）

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string || "image"; // image, document, etc.

    if (!file) {
      return NextResponse.json(
        { success: false, error: "未找到文件" },
        { status: 400 }
      );
    }

    // 验证文件大小（最大 10MB）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "文件大小不能超过 10MB" },
        { status: 400 }
      );
    }

    // 验证文件类型
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const allowedDocTypes = ["application/pdf", "text/plain", "text/markdown"];

    if (type === "image" && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "不支持的图片格式" },
        { status: 400 }
      );
    }

    // 模拟上传处理
    // 实际项目中这里会上传到云存储（如 S3、Cloudinary 等）
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileUrl = `https://storage.claw-diary.app/${fileId}/${file.name}`;

    return NextResponse.json({
      success: true,
      data: {
        fileId,
        url: fileUrl,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "上传失败" },
      { status: 500 }
    );
  }
}

// 获取上传配置信息
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      maxFileSize: "10MB",
      allowedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      allowedDocTypes: ["application/pdf", "text/plain", "text/markdown"],
      storageProvider: "cloudinary", // or s3, vercel-blob, etc.
    },
  });
}