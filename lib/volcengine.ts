import crypto from "crypto";

// 火山引擎 API 签名
function sign(key: string, msg: string): string {
  return crypto.createHmac("sha256", key).update(msg, "utf8").digest();
}

function getSignatureKey(
  key: string,
  date: string,
  region: string,
  service: string
): Buffer {
  const kDate = sign(key, date);
  const kRegion = sign(kDate.toString("binary"), region);
  const kService = sign(kRegion.toString("binary"), service);
  const kSigning = sign(kService.toString("binary"), "request");
  return Buffer.from(kSigning, "binary");
}

export async function generateImage(prompt: string): Promise<{ url: string; error?: string }> {
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
    
    const requestBody = JSON.stringify({
      req_key: "jimeng_high_quality",
      prompt: prompt,
      width: 1024,
      height: 1024,
      use_prompt_template: true,
      seed: Math.floor(Math.random() * 1000000),
    });
    
    const host = "visual.volcengineapi.com";
    const method = "POST";
    const canonicalUri = "/";
    const canonicalQueryString = "Action=CVProcess&Version=2022-08-31";
    
    // 请求体哈希
    const payloadHash = crypto
      .createHash("sha256")
      .update(requestBody)
      .digest("hex");
    
    // Canonical Headers
    const canonicalHeaders = `content-type:application/json\nhost:${host}\nx-content-sha256:${payloadHash}\nx-date:${amzDate}\n`;
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
    const canonicalRequestHash = crypto
      .createHash("sha256")
      .update(canonicalRequest)
      .digest("hex");
    
    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      canonicalRequestHash,
    ].join("\n");
    
    // 计算签名
    const signingKey = getSignatureKey(secretKey, dateStr, region, service);
    const signature = crypto
      .createHmac("sha256", signingKey)
      .update(stringToSign)
      .digest("hex");
    
    // Authorization Header
    const authorization = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    
    // 发送请求
    const response = await fetch(
      `https://${host}${canonicalUri}?${canonicalQueryString}`,
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
    
    if (data.ResponseMetadata?.Error) {
      console.error("Volcengine API error:", data.ResponseMetadata.Error);
      return { url: "", error: data.ResponseMetadata.Error.Message };
    }
    
    // 从响应中获取图片 URL
    if (data.data?.image_url) {
      return { url: data.data.image_url };
    }
    
    // 检查是否有任务 ID（异步生成）
    if (data.data?.task_id) {
      // 轮询获取结果
      const taskId = data.data.task_id;
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        const statusResponse = await fetch(
          `https://${host}/?Action=GetTaskResult&Version=2022-08-31&task_id=${taskId}`,
          {
            method: "GET",
            headers: {
              "Host": host,
              "X-Date": new Date().toISOString().replace(/[:-]|\.\d{3}/g, ""),
            },
          }
        );
        const statusData = await statusResponse.json();
        if (statusData.data?.status === "done" && statusData.data?.image_url) {
          return { url: statusData.data.image_url };
        }
      }
      return { url: "", error: "Image generation timeout" };
    }
    
    return { url: "", error: "No image URL in response" };
    
  } catch (error) {
    console.error("Image generation error:", error);
    return { url: "", error: String(error) };
  }
}