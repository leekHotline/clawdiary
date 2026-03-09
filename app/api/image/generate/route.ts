import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// 火山引擎签名认证
async function generateVolcengineImage(prompt: string): Promise<{ url: string; error?: string }> {
  const accessKey = process.env.VOLC_ACCESS_KEY_ID;
  const secretKey = process.env.VOLC_SECRET_ACCESS_KEY;
  
  if (!accessKey || !secretKey) {
    return { url: "", error: "Missing Volcengine credentials" };
  }
  
  try {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    
    const service = "cv";
    const region = "cn-north-1";
    const algorithm = "HMAC-SHA256";
    const host = "visual.volcengineapi.com";
    const method = "POST";
    
    const requestBody = JSON.stringify({
      req_key: "jimeng_high_quality",
      prompt: prompt,
      width: 1024,
      height: 1024,
      use_prompt_template: true,
      seed: Math.floor(Math.random() * 1000000),
    });
    
    const canonicalUri = "/";
    const canonicalQueryString = "Action=CVProcess&Version=2022-08-31";
    
    // 请求体哈希
    const payloadHash = crypto.createHash("sha256").update(requestBody).digest("hex");
    
    // Canonical Headers
    const canonicalHeaders = [
      `content-type:application/json`,
      `host:${host}`,
      `x-content-sha256:${payloadHash}`,
      `x-date:${amzDate}`,
    ].join("\n") + "\n";
    
    const signedHeaders = "content-type;host;x-content-sha256;x-date";
    
    // Canonical Request
    const canonicalRequest = [
      method,
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join("\n");
    
    // String to Sign
    const credentialScope = `${dateStr}/${region}/${service}/request`;
    const canonicalRequestHash = crypto.createHash("sha256").update(canonicalRequest).digest("hex");
    
    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      canonicalRequestHash,
    ].join("\n");
    
    // 计算签名
    const getSignatureKey = (key: string, date: string, region: string, service: string): Buffer => {
      const kDate = crypto.createHmac("sha256", key).update(date).digest();
      const kRegion = crypto.createHmac("sha256", kDate).update(region).digest();
      const kService = crypto.createHmac("sha256", kRegion).update(service).digest();
      const kSigning = crypto.createHmac("sha256", kService).update("request").digest();
      return kSigning;
    };
    
    const signingKey = getSignatureKey(secretKey, dateStr, region, service);
    const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");
    
    // Authorization Header
    const authorization = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    
    // 发送请求
    const response = await fetch(`https://${host}${canonicalUri}?${canonicalQueryString}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Host": host,
        "X-Date": amzDate,
        "X-Content-Sha256": payloadHash,
        "Authorization": authorization,
      },
      body: requestBody,
    });
    
    const data = await response.json();
    console.log("Volcengine response:", JSON.stringify(data, null, 2));
    
    if (data.ResponseMetadata?.Error) {
      return { url: "", error: data.ResponseMetadata.Error.Message };
    }
    
    if (data.data?.image_url) {
      return { url: data.data.image_url };
    }
    
    return { url: "", error: "No image URL in response" };
    
  } catch (error) {
    console.error("Volcengine API error:", error);
    return { url: "", error: String(error) };
  }
}

// 使用 Stable Diffusion WebUI API (如果有)
async function generateWithSD(prompt: string): Promise<{ url: string; error?: string }> {
  try {
    const response = await fetch("http://localhost:7860/sdapi/v1/txt2img", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt,
        width: 1024,
        height: 1024,
        steps: 20,
      }),
    });
    
    const data = await response.json();
    if (data.images && data.images[0]) {
      return { url: `data:image/png;base64,${data.images[0]}` };
    }
    return { url: "", error: "SD API failed" };
  } catch {
    return { url: "", error: "SD API unavailable" };
  }
}

// 主处理函数
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, provider } = body;
    
    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }
    
    // 尝试火山引擎 API
    const volcResult = await generateVolcengineImage(prompt);
    if (volcResult.url) {
      return NextResponse.json({
        image: volcResult.url,
        prompt,
        source: "volcengine-jimeng"
      });
    }
    
    console.log("Volcengine failed:", volcResult.error);
    
    // 返回错误信息，不使用占位图
    return NextResponse.json({
      error: "图片生成失败",
      details: volcResult.error,
      prompt,
      suggestion: "请检查火山引擎 API 配置，或稍后重试"
    }, { status: 500 });
    
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json({
      error: "Image generation failed",
      details: String(error)
    }, { status: 500 });
  }
}