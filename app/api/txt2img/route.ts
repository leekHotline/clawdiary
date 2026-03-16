import { NextRequest, NextResponse } from "next/server";

// MiniMax 图片生成 API
const MINIMAX_API_URL = "https://api.minimaxi.com/v1/image_generation";

// 内存存储历史记录
let imageHistory: Array<{
  id: string;
  prompt: string;
  model: string;
  seed: number;
  width: number;
  height: number;
  imageData: string;
  timestamp: string;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, width = 1024, height = 1024, seed, model = "image-01" } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.MINIMAX_APIKEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "MINIMAX_APIKEY not configured. Please add it to Vercel environment variables." },
        { status: 500 }
      );
    }

    console.log(`[txt2img] Generating with MiniMax: "${prompt.substring(0, 50)}..."`);

    // 计算 aspect_ratio
    let aspectRatio = "1:1";
    if (width > height) {
      aspectRatio = "16:9";
    } else if (height > width) {
      aspectRatio = "9:16";
    }

    const response = await fetch(MINIMAX_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "image-01",
        prompt,
        aspect_ratio: aspectRatio,
        response_format: "base64",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[txt2img] MiniMax API error:", errorText);
      return NextResponse.json(
        { error: `MiniMax API failed: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("[txt2img] MiniMax response ID:", data.id);

    // 获取 base64 图片
    const imageBase64 = data.data?.image_base64?.[0];
    if (!imageBase64) {
      return NextResponse.json(
        { error: "No image data in MiniMax response", response: data },
        { status: 500 }
      );
    }

    // 构造 data URL
    const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`;

    const imageId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const generatedSeed = seed || Math.floor(Math.random() * 2147483647);

    const historyItem = {
      id: imageId,
      prompt,
      model: "MiniMax image-01",
      seed: generatedSeed,
      width,
      height,
      imageData: imageDataUrl,
      timestamp: new Date().toISOString(),
    };

    // 保存到历史
    imageHistory.unshift(historyItem);
    if (imageHistory.length > 50) {
      imageHistory = imageHistory.slice(0, 50);
    }

    console.log(`[txt2img] Generated: ${imageId}, size: ${imageBase64.length} bytes`);

    return NextResponse.json({
      success: true,
      id: imageId,
      image: imageDataUrl,
      seed: generatedSeed,
      model: "MiniMax image-01",
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

// GET: 获取历史记录或单张图片
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (id) {
    const item = imageHistory.find(h => h.id === id);
    if (!item) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, image: item });
  }
  
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
    })),
  });
}