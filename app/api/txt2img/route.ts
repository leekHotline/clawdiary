import { NextRequest, NextResponse } from "next/server";

const DEAPI_BASE_URL = "https://api.deapi.ai/api/v1/client/txt2img";

// 内存存储历史记录（serverless 会重置，但短时间内有效）
// 生产环境建议使用 Vercel KV 或 Vercel Blob
let imageHistory: Array<{
  id: string;
  prompt: string;
  model: string;
  seed: number;
  width: number;
  height: number;
  imageData: string; // base64 或 URL
  timestamp: string;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, width = 1024, height = 1024, seed, steps = 8, negative_prompt = "", model = "ZImageTurbo_INT8" } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEAPI_KEY;
    if (!apiKey) {
      console.error("DEAPI_KEY not configured");
      return NextResponse.json(
        { error: "API key not configured. Please set DEAPI_KEY in Vercel environment variables." },
        { status: 500 }
      );
    }

    console.log(`[txt2img] Generating image: "${prompt.substring(0, 50)}..."`);

    const response = await fetch(DEAPI_BASE_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        model,
        width,
        height,
        seed: seed || Math.floor(Math.random() * 2147483647),
        steps,
        negative_prompt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[txt2img] API error:", errorText);
      return NextResponse.json(
        { error: `API request failed: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("[txt2img] API response keys:", Object.keys(data));
    
    // DEAPI 可能返回多种格式
    let imageData = data.image || data.url || data.data || data.output || data.images?.[0];
    
    if (!imageData) {
      console.error("[txt2img] No image data in response:", data);
      return NextResponse.json(
        { error: "No image data returned from API", response: data },
        { status: 500 }
      );
    }

    // 如果返回的是 URL，需要转换为 base64 以便存储
    let base64Data = imageData;
    if (imageData.startsWith('http')) {
      try {
        const imgResponse = await fetch(imageData);
        const buffer = await imgResponse.arrayBuffer();
        base64Data = `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;
      } catch (e) {
        console.warn("[txt2img] Failed to convert URL to base64, using original URL");
        base64Data = imageData;
      }
    } else if (!imageData.startsWith('data:')) {
      // 如果是纯 base64，添加前缀
      base64Data = `data:image/png;base64,${imageData}`;
    }

    // 生成唯一 ID
    const imageId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    const historyItem = {
      id: imageId,
      prompt,
      model,
      seed: data.seed || seed || Math.floor(Math.random() * 2147483647),
      width,
      height,
      imageData: base64Data,
      timestamp: new Date().toISOString(),
    };

    // 添加到历史记录（保留最近 50 张）
    imageHistory.unshift(historyItem);
    if (imageHistory.length > 50) {
      imageHistory = imageHistory.slice(0, 50);
    }

    console.log(`[txt2img] Successfully generated image: ${imageId}`);

    return NextResponse.json({
      success: true,
      id: imageId,
      image: base64Data,
      seed: historyItem.seed,
      model,
      prompt,
      width,
      height,
      timestamp: historyItem.timestamp,
    });
  } catch (error) {
    console.error("[txt2img] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate image", details: String(error) },
      { status: 500 }
    );
  }
}

// 获取历史记录
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (id) {
    // 获取单张图片
    const item = imageHistory.find(h => h.id === id);
    if (!item) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, image: item });
  }
  
  // 获取所有历史记录（不包含图片数据，减少响应大小）
  return NextResponse.json({
    success: true,
    count: imageHistory.length,
    history: imageHistory.map(h => ({
      id: h.id,
      prompt: h.prompt,
      model: h.model,
      seed: h.seed,
      width: h.width,
      height: h.height,
      timestamp: h.timestamp,
      // 缩略图：返回图片数据
      thumbnail: h.imageData.substring(0, 100) + '...',
    })),
  });
}