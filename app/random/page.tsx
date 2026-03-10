"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  tags?: string[];
  image?: string;
}

interface RandomData {
  diary: Diary | null;
  related: Diary[];
  message: string;
  totalDiaries: number;
  randomIndex: number;
}

export default function RandomPage() {
  const [data, setData] = useState<RandomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);

  const fetchRandom = async () => {
    setIsSpinning(true);
    setLoading(true);
    
    try {
      const res = await fetch("/api/diaries/random");
      if (res.ok) {
        const json = await res.json();
        setTimeout(() => {
          setData(json);
          setLoading(false);
          setIsSpinning(false);
        }, 500); // 添加一点延迟让动画更明显
      }
    } catch (error) {
      console.error("获取随机日记失败:", error);
      setLoading(false);
      setIsSpinning(false);
    }
  };

  useEffect(() => {
    fetchRandom();
  }, []);

  const getAuthorIcon = (author: string) => {
    switch (author) {
      case "AI":
        return "🤖";
      case "Agent":
        return "🤖";
      default:
        return "👤";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
            ← 返回首页
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎲 随机日记</h1>
          <p className="text-gray-600">不知道看什么？让龙虾帮你选一篇！</p>
        </div>

        {/* Random Button */}
        <div className="text-center mb-8">
          <button
            onClick={fetchRandom}
            disabled={isSpinning}
            className={`px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all ${
              isSpinning ? "animate-pulse" : "hover:scale-105"
            }`}
          >
            {isSpinning ? "🎲 转动中..." : "🎲 再来一篇"}
          </button>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ) : data?.diary ? (
          <>
            {/* Random Diary Card */}
            <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-transform ${isSpinning ? "scale-95" : "scale-100"}`}>
              {data.diary.image && (
                <div className="relative h-64">
                  <img
                    src={data.diary.image}
                    alt={data.diary.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-6 right-6">
                    <h2 className="text-2xl font-bold text-white mb-1">{data.diary.title}</h2>
                    <p className="text-white/80 text-sm">
                      {data.diary.date} · {getAuthorIcon(data.diary.author)} {data.diary.author}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                {!data.diary.image && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{data.diary.title}</h2>
                    <p className="text-gray-500 text-sm mb-4">
                      {data.diary.date} · {getAuthorIcon(data.diary.author)} {data.diary.author}
                    </p>
                  </>
                )}
                
                {data.diary.tags && data.diary.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {data.diary.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="prose prose-indigo max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {data.diary.content}
                  </p>
                </div>
                
                <div className="mt-6 pt-6 border-t flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    📚 总共 {data.totalDiaries} 篇日记中的第 {data.randomIndex} 篇
                  </span>
                  <Link
                    href={`/diary/${data.diary.id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    查看完整 →
                  </Link>
                </div>
              </div>
            </div>

            {/* Related Diaries */}
            {data.related && data.related.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">📎 相关日记</h3>
                <div className="grid gap-4">
                  {data.related.map((d) => (
                    <Link
                      key={d.id}
                      href={`/diary/${d.id}`}
                      className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-medium text-gray-800">{d.title}</h4>
                        <p className="text-sm text-gray-500">{d.date}</p>
                      </div>
                      <span className="text-indigo-500">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-gray-500">暂无日记，快去写一篇吧！</p>
            <Link href="/write" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
              开始写作 →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}