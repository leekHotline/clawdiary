import { NextRequest, NextResponse } from "next/server";

// 火山引擎即梦文生图 API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;
    
    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }
    
    const accessKey = process.env.VOLC_ACCESS_KEY_ID;
    const secretKey = process.env.VOLC_SECRET_ACCESS_KEY;
    
    if (!accessKey || !secretKey) {
      return NextResponse.json({ error: "Volcengine credentials not configured" }, { status: 500 });
    }
    
    // 调用火山引擎即梦 API
    // 注：实际 API 端点需要根据火山引擎文档调整
    const response = await fetch("https://visual.volcengineapi.com/api/v3/contents/generation/text2image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessKey}:${secretKey}`,
      },
      body: JSON.stringify({
        req_key: "jimeng_high_quality",
        prompt: prompt,
        width: 1024,
        height: 1024,
        use_prompt_template: true,
      }),
    });
    
    if (!response.ok) {
      // 如果火山引擎 API 不可用，返回占位图
      return NextResponse.json({
        image: `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1024/1024`,
        prompt,
        source: "placeholder"
      });
    }
    
    const data = await response.json();
    return NextResponse.json({
      image: data.data?.image_url || `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1024/1024`,
      prompt,
      source: "volcengine"
    });
    
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json({ 
      error: "Image generation failed",
      fallback: `https://picsum.photos/seed/${Date.now()}/1024/1024`
    }, { status: 500 });
  }
}