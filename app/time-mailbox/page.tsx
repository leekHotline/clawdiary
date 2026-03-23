"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 日记类型
interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  tags?: string[];
}

// 信件类型
interface Letter {
  id: string;
  diaryId: string;
  diaryDate: string;
  diaryTitle: string;
  userLetter: string;
  pastSelfResponse: string;
  createdAt: string;
}

// AI 回复风格
const responseStyles = [
  { id: "warm", name: "温暖治愈", emoji: "💌", desc: "温柔鼓励，给予力量" },
  { id: "wise", name: "智慧导师", emoji: "🧙", desc: "深度反思，指引方向" },
  { id: "playful", name: "调皮玩伴", emoji: "🎭", desc: "轻松幽默，童心对话" },
  { id: "poetic", name: "诗意浪漫", emoji: "🌙", desc: "文字优美，意境深远" },
];

// Helper function for localStorage initialization
function loadInitialSavedLetters(): Letter[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("time-mailbox-letters");
  return saved ? JSON.parse(saved) : [];
}

export default function TimeMailboxPage() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [letterContent, setLetterContent] = useState("");
  const [responseStyle, setResponseStyle] = useState("warm");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{
    userLetter: string;
    response: string;
  } | null>(null);
  const [savedLetters, setSavedLetters] = useState<Letter[]>(loadInitialSavedLetters);
  const [showHistory, setShowHistory] = useState(false);

  // 加载日记
  useEffect(() => {
    fetch("/api/diaries")
      .then((res) => res.json())
      .then((data) => {
        // 按日期排序，最新的在前
        const sorted = [...data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setDiaries(sorted);
      })
      .catch((err) => console.error("加载日记失败:", err));
  }, []);

  // 发送信件
  const handleSendLetter = async () => {
    if (!selectedDiary || !letterContent.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/time-mailbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diaryId: selectedDiary.id,
          diaryTitle: selectedDiary.title,
          diaryContent: selectedDiary.content,
          diaryDate: selectedDiary.date,
          letterContent,
          responseStyle,
        }),
      });

      const data = await res.json();
      setConversation({
        userLetter: letterContent,
        response: data.response,
      });

      // 保存信件
      const newLetter: Letter = {
        id: `letter-${Date.now()}`,
        diaryId: selectedDiary.id,
        diaryDate: selectedDiary.date,
        diaryTitle: selectedDiary.title,
        userLetter: letterContent,
        pastSelfResponse: data.response,
        createdAt: new Date().toISOString(),
      };
      const updatedLetters = [newLetter, ...savedLetters];
      setSavedLetters(updatedLetters);
      localStorage.setItem(
        "time-mailbox-letters",
        JSON.stringify(updatedLetters)
      );
    } catch (error) {
      console.error("发送失败:", error);
      setConversation({
        userLetter: letterContent,
        response:
          "时光信箱暂时无法连接，但过去的你依然在默默支持着你。请稍后再试～ 💫",
      });
    }
    setIsLoading(false);
  };

  // 重置
  const handleReset = () => {
    setSelectedDiary(null);
    setLetterContent("");
    setConversation(null);
  };

  // 计算天数差
  const getDaysAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0) return "今天";
    if (diff === 1) return "昨天";
    return `${diff} 天前`;
  };

  // 获取内容摘要
  const getSummary = (content: string, maxLength = 80) => {
    const plainText = content.replace(/[#*`]/g, "").slice(0, maxLength);
    return plainText.length < content.length ? plainText + "..." : plainText;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-fuchsia-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-fuchsia-200/20 rounded-full blur-2xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 py-12">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 transition-colors"
        >
          <span>←</span>
          <span>返回首页</span>
        </Link>

        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📮</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            时光信箱
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            写一封信给过去的自己，与那时的你对话。
            <br />
            反思、鼓励、和解——让时间成为治愈的力量。
          </p>
        </div>

        {/* 信件历史 */}
        {savedLetters.length > 0 && !selectedDiary && (
          <div className="mb-8 text-center">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full text-gray-600 hover:bg-white transition-all"
            >
              <span>📬</span>
              <span>已保存 {savedLetters.length} 封信</span>
              <span>{showHistory ? "↑" : "↓"}</span>
            </button>
          </div>
        )}

        {/* 信件历史列表 */}
        {showHistory && savedLetters.length > 0 && (
          <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
            <h3 className="text-lg font-bold text-gray-700 mb-4">📪 历史信件</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {savedLetters.slice(0, 5).map((letter) => (
                <div
                  key={letter.id}
                  className="p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors cursor-pointer"
                  onClick={() => {
                    setConversation({
                      userLetter: letter.userLetter,
                      response: letter.pastSelfResponse,
                    });
                    setShowHistory(false);
                  }}
                >
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700">
                      {letter.diaryTitle}
                    </span>
                    <span className="text-gray-400">{letter.diaryDate}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1 truncate">
                    {letter.userLetter}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 步骤1：选择日记 */}
        {!selectedDiary && (
          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-sm">
                1
              </span>
              <span>选择过去的一天</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diaries.slice(0, 10).map((diary) => (
                <button
                  key={diary.id}
                  onClick={() => setSelectedDiary(diary)}
                  className="group bg-white/70 backdrop-blur-sm rounded-2xl p-5 text-left border border-white/50 hover:border-violet-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-violet-600 font-medium">
                      {diary.date}
                    </span>
                    <span className="text-xs text-gray-400">
                      {getDaysAgo(diary.date)}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 group-hover:text-violet-700 transition-colors line-clamp-2">
                    {diary.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {getSummary(diary.content)}
                  </p>
                  {diary.tags && diary.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {diary.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-violet-50 text-violet-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {diaries.length > 10 && (
              <p className="text-center text-gray-400 text-sm mt-4">
                显示最近 10 篇日记
              </p>
            )}
          </div>
        )}

        {/* 步骤2：写信 */}
        {selectedDiary && !conversation && (
          <div>
            {/* 选中的日记 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-violet-600 font-medium">
                  {selectedDiary.date}
                </span>
                <span className="text-xs text-gray-400">
                  {getDaysAgo(selectedDiary.date)}
                </span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">
                {selectedDiary.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                {getSummary(selectedDiary.content, 150)}
              </p>
            </div>

            {/* 选择回复风格 */}
            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-sm">
                2
              </span>
              <span>选择对话风格</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {responseStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setResponseStyle(style.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    responseStyle === style.id
                      ? "border-violet-400 bg-violet-50"
                      : "border-transparent bg-white/70 hover:bg-white"
                  }`}
                >
                  <div className="text-2xl mb-1">{style.emoji}</div>
                  <div className="font-medium text-gray-800 text-sm">
                    {style.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{style.desc}</div>
                </button>
              ))}
            </div>

            {/* 写信区域 */}
            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-sm">
                3
              </span>
              <span>写下你的心里话</span>
            </h2>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 mb-6">
              <textarea
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
                placeholder="给那天的自己写点什么吧...

例如：
• 如果可以回到那天，我想告诉你...
• 那时候烦恼的事，后来怎么样了？
• 我想对那个自己说的话...
• 现在的我，想感谢那个自己..."
                className="w-full h-48 bg-transparent border-none outline-none resize-none text-gray-700 placeholder-gray-400 leading-relaxed"
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <button
                onClick={handleSendLetter}
                disabled={!letterContent.trim() || isLoading}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>时光穿梭中...</span>
                  </>
                ) : (
                  <>
                    <span>📨</span>
                    <span>投递信件</span>
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
              >
                返回
              </button>
            </div>

            {/* 字数统计 */}
            {letterContent.length > 0 && (
              <div className="mt-4 text-center text-sm text-gray-400">
                已写 {letterContent.length} 字
              </div>
            )}
          </div>
        )}

        {/* 步骤3：对话 */}
        {conversation && (
          <div>
            {/* 时间对话 */}
            <div className="bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl p-8 mb-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">✉️</div>
                <h3 className="text-xl font-bold text-gray-800">
                  来自 {selectedDiary?.date} 的回信
                </h3>
              </div>

              {/* 你的信 */}
              <div className="bg-white/80 rounded-2xl p-5 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">📝</span>
                  <span className="font-medium text-gray-700">
                    现在的你写给过去的信
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {conversation.userLetter}
                </p>
              </div>

              {/* 过去自己的回复 */}
              <div className="bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">💫</span>
                  <span className="font-medium">
                    {selectedDiary?.date} 的你回复道：
                  </span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap opacity-95">
                  {conversation.response}
                </p>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <button
                onClick={() => setConversation(null)}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                再写一封 ✉️
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
              >
                选择另一天
              </button>
            </div>

            {/* 功能说明 */}
            <div className="mt-8 bg-white/50 rounded-2xl p-6">
              <h4 className="font-bold text-gray-700 mb-3">
                💡 与过去对话的意义
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex gap-2">
                  <span>🌱</span>
                  <span className="text-gray-600">
                    看见成长的轨迹，确认自己的进步
                  </span>
                </div>
                <div className="flex gap-2">
                  <span>💫</span>
                  <span className="text-gray-600">
                    温柔地接纳过去的自己
                  </span>
                </div>
                <div className="flex gap-2">
                  <span>🔮</span>
                  <span className="text-gray-600">
                    从过去汲取力量，继续向前
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 功能介绍 */}
        {!selectedDiary && savedLetters.length === 0 && (
          <div className="mt-12 bg-white/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">
              🌟 如何使用时光信箱
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-violet-100 flex items-center justify-center text-2xl">
                  📅
                </div>
                <h4 className="font-medium text-gray-800 mb-1">选择一天</h4>
                <p className="text-sm text-gray-500">
                  选择你过去日记中的某一天
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                  ✍️
                </div>
                <h4 className="font-medium text-gray-800 mb-1">写信</h4>
                <p className="text-sm text-gray-500">
                  写下你想对那天自己说的话
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-fuchsia-100 flex items-center justify-center text-2xl">
                  💬
                </div>
                <h4 className="font-medium text-gray-800 mb-1">对话</h4>
                <p className="text-sm text-gray-500">
                  AI 会模拟那天的你，给你回信
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}