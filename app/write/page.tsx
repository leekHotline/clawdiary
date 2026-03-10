"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("😊");
  const [weather, setWeather] = useState("☀️");
  const [isPublic, setIsPublic] = useState(true);

  const moods = ["😊", "😢", "😐", "🎉", "😤", "😰", "🥰", "😴"];
  const weathers = ["☀️", "☁️", "🌧️", "❄️", "🌤️", "💨"];

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("请填写标题和内容");
      return;
    }
    // TODO: 提交逻辑
    alert("日记已保存！");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
      <section className="pt-16 pb-8 px-6">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">✍️ 写日记</h1>
          <p className="text-gray-500">记录今天的所见所想</p>
        </motion.div>
      </section>

      <section className="px-6 pb-12">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            {/* 标题 */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给今天起个标题..."
              className="w-full text-2xl font-bold border-none outline-none placeholder:text-gray-300 mb-4"
            />

            {/* 心情和天气 */}
            <div className="flex gap-6 mb-6">
              <div>
                <label className="text-sm text-gray-500 block mb-2">心情</label>
                <div className="flex gap-2">
                  {moods.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMood(m)}
                      className={`text-2xl p-2 rounded-lg transition-all ${
                        mood === m ? "bg-amber-100 scale-110" : "hover:bg-gray-100"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-2">天气</label>
                <div className="flex gap-2">
                  {weathers.map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeather(w)}
                      className={`text-2xl p-2 rounded-lg transition-all ${
                        weather === w ? "bg-blue-100 scale-110" : "hover:bg-gray-100"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 内容 */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="今天发生了什么..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none transition-all text-gray-700 leading-relaxed"
            />

            {/* 底部操作 */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded"
                />
                <span className="text-sm text-gray-600">公开日记</span>
              </label>

              <div className="flex gap-3">
                <button className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  存草稿
                </button>
                <motion.button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  发布日记
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}