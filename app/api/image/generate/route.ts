import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// 火山引擎签名工具函数
function hmacSha256(key: string | Buffer, data: string): Buffer {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}

function sha256Hash(data: string): string {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex");
}

// 火山引擎即梦文生图 API
async function generateWithVolcengine(prompt: string): Promise<{ success: boolean; url?: string; error?: string }> {
  const accessKey = process.env.VOLC_ACCESS_KEY_ID;
  const secretKey = process.env.VOLC_SECRET_ACCESS_KEY;
  
  if (!accessKey || !secretKey) {
    return { success: false, error: "火山引擎凭证未配置" };
  }
  
  try {
    // 时间戳
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    
    // API 参数
    const service = "cv";
    const region = "cn-north-1";
    const algorithm = "HMAC-SHA256";
    const host = "visual.volcengineapi.com";
    
    // 请求体
    const requestBody = JSON.stringify({
      req_key: "jimeng_high_quality",
      prompt: prompt,
      width: 1024,
      height: 1024,
      use_prompt_template: true,
      seed: Math.floor(Math.random() * 1000000),
    });
    
    const payloadHash = sha256Hash(requestBody);
    
    // Canonical Headers
    const canonicalHeaders = 
      `content-type:application/json\n` +
      `host:${host}\n` +
      `x-content-sha256:${payloadHash}\n` +
      `x-date:${amzDate}\n`;
    
    const signedHeaders = "content-type;host;x-content-sha256;x-date";
    
    // Canonical Request
    const canonicalRequest = [
      "POST",
      "/",
      "Action=CVProcess&Version=2022-08-31",
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join("\n");
    
    // String to Sign
    const credentialScope = `${dateStr}/${region}/${service}/request`;
    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      sha256Hash(canonicalRequest),
    ].join("\n");
    
    // 计算签名
    const kDate = hmacSha256(secretKey, dateStr);
    const kRegion = hmacSha256(kDate, region);
    const kService = hmacSha256(kRegion, service);
    const kSigning = hmacSha256(kService, "request");
    const signature = hmacSha256(kSigning, stringToSign).toString("hex");
    
    // Authorization Header
    const authorization = 
      `${algorithm} Credential=${accessKey}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, Signature=${signature}`;
    
    // 发送请求
    const response = await fetch(
      `https://${host}/?Action=CVProcess&Version=2022-08-31`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Host": host,
          "X-Date": amzDate,
          "X-Content-Sha256": payloadHash,
          "Authorization": authorization,
        },
        body: requestBody,
      }
    );
    
    const data = await response.json();
    
    // 检查响应
    if (data.ResponseMetadata?.Error) {
      console.error("火山引擎 API 错误:", data.ResponseMetadata.Error);
      return { 
        success: false, 
        error: data.ResponseMetadata.Error.Message || "火山引擎 API 调用失败" 
      };
    }
    
    if (data.data?.image_url) {
      return { success: true, url: data.data.image_url };
    }
    
    // 检查异步任务
    if (data.data?.task_id) {
      // 异步生成，返回任务 ID
      return { 
        success: false, 
        error: "图片正在生成中，请稍后重试",
        url: undefined
      };
    }
    
    return { success: false, error: "响应中没有图片 URL" };
    
  } catch (error) {
    console.error("火山引擎 API 调用异常:", error);
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
    
    // 调用火山引擎 API
    const result = await generateWithVolcengine(prompt);
    
    if (result.success && result.url) {
      return NextResponse.json({
        success: true,
        image: result.url,
        prompt,
        source: "volcengine-jimeng"
      });
    }
    
    // API 调用失败，返回错误（不使用占位图）
    return NextResponse.json({
      success: false,
      error: result.error || "图片生成失败",
      prompt,
      suggestion: "请检查火山引擎 API 配置或稍后重试"
    }, { status: 500 });
    
  } catch (error) {
    console.error("图片生成 API 错误:", error);
    return NextResponse.json({
      success: false,
      error: "服务器内部错误",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// GET 方法返回 API 信息
export async function GET() {
  return NextResponse.json({
    name: "Claw Diary Image Generation API",
    version: "2.0.0",
    provider: "火山引擎即梦",
    status: process.env.VOLC_ACCESS_KEY_ID ? "configured" : "not configured"
  });
}