import { NextRequest, NextResponse } from "next/server";

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
    const { prompt, width = 1024, height = 1024, seed, steps = 8, negative_prompt = "", model = "SDXL" } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    console.log(`[txt2img] Generating: "${prompt.substring(0, 50)}..."`);

    const generatedSeed = seed || Math.floor(Math.random() * 2147483647);
    const imageId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // 尝试 Hugging Face API
    let imageData: string | null = null;
    
    try {
      const hfResponse = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inputs: prompt,
            parameters: { width, height, seed: generatedSeed },
          }),
        }
      );

      if (hfResponse.ok) {
        const buffer = await hfResponse.arrayBuffer();
        imageData = `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;
        console.log("[txt2img] Hugging Face success");
      }
    } catch (e) {
      console.log("[txt2img] Hugging Face failed:", e);
    }

    // 如果 Hugging Face 失败，使用占位图
    if (!imageData) {
      console.log("[txt2img] Using placeholder image");
      
      // 使用 Picsum Photos 作为占位图
      const placeholderUrl = `https://picsum.photos/${width}/${height}?random=${generatedSeed}`;
      
      try {
        const imgResponse = await fetch(placeholderUrl);
        const buffer = await imgResponse.arrayBuffer();
        imageData = `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`;
      } catch {
        // 最后的 fallback：纯色图片
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
          <rect fill="#1a1a2e" width="100%" height="100%"/>
          <text x="50%" y="45%" fill="#ff6b6b" font-size="48" text-anchor="middle">🦞</text>
          <text x="50%" y="55%" fill="#ffffff" font-size="14" text-anchor="middle">Space Lobster</text>
        </svg>`;
        imageData = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
      }
    }

    const historyItem = {
      id: imageId,
      prompt,
      model: imageData.startsWith('data:image/jpeg') ? "Placeholder" : "SDXL",
      seed: generatedSeed,
      width,
      height,
      imageData,
      timestamp: new Date().toISOString(),
    };

    imageHistory.unshift(historyItem);
    if (imageHistory.length > 50) {
      imageHistory = imageHistory.slice(0, 50);
    }

    return NextResponse.json({
      success: true,
      id: imageId,
      image: imageData,
      seed: generatedSeed,
      model: historyItem.model,
      prompt,
      width,
      height,
      timestamp: historyItem.timestamp,
      note: imageData.startsWith('data:image/jpeg') ? 
        "⚠️ AI 图片生成暂不可用，显示随机图片。请配置付费 API (Replicate/Stability AI) 以使用真实 AI 生成。" : 
        undefined,
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