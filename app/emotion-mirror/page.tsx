'use client';

import { useState } from 'react';
import Link from 'next/link';

const EMOTIONS = [
  { emoji: '😊', name: '开心', color: '#FFD93D', desc: '心情愉悦，充满正能量' },
  { emoji: '😌', name: '平静', color: '#6BCB77', desc: '内心安宁，状态稳定' },
  { emoji: '😔', name: '难过', color: '#4D96FF', desc: '有些低落，需要关怀' },
  { emoji: '😤', name: '愤怒', color: '#FF6B6B', desc: '情绪激动，需要释放' },
  { emoji: '😰', name: '焦虑', color: '#9B59B6', desc: '担忧不安，思绪纷乱' },
  { emoji: '🥱', name: '疲惫', color: '#95A5A6', desc: '身心俱疲，需要休息' },
  { emoji: '🤔', name: '困惑', color: '#3498DB', desc: '迷茫不解，寻找方向' },
  { emoji: '🥰', name: '感恩', color: '#E74C3C', desc: '心存感激，温暖满满' },
];

const INTENSITY_LEVELS = [
  { value: 1, label: '轻微', desc: '一点点' },
  { value: 2, label: '中等', desc: '比较明显' },
  { value: 3, label: '强烈', desc: '非常强烈' },
  { value: 4, label: '主导', desc: '完全占据' },
];

const REFLECTION_PROMPTS = [
  '今天发生了什么让你有这样的感受？',
  '这种情绪想告诉你什么？',
  '如果给这个情绪写一封信，你会说什么？',
  '有什么可以帮助你缓解或延续这个感受？',
];

interface EmotionAnalysis {
  summary: string;
  insight: string;
  suggestion: string;
  affirmation: string;
  reflectionQuestions: string[];
}

export default function EmotionMirrorPage() {
  const [step, setStep] = useState<'select' | 'intensity' | 'context' | 'analyzing' | 'result'>('select');
  const [selectedEmotion, setSelectedEmotion] = useState<typeof EMOTIONS[0] | null>(null);
  const [intensity, setIntensity] = useState(2);
  const [context, setContext] = useState('');
  const [analysis, setAnalysis] = useState<EmotionAnalysis | null>(null);
  const [error, setError] = useState('');

  const handleEmotionSelect = (emotion: typeof EMOTIONS[0]) => {
    setSelectedEmotion(emotion);
    setStep('intensity');
  };

  const handleAnalyze = async () => {
    if (!selectedEmotion) return;
    
    setStep('analyzing');
    setError('');

    try {
      const response = await fetch('/api/emotion-mirror', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emotion: selectedEmotion.name,
          emoji: selectedEmotion.emoji,
          intensity,
          context,
          color: selectedEmotion.color,
        }),
      });

      if (!response.ok) {
        throw new Error('分析失败');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
      setStep('result');
    } catch {
      setError('分析出错，请重试');
      setStep('context');
    }
  };

  const handleReset = () => {
    setStep('select');
    setSelectedEmotion(null);
    setIntensity(2);
    setContext('');
    setAnalysis(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            ← 返回首页
          </Link>
          <h1 className="text-lg font-semibold text-gray-800">🪞 AI 情绪镜子</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Step 1: Select Emotion */}
        {step === 'select' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">此刻，你的心情如何？</h2>
              <p className="text-gray-500">选择最符合当前状态的词语</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {EMOTIONS.map((emotion) => (
                <button
                  key={emotion.name}
                  onClick={() => handleEmotionSelect(emotion)}
                  className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-purple-200 text-left group"
                >
                  <div className="text-4xl mb-3">{emotion.emoji}</div>
                  <div className="font-semibold text-gray-800 text-lg">{emotion.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{emotion.desc}</div>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">✨ 什么是情绪镜子？</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                情绪镜子是一个 AI 驱动的情绪分析工具。它会帮助你理解当下的情绪状态，
                发现情绪背后的深层需求，并提供个性化的建议和反思问题。
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Intensity */}
        {step === 'intensity' && selectedEmotion && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">{selectedEmotion.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                这种「{selectedEmotion.name}」的感觉有多强烈？
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              {INTENSITY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setIntensity(level.value)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    intensity === level.value
                      ? 'bg-purple-100 border-2 border-purple-400'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-800">{level.label}</span>
                      <span className="text-gray-500 ml-2">· {level.desc}</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(level.value)].map((_, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: selectedEmotion.color }}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('select')}
                className="flex-1 py-3 px-6 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                返回
              </button>
              <button
                onClick={() => setStep('context')}
                className="flex-1 py-3 px-6 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
              >
                继续
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Context */}
        {step === 'context' && selectedEmotion && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">{selectedEmotion.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                想分享更多背景吗？
              </h2>
              <p className="text-gray-500">可选，帮助 AI 更好地理解你</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap gap-2">
                {REFLECTION_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setContext(context ? `${context}\n\n${prompt}` : prompt)}
                    className="text-sm px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100"
                  >
                    💡 {prompt.slice(0, 15)}...
                  </button>
                ))}
              </div>
              
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="写下你的想法、发生了什么、或者任何想表达的..."
                className="w-full h-40 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep('intensity')}
                className="flex-1 py-3 px-6 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                返回
              </button>
              <button
                onClick={handleAnalyze}
                className="flex-1 py-3 px-6 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
              >
                开始分析 ✨
              </button>
            </div>
          </div>
        )}

        {/* Analyzing */}
        {step === 'analyzing' && selectedEmotion && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 animate-pulse">{selectedEmotion.emoji}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              正在分析你的情绪...
            </h2>
            <div className="flex justify-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Result */}
        {step === 'result' && selectedEmotion && analysis && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div 
              className="bg-white rounded-2xl p-6 shadow-sm border-l-4"
              style={{ borderColor: selectedEmotion.color }}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">{selectedEmotion.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-gray-800 text-lg">{selectedEmotion.name}</span>
                    <span className="text-sm text-gray-500">· 强度 {intensity}/4</span>
                  </div>
                  <p className="text-gray-600">{analysis.summary}</p>
                </div>
              </div>
            </div>

            {/* Insight Card */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-3">🔮 情绪洞察</h3>
              <p className="leading-relaxed">{analysis.insight}</p>
            </div>

            {/* Suggestion Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 text-lg mb-3">💡 建议行动</h3>
              <p className="text-gray-600 leading-relaxed">{analysis.suggestion}</p>
            </div>

            {/* Affirmation Card */}
            <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
              <h3 className="font-bold text-gray-800 text-lg mb-3">🌟 给你的话语</h3>
              <p className="text-gray-700 italic leading-relaxed">"{analysis.affirmation}"</p>
            </div>

            {/* Reflection Questions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 text-lg mb-4">🤔 反思问题</h3>
              <div className="space-y-3">
                {analysis.reflectionQuestions.map((q, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-purple-500 font-bold">{i + 1}.</span>
                    <p className="text-gray-600">{q}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="flex-1 py-3 px-6 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                重新分析
              </button>
              <Link
                href="/write"
                className="flex-1 py-3 px-6 rounded-xl bg-purple-600 text-white text-center hover:bg-purple-700"
              >
                写日记记录
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-4 py-8 text-center text-gray-400 text-sm">
        <p>🧬 ClawDiary · 让每一天都有迹可循</p>
      </footer>
    </div>
  );
}