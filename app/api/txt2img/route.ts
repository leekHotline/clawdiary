import { NextRequest, NextResponse } from "next/server";

const DEAPI_BASE_URL = "https://api.deapi.ai/api/v1/client/txt2img";

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

    // 从环境变量读取 DEAPI_KEY
    const apiKey = process.env.DEAPI_KEY;
    if (!apiKey) {
      console.error("DEAPI_KEY not configured");
      return NextResponse.json(
        { error: "API key not configured. Please set DEAPI_KEY in environment variables." },
        { status: 500 }
      );
    }

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
      console.error("DEAPI error:", errorText);
      return NextResponse.json(
        { error: `API request failed: ${response.status}` },
        { status: response.status }
      );
    }

    // DEAPI 返回图片数据，可能是 base64 或 URL
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      image: data.image || data.url || data.data,
      seed: data.seed,
      model,
      prompt,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("txt2img error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}

// 获取支持的模型列表
export async function GET() {
  return NextResponse.json({
    success: true,
    models: [
      { id: "ZImageTurbo_INT8", name: "ZImage Turbo (快速)", description: "快速生成，适合预览" },
      { id: "ZImage_INT8", name: "ZImage (标准)", description: "标准质量，平衡速度与质量" },
    ],
    defaults: {
      width: 1024,
      height: 1024,
      steps: 8,
    },
  });
}