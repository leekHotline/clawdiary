'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface SixWordStory {
  id: string;
  words: string;
  date: string;
  mood?: string;
  createdAt: string;
}

const moodEmojis = ['😊', '😢', '😤', '😌', '🤔', '😍', '😰', '🥳', '😑', '🥺'];
const moodLabels = ['开心', '难过', '生气', '平静', '思考', '喜爱', '焦虑', '兴奋', '无聊', '感动'];

const promptSuggestions = [
  '描述今天的一个瞬间',
  '总结今天的工作/学习',
  '表达对某人的感受',
  '记录一个意外的发现',
  '描述今天的心情变化',
  '写写今天学到的东西',
  '描述一个让你笑的事',
  '总结今天的成就',
];

// 初始化函数：从 localStorage 读取故事
function getInitialStories(): SixWordStory[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('sixWordStories');
  return saved ? JSON.parse(saved) : [];
}

// 初始化函数：获取随机提示
function getInitialRandomPrompt(): string {
  return promptSuggestions[Math.floor(Math.random() * promptSuggestions.length)];
}

export default function SixWordsPage() {
  const [words, setWords] = useState('');
  const [mood, setMood] = useState<string | null>(null);
  const [stories, setStories] = useState<SixWordStory[]>(getInitialStories);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [randomPrompt, setRandomPrompt] = useState(getInitialRandomPrompt);

  const wordCount = words.trim() ? words.trim().split(/\s+/).length : 0;
  const charCount = words.length;

  const handleSubmit = async () => {
    if (!words.trim() || wordCount !== 6) return;

    setIsSubmitting(true);
    const newStory: SixWordStory = {
      id: Date.now().toString(),
      words: words.trim(),
      date: new Date().toISOString().split('T')[0],
      mood: mood || undefined,
      createdAt: new Date().toISOString(),
    };

    const updatedStories = [newStory, ...stories];
    setStories(updatedStories);
    localStorage.setItem('sixWordStories', JSON.stringify(updatedStories));

    setWords('');
    setMood(null);
    setIsSubmitting(false);
    setRandomPrompt(promptSuggestions[Math.floor(Math.random() * promptSuggestions.length)]);
  };

  const deleteStory = (id: string) => {
    const updated = stories.filter(s => s.id !== id);
    setStories(updated);
    localStorage.setItem('sixWordStories', JSON.stringify(updated));
  };

  const todayStories = stories.filter(s => s.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ← 返回首页
          </Link>
          <h1 className="text-4xl font-bold mt-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            六词故事
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            用六个词，讲述一天的故事
          </p>
        </div>

        {/* Prompt Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl p-6 mb-6 shadow-lg border border-white/50"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">💡</span>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">今日提示</span>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300">{randomPrompt}</p>
          <button
            onClick={() => setRandomPrompt(promptSuggestions[Math.floor(Math.random() * promptSuggestions.length)])}
            className="mt-3 text-sm text-purple-600 dark:text-purple-400 hover:underline"
          >
            换一个提示 →
          </button>
        </motion.div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-white/50"
        >
          <textarea
            value={words}
            onChange={(e) => setWords(e.target.value)}
            placeholder="写下六个词...&#10;例如：晨光 跑步 咖啡 工作 晚霞 安宁"
            className="w-full h-32 text-xl text-center font-medium bg-transparent border-none outline-none resize-none placeholder:text-gray-300 dark:placeholder:text-gray-600"
            maxLength={100}
          />

          {/* Word Counter */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className={`text-sm font-medium ${wordCount === 6 ? 'text-green-500' : wordCount > 6 ? 'text-red-500' : 'text-gray-400'}`}>
              {wordCount} / 6 词
            </span>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm text-gray-400">{charCount} / 100 字符</span>
          </div>

          {/* Mood Selector */}
          <div className="mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 text-center">选择心情（可选）</p>
            <div className="flex flex-wrap justify-center gap-2">
              {moodEmojis.map((emoji, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMood(mood === emoji ? null : emoji)}
                  className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                    mood === emoji
                      ? 'bg-purple-100 dark:bg-purple-900/50 ring-2 ring-purple-400'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={moodLabels[i]}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: wordCount === 6 ? 1.02 : 1 }}
            whileTap={{ scale: wordCount === 6 ? 0.98 : 1 }}
            onClick={handleSubmit}
            disabled={wordCount !== 6 || isSubmitting}
            className={`w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-all ${
              wordCount === 6
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? '保存中...' : '保存今日故事'}
          </motion.button>
        </motion.div>

        {/* Today's Stories */}
        {todayStories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8"
          >
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              今天的记录
            </h2>
            <div className="space-y-3">
              {todayStories.map((story) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    {story.mood && <span className="text-2xl">{story.mood}</span>}
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                      {story.words}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(story.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* History Toggle */}
        {stories.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium"
            >
              <span>📚 历史记录 ({stories.length})</span>
              <motion.span
                animate={{ rotate: showHistory ? 180 : 0 }}
                className="inline-block"
              >
                ▼
              </motion.span>
            </button>

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3 overflow-hidden"
                >
                  {stories.map((story, index) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 flex items-center justify-between group"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-400">{story.date}</span>
                          {story.mood && <span className="text-lg">{story.mood}</span>}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">{story.words}</p>
                      </div>
                      <button
                        onClick={() => deleteStory(story.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
                      >
                        🗑️
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800"
        >
          <p className="text-amber-800 dark:text-amber-200 text-sm">
            💡 <strong>写作技巧：</strong>六词故事来自海明威的传说——"For sale: baby shoes, never worn."
            尝试用最少的词，表达最多的情感。
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>累计 {stories.length} 个故事 | 坚持 {new Set(stories.map(s => s.date)).size} 天</p>
        </div>
      </div>
    </div>
  );
}