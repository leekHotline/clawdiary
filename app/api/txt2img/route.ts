import { NextRequest, NextResponse } from "next/server";

// 使用 Hugging Face Inference API（免费）
const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, width = 1024, height = 1024, seed, steps = 8, negative_prompt = "", model = "SDXL" } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    console.log(`[txt2img] Generating: "${prompt.substring(0, 50)}..."`);

    // 使用 Hugging Face SDXL
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width,
          height,
          num_inference_steps: steps,
          guidance_scale: 7.5,
          seed: seed || Math.floor(Math.random() * 2147483647),
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[txt2img] HF API error:", errorText);
      
      // 如果模型正在加载，返回友好的错误信息
      if (errorText.includes("loading")) {
        return NextResponse.json(
          { error: "模型正在加载中，请稍后重试", details: errorText },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: `API request failed: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    // 获取图片二进制数据
    const imageBuffer = await response.arrayBuffer();
    const base64Data = Buffer.from(imageBuffer).toString('base64');
    const imageDataUrl = `data:image/png;base64,${base64Data}`;

    const imageId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const generatedSeed = seed || Math.floor(Math.random() * 2147483647);

    const historyItem = {
      id: imageId,
      prompt,
      model: "SDXL",
      seed: generatedSeed,
      width,
      height,
      imageData: imageDataUrl,
      timestamp: new Date().toISOString(),
    };

    // 保存到内存历史
    imageHistory.unshift(historyItem);
    if (imageHistory.length > 50) {
      imageHistory = imageHistory.slice(0, 50);
    }

    console.log(`[txt2img] Generated: ${imageId}`);

    return NextResponse.json({
      success: true,
      id: imageId,
      image: imageDataUrl,
      seed: generatedSeed,
      model: "SDXL",
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
