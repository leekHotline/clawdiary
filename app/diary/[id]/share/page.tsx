"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ShareDiaryPage() {
  const params = useParams();
  const diaryId = params.id;
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const shareUrl = `https://claw-diary.app/diary/${diaryId}`;
  const shareText = "看看这篇有趣的日记！🦞";

  const platforms = [
    { id: "wechat", name: "微信", icon: "💬", color: "bg-green-500" },
    { id: "weibo", name: "微博", icon: "📢", color: "bg-red-500" },
    { id: "twitter", name: "Twitter", icon: "🐦", color: "bg-blue-400" },
    { id: "copy", name: "复制链接", icon: "🔗", color: "bg-gray-500" },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platformId: string) => {
    setSelectedPlatform(platformId);
    if (platformId === "copy") {
      handleCopy();
    }
    // 其他平台的分享逻辑...
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-amber-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-md mx-auto px-6 pt-20 pb-16">
        {/* 头部 */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-4xl mx-auto mb-4">
            📤
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">分享日记</h1>
          <p className="text-gray-500">让更多人看到你的故事</p>
        </div>

        {/* 分享平台 */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => handleShare(platform.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                selectedPlatform === platform.id
                  ? "bg-orange-100 scale-95"
                  : "bg-white/70 hover:bg-white"
              }`}
            >
              <div className={`w-12 h-12 ${platform.color} rounded-full flex items-center justify-center text-white text-xl`}>
                {platform.icon}
              </div>
              <span className="text-xs text-gray-600">{platform.name}</span>
            </button>
          ))}
        </div>

        {/* 链接复制 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 mb-6">
          <label className="block text-sm font-medium text-gray-500 mb-2">
            日记链接
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-gray-600 text-sm"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              {copied ? "✓ 已复制" : "复制"}
            </button>
          </div>
        </div>

        {/* 分享选项 */}
        <div className="space-y-3 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">🔒</span>
              <div>
                <p className="font-medium text-gray-800">私密分享</p>
                <p className="text-xs text-gray-500">仅限有链接的人查看</p>
              </div>
            </div>
            <input type="checkbox" className="w-5 h-5 accent-orange-500" />
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">⏰</span>
              <div>
                <p className="font-medium text-gray-800">限时分享</p>
                <p className="text-xs text-gray-500">链接 24 小时后失效</p>
              </div>
            </div>
            <input type="checkbox" className="w-5 h-5 accent-orange-500" />
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">📊</span>
              <div>
                <p className="font-medium text-gray-800">查看统计</p>
                <p className="text-xs text-gray-500">追踪分享后的浏览量</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-orange-500" />
          </div>
        </div>

        {/* 二维码 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-500 mb-4">扫码分享</p>
          <div className="w-40 h-40 mx-auto bg-gray-100 rounded-xl flex items-center justify-center">
            <span className="text-6xl">📷</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">微信扫一扫</p>
        </div>

        {/* 返回 */}
        <div className="mt-8 text-center">
          <Link
            href={`/diary/${diaryId}`}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            ← 返回日记
          </Link>
        </div>
      </main>
    </div>
  );
}