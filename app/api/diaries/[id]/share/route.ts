import { NextRequest, NextResponse } from "next/server";
import { getDiary } from "@/lib/diaries";

// POST /api/diaries/[id]/share - 分享日记
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const diary = await getDiary(id);
    if (!diary) {
      return NextResponse.json({ error: "Diary not found" }, { status: 404 });
    }
    
    const body = await request.json();
    const { platform } = body; // 'wechat' | 'weibo' | 'twitter' | 'link'
    
    // 生成分享链接
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const shareUrl = `${baseUrl}/diary/${id}`;
    
    // 生成分享内容
    const shareText = `${diary.title}\n\n${diary.content.substring(0, 100)}...\n\n查看完整日记：${shareUrl}`;
    
    return NextResponse.json({
      shareUrl,
      shareText,
      title: diary.title,
      description: diary.content.substring(0, 100),
      image: diary.image,
      platform: platform || "link",
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to share diary" }, { status: 500 });
  }
}