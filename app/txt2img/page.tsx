"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  seed: number;
  model: string;
  width: number;
  height: number;
  timestamp: string;
}

export default function Txt2ImgPage() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [steps, setSteps] = useState(8);
  const [model, setModel] = useState("ZImageTurbo_INT8");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  // 轮询获取图片状态
  const pollForImage = useCallback(async (requestId: string, imageData: Partial<GeneratedImage>) => {
    const maxAttempts = 60;
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        setProgress(Math.min(90, 10 + i * 1.5));
        setStatusMessage(`生成中... (${i + 1}/${maxAttempts})`);
        
        const response = await fetch(`/api/txt2img?request_id=${requestId}`);
        const data = await response.json();
        
        if (data.status === "completed" && data.image) {
          setProgress(100);
          setStatusMessage("生成完成！");
          
          const newImage: GeneratedImage = {
            id: data.id,
            url: data.image,
            prompt: data.prompt || imageData.prompt || "",
            seed: data.seed || imageData.seed || 0,
            model: data.model || imageData.model || "",
            width: data.width || imageData.width || 1024,
            height: data.height || imageData.height || 1024,
            timestamp: data.timestamp || new Date().toISOString(),
          };
          
          setGeneratedImage(newImage);
          setHistory((prev) => [newImage, ...prev].slice(0, 10));
          setLoading(false);
          return;
        }
        
        if (data.status === "failed") {
          throw new Error(data.error || "生成失败");
        }
        
        // 等待 2 秒后继续轮询
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.error("Poll error:", e);
        // 继续重试
      }
    }
    
    throw new Error("生成超时，请重试");
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("请输入提示词");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(5);
    setStatusMessage("正在提交请求...");

    try {
      const response = await fetch("/api/txt2img", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          negative_prompt: negativePrompt.trim(),
          width,
          height,
          steps,
          model,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "生成失败");
      }

      // 如果是异步模式，需要轮询
      if (data.status === "processing" && data.request_id) {
        setProgress(10);
        setStatusMessage("图片生成中，请等待...");
        
        await pollForImage(data.request_id, {
          prompt: data.prompt,
          seed: data.seed,
          model: data.model,
          width: data.width,
          height: data.height,
        });
      } else if (data.image) {
        // 同步模式，直接返回图片
        setProgress(100);
        setStatusMessage("生成完成！");
        
        const newImage: GeneratedImage = {
          id: data.id,
          url: data.image,
          prompt: data.prompt,
          seed: data.seed,
          model: data.model,
          width: data.width,
          height: data.height,
          timestamp: data.timestamp,
        };

        setGeneratedImage(newImage);
        setHistory((prev) => [newImage, ...prev].slice(0, 10));
        setLoading(false);
      } else {
        throw new Error("未知的响应格式");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请重试");
      setLoading(false);
      setProgress(0);
      setStatusMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-purple-950 dark:to-indigo-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🎨 文生图
          </h1>
          <a href="/image-history" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 text-sm">
            📜 历史记录 →
          </a>
        </div>

        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8">
          {/* 提示词输入 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              提示词 (Prompt)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="描述你想要生成的图像，例如：一只可爱的太空龙虾，在宇宙中漂浮，背景是绚丽的星云..."
              className="w-full h-32 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* 负向提示词 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              负向提示词 (可选)
            </label>
            <input
              type="text"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="不想出现的内容，例如：模糊, 低质量, 变形..."
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* 参数设置 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                宽度
              </label>
              <select
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              >
                <option value={512}>512</option>
                <option value={768}>768</option>
                <option value={1024}>1024</option>
                <option value={1280}>1280</option>
                <option value={1536}>1536</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                高度
              </label>
              <select
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              >
                <option value={512}>512</option>
                <option value={768}>768</option>
                <option value={1024}>1024</option>
                <option value={1280}>1280</option>
                <option value={1536}>1536</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                步数
              </label>
              <select
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              >
                <option value={4}>4 (最快)</option>
                <option value={8}>8 (推荐)</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                模型
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              >
                <option value="ZImageTurbo_INT8">Turbo (快速)</option>
                <option value="ZImage_INT8">Standard (标准)</option>
              </select>
            </div>
          </div>

          {/* 进度条 */}
          {loading && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{statusMessage}</span>
                <span className="text-sm font-medium text-purple-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              ❌ {error}
            </div>
          )}

          {/* 生成按钮 */}
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed"
          >
            {loading ? "🎨 生成中..." : "🎨 生成图像"}
          </button>
        </div>

        {/* 生成的图像 */}
        {generatedImage && (
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              ✨ 生成结果
            </h2>
            <div className="relative group">
              <img
                src={generatedImage.url}
                alt={generatedImage.prompt}
                className="w-full rounded-lg shadow-md"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                Seed: {generatedImage.seed}
              </span>
              <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 rounded-full text-xs">
                {generatedImage.model}
              </span>
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs">
                {generatedImage.width} × {generatedImage.height}
              </span>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = generatedImage.url;
                  link.download = `txt2img-${generatedImage.seed}.png`;
                  link.click();
                }}
                className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-xs hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors cursor-pointer"
              >
                📥 下载
              </button>
            </div>
          </div>
        )}

        {/* 历史记录 */}
        {history.length > 0 && (
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              📜 本次生成历史
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.map((img, index) => (
                <div
                  key={index}
                  className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
                  onClick={() => setGeneratedImage(img)}
                >
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs text-center px-2 line-clamp-3">
                      {img.prompt.slice(0, 50)}...
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}