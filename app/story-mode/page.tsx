import Link from 'next/link'
import { ChevronLeft, BookOpen, Clock, Calendar, Heart, Sparkles } from 'lucide-react'

export default function StoryModePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-purple-100 dark:border-purple-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
              <ChevronLeft className="w-5 h-5" />
              <span>返回</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-500" />
              故事模式
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/50 rounded-full text-purple-700 dark:text-purple-300 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            让你的日记变成精彩故事
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            📖 日记故事模式
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            将你的日记以故事的形式呈现，配合精美的动画效果，重温美好回忆
          </p>
        </div>

        {/* Story Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link href="/story-mode/timeline" className="group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-purple-100 dark:border-purple-800">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              时间线故事
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              按时间顺序播放你的日记，像电影一样回顾生活
            </p>
          </Link>

          <Link href="/story-mode/mood-journey" className="group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-pink-100 dark:border-pink-800">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              心情旅程
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              按心情色彩编织故事，感受情绪的起伏变化
            </p>
          </Link>

          <Link href="/story-mode/highlights" className="group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-orange-100 dark:border-orange-800">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              精彩时刻
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              AI 智能精选你的精彩日记，浓缩美好回忆
            </p>
          </Link>

          <Link href="/story-mode/random" className="group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-blue-100 dark:border-blue-800">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              时光穿梭
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              随机探索过去的日记，发现被遗忘的美好
            </p>
          </Link>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            ✨ 故事模式特色
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🎬</div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">沉浸体验</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                全屏播放，配合背景音乐和动画效果
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎨</div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">主题风格</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                多种故事主题可选，复古、现代、温馨风格
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📤</div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">分享导出</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                生成视频或长图，分享你的故事
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}