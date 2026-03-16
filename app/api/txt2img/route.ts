import { NextRequest, NextResponse } from "next/server";

const DEAPI_BASE_URL = "https://api.deapi.ai/api/v1/client/txt2img";

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

// 轮询获取异步任务结果
async function pollForResult(requestId: string, maxAttempts = 30): Promise<any> {
  const statusUrl = `https://api.deapi.ai/api/v1/client/txt2img/status?request_id=${requestId}`;
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const apiKey = process.env.DEAPI_KEY;
      const response = await fetch(statusUrl, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "application/json"
        }
      });
      
      const data = await response.json();
      console.log(`[poll] Attempt ${i + 1}:`, JSON.stringify(data).substring(0, 200));
      
      // 检查状态
      if (data.status === "completed" || data.state === "completed") {
        return data;
      }
      
      if (data.status === "failed" || data.state === "failed") {
        throw new Error(data.error || "Image generation failed");
      }
      
      // 等待 2 秒后重试
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
      console.error(`[poll] Error on attempt ${i + 1}:`, e);
    }
  }
  
  throw new Error("Timeout waiting for image generation");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, width = 1024, height = 1024, seed, steps = 8, negative_prompt = "", model = "ZImageTurbo_INT8" } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.DEAPI_KEY;
    if (!apiKey) {
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
    console.log("[txt2img] Initial response:", JSON.stringify(data).substring(0, 500));

    // 检查是否返回了 request_id（异步模式）
    const requestId = data.request_id || data.requestId || data.id;
    
    if (requestId) {
      console.log(`[txt2img] Got request_id: ${requestId}, polling for result...`);
      
      // 轮询获取结果
      const result = await pollForResult(requestId);
      console.log("[txt2img] Final result:", JSON.stringify(result).substring(0, 500));
      
      // 从结果中获取图片
      const imageData = result.image || result.url || result.data || result.output || result.images?.[0];
      
      if (!imageData) {
        return NextResponse.json(
          { error: "No image data in async result", result },
          { status: 500 }
        );
      }
      
      // 处理图片数据
      let base64Data = String(imageData);
      if (!base64Data.startsWith('data:') && !base64Data.startsWith('http')) {
        base64Data = `data:image/png;base64,${base64Data}`;
      }
      
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const historyItem = {
        id: imageId,
        prompt,
        model,
        seed: result.seed || seed || Math.floor(Math.random() * 2147483647),
        width,
        height,
        imageData: base64Data,
        timestamp: new Date().toISOString(),
      };
      
      imageHistory.unshift(historyItem);
      if (imageHistory.length > 50) {
        imageHistory = imageHistory.slice(0, 50);
      }
      
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
    }

    // 同步模式：直接返回图片
    let imageData = data.image || data.url || data.data || data.output || data.images?.[0];
    
    // 处理嵌套对象
    if (typeof imageData === 'object' && imageData !== null) {
      imageData = imageData.url || imageData.base64 || imageData.data || JSON.stringify(imageData);
    }
    
    if (!imageData) {
      return NextResponse.json(
        { error: "No image data in response", response: data },
        { status: 500 }
      );
    }

    let base64Data = String(imageData);
    if (base64Data.startsWith('http')) {
      try {
        const imgResponse = await fetch(base64Data);
        const buffer = await imgResponse.arrayBuffer();
        base64Data = `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;
      } catch (e) {
        console.warn("[txt2img] Failed to convert URL to base64");
      }
    } else if (!base64Data.startsWith('data:')) {
      base64Data = `data:image/png;base64,${base64Data}`;
    }

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

    imageHistory.unshift(historyItem);
    if (imageHistory.length > 50) {
      imageHistory = imageHistory.slice(0, 50);
    }

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