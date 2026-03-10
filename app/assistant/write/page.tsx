"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AIWritePage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleGenerate = () => {
    if (!input.trim()) return;
    setResult("这是一个美好的日子...（AI 生成的日记内容会显示在这里）");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">💡 智能写作助手</h1>
          <p className="text-gray-500 mb-6">让 AI 帮你润色日记，让文字更有温度</p>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">日记草稿</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入你的日记内容，AI 会帮你润色..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none"
            />
            <button
              onClick={handleGenerate}
              className="mt-4 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
            >
              ✨ AI 润色
            </button>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200"
            >
              <label className="block text-sm font-medium text-amber-700 mb-2">✨ 润色结果</label>
              <p className="text-gray-700 leading-relaxed">{result}</p>
              <button className="mt-4 text-amber-600 font-medium hover:text-amber-700">
                使用这个版本 →
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}