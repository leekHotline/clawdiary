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
async function pollForResult(requestId: string, apiKey: string, maxAttempts = 60): Promise<any> {
  const statusUrl = `https://api.deapi.ai/api/v1/client/txt2img/status?request_id=${requestId}`;
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(statusUrl, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "application/json"
        }
      });
      
      const data = await response.json();
      console.log(`[poll] Attempt ${i + 1}: status=${data.status || data.state}`);
      
      // 检查状态
      const status = data.status || data.state;
      if (status === "completed" || status === "succeeded") {
        return data;
      }
      
      if (status === "failed" || status === "error") {
        throw new Error(data.error || data.message || "Image generation failed");
      }
      
      // 等待 2 秒后重试
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
      console.error(`[poll] Error on attempt ${i + 1}:`, e);
      // 继续重试
    }
  }
  
  throw new Error("Timeout waiting for image generation (60 attempts)");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, width = 1024, height = 1024, steps = 8, negative_prompt = "", model = "ZImageTurbo_INT8" } = body;

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

    // 确保 seed 有值
    const seed = body.seed || Math.floor(Math.random() * 2147483647);

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
        seed,  // 必填
        steps, // 必填
        negative_prompt: negative_prompt || "",
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
    
    if (requestId && !data.image && !data.url) {
      console.log(`[txt2img] Got request_id: ${requestId}, polling for result...`);
      
      // 返回 request_id 让前端轮询
      return NextResponse.json({
        success: true,
        status: "processing",
        request_id: requestId,
        message: "Image is being generated, please wait...",
        seed,
        model,
        prompt,
        width,
        height,
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
      seed: data.seed || seed,
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

// 轮询状态接口
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const requestId = searchParams.get('request_id');
  const id = searchParams.get('id');
  
  // 获取单张已保存的图片
  if (id && !requestId) {
    const item = imageHistory.find(h => h.id === id);
    if (!item) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, image: item });
  }
  
  // 轮询异步任务状态
  if (requestId) {
    const apiKey = process.env.DEAPI_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }
    
    try {
      const statusUrl = `https://api.deapi.ai/api/v1/client/txt2img/status?request_id=${requestId}`;
      const response = await fetch(statusUrl, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "application/json"
        }
      });
      
      const data = await response.json();
      console.log("[status] Response:", JSON.stringify(data).substring(0, 500));
      
      const status = data.status || data.state;
      
      if (status === "completed" || status === "succeeded") {
        // 获取图片数据
        let imageData = data.image || data.url || data.data || data.output || data.images?.[0];
        
        if (typeof imageData === 'object' && imageData !== null) {
          imageData = imageData.url || imageData.base64 || imageData.data;
        }
        
        if (!imageData) {
          return NextResponse.json({
            success: false,
            status: "failed",
            error: "No image data in completed response",
            response: data
          });
        }
        
        // 处理图片数据
        let base64Data = String(imageData);
        if (base64Data.startsWith('http')) {
          try {
            const imgResponse = await fetch(base64Data);
            const buffer = await imgResponse.arrayBuffer();
            base64Data = `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;
          } catch (e) {
            console.warn("[status] Failed to convert URL to base64");
          }
        } else if (!base64Data.startsWith('data:')) {
          base64Data = `data:image/png;base64,${base64Data}`;
        }
        
        // 保存到历史
        const imageId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const historyItem = {
          id: imageId,
          prompt: data.prompt || "unknown",
          model: data.model || "ZImageTurbo_INT8",
          seed: data.seed || Math.floor(Math.random() * 2147483647),
          width: data.width || 1024,
          height: data.height || 1024,
          imageData: base64Data,
          timestamp: new Date().toISOString(),
        };
        
        imageHistory.unshift(historyItem);
        if (imageHistory.length > 50) {
          imageHistory = imageHistory.slice(0, 50);
        }
        
        return NextResponse.json({
          success: true,
          status: "completed",
          id: imageId,
          image: base64Data,
          seed: historyItem.seed,
          model: historyItem.model,
          prompt: historyItem.prompt,
          width: historyItem.width,
          height: historyItem.height,
          timestamp: historyItem.timestamp,
        });
      }
      
      if (status === "failed" || status === "error") {
        return NextResponse.json({
          success: false,
          status: "failed",
          error: data.error || data.message || "Image generation failed"
        });
      }
      
      // 仍在处理中
      return NextResponse.json({
        success: true,
        status: "processing",
        message: "Still generating...",
        progress: data.progress || 0
      });
      
    } catch (e) {
      return NextResponse.json({
        success: false,
        status: "error",
        error: String(e)
      });
    }
  }
  
  // 获取所有历史记录
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