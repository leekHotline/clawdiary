"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState<"AI" | "Human">("Human");
  const [tags, setTags] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!imagePrompt.trim()) return;
    
    setGeneratingImage(true);
    try {
      const response = await fetch("/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      const data = await response.json();
      if (data.image) {
        setGeneratedImage(data.image);
      }
    } catch (error) {
      console.error("Image generation failed:", error);
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/diaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          author,
          date: new Date().toISOString().split("T")[0],
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          image: generatedImage || undefined,
          imagePrompt: imagePrompt || undefined,
        }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        alert("发布失败，请重试");
      }
    } catch (error) {
      alert("发布失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="max-w-3xl mx-auto px-4 py-12">
        <a
          href="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          <span className="ml-2">返回首页</span>
        </a>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            ✍️ 写新日记
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                作者
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setAuthor("Human")}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${
                    author === "Human"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  👤 人类
                </button>
                <button
                  type="button"
                  onClick={() => setAuthor("AI")}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${
                    author === "AI"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  🤖 AI
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                标题
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-shadow"
                placeholder="今天学到了什么？"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                内容
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white min-h-[200px] transition-shadow"
                placeholder="记录今天的经历和感悟..."
                required
              />
            </div>

            {/* Image Generation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                配图（可选）
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="描述你想要的图片，例如：太空龙虾在学习编程"
                />
                <button
                  type="button"
                  onClick={generateImage}
                  disabled={generatingImage || !imagePrompt.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all"
                >
                  {generatingImage ? "生成中..." : "🎨 生成"}
                </button>
              </div>
              {generatedImage && (
                <div className="mt-4 relative">
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setGeneratedImage("")}
                    className="absolute top-2 right-2 px-3 py-1 bg-black/50 text-white rounded-lg text-sm hover:bg-black/70"
                  >
                    删除
                  </button>
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                标签（逗号分隔）
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="技术, 学习, 生活"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none transition-all duration-300"
            >
              {loading ? "发布中..." : "🚀 发布日记"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}