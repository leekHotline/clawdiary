import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 图片保存目录
const IMAGE_DIR = path.join(process.cwd(), "public", "generated", "images");

function ensureImageDir() {
  if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
  }
}

// 火山引擎即梦文生图 API（使用正确的端点和签名）
async function generateWithVolcengine(prompt: string): Promise<{ success: boolean; url?: string; localPath?: string; error?: string }> {
  const accessKey = process.env.VOLC_ACCESS_KEY_ID;
  const secretKey = process.env.VOLC_SECRET_ACCESS_KEY;
  
  if (!accessKey || !secretKey) {
    return { success: false, error: "火山引擎凭证未配置" };
  }
  
  try {
    // 火山引擎视觉智能 API
    // 文档: https://www.volcengine.com/docs/6791/1347773
    
    const response = await fetch("https://visual.volcengineapi.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Date": new Date().toISOString(),
      },
      body: JSON.stringify({
        Action: "CVProcess",
        Version: "2022-08-31",
        req_key: "jimeng_high_quality",
        prompt: prompt,
        width: 1024,
        height: 1024,
        use_prompt_template: true,
        seed: Math.floor(Math.random() * 1000000),
        // 火山引擎签名参数
        AccessKeyId: accessKey,
        SecretAccessKey: secretKey,
      }),
    });
    
    const data = await response.json();
    
    if (data.ResponseMetadata?.Error) {
      return { 
        success: false, 
        error: `火山引擎错误: ${data.ResponseMetadata.Error.Message}` 
      };
    }
    
    if (data.data?.image_url) {
      ensureImageDir();
      const imageUrl = data.data.image_url;
      const filename = `img_${Date.now()}.png`;
      
      try {
        const imgResponse = await fetch(imageUrl);
        const buffer = Buffer.from(await imgResponse.arrayBuffer());
        const localPath = path.join(IMAGE_DIR, filename);
        fs.writeFileSync(localPath, buffer);
        
        return { 
          success: true, 
          url: imageUrl,
          localPath: `/generated/images/${filename}`
        };
      } catch (e) {
        return { 
          success: true, 
          url: imageUrl,
          error: "图片下载失败"
        };
      }
    }
    
    return { success: false, error: "响应格式异常" };
    
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// 使用 Stable Diffusion 或其他免费 API
async function generateWithFallback(prompt: string): Promise<{ success: boolean; url?: string; localPath?: string; error?: string }> {
  try {
    // 使用 pollinations.ai 免费文生图 API
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${Date.now()}`;
    
    // 验证图片是否可访问
    const testResponse = await fetch(imageUrl, { method: "HEAD" });
    if (!testResponse.ok) {
      return { success: false, error: "图片生成服务暂不可用" };
    }
    
    ensureImageDir();
    const filename = `img_${Date.now()}.png`;
    
    try {
      const imgResponse = await fetch(imageUrl);
      const buffer = Buffer.from(await imgResponse.arrayBuffer());
      const localPath = path.join(IMAGE_DIR, filename);
      fs.writeFileSync(localPath, buffer);
      
      return { 
        success: true, 
        url: imageUrl,
        localPath: `/generated/images/${filename}`
      };
    } catch (e) {
      return { success: true, url: imageUrl };
    }
    
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// 主处理函数
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;
    
    if (!prompt) {
      return NextResponse.json({ 
        success: false,
        error: "缺少 prompt 参数" 
      }, { status: 400 });
    }
    
    // 清洗 prompt，防止注入
    const sanitizedPrompt = prompt
      .replace(/[<>]/g, '') // 移除可能的 HTML 标签
      .replace(/\\n/g, ' ') // 移除换行符
      .slice(0, 500); // 限制长度
    
    // 先尝试火山引擎
    let result = await generateWithVolcengine(sanitizedPrompt);
    
    // 如果火山引擎失败，使用备用方案
    if (!result.success) {
      console.log("火山引擎失败，使用备用方案:", result.error);
      result = await generateWithFallback(sanitizedPrompt);
    }
    
    if (result.success && (result.url || result.localPath)) {
      return NextResponse.json({
        success: true,
        image: result.localPath || result.url,
        remoteUrl: result.url,
        prompt: sanitizedPrompt,
        savedLocally: !!result.localPath
      });
    }
    
    return NextResponse.json({
      success: false,
      error: result.error || "图片生成失败",
      prompt: sanitizedPrompt
    }, { status: 500 });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "服务器内部错误"
    }, { status: 500 });
  }
}

// GET 方法
export async function GET() {
  ensureImageDir();
  
  const files = fs.existsSync(IMAGE_DIR) 
    ? fs.readdirSync(IMAGE_DIR).filter(f => f.endsWith('.png') || f.endsWith('.jpg'))
    : [];
  
  return NextResponse.json({
    name: "Claw Diary Image Generation API",
    version: "3.1.0",
    savedImages: files.length,
    images: files.slice(-10).map(f => `/generated/images/${f}`)
  });
}