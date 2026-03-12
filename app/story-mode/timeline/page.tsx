'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  ChevronLeft, Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, Maximize, Settings, Heart, Share2,
  ChevronRight, Calendar, Clock
} from 'lucide-react'

interface DiaryEntry {
  id: string
  date: string
  title: string
  content: string
  mood: string
  tags: string[]
  coverImage?: string
}

// Mock data - 实际会从 API 获取
const mockDiaries: DiaryEntry[] = [
  {
    id: '1',
    date: '2026-03-12',
    title: '春日漫步',
    content: '今天阳光很好，在公园里走了很久。樱花开始开放，空气中弥漫着淡淡的花香。遇到了一只可爱的小猫，它主动过来蹭我的腿...',
    mood: 'happy',
    tags: ['春天', '散步', '猫咪'],
    coverImage: '/images/spring-walk.jpg'
  },
  {
    id: '2',
    date: '2026-03-11',
    title: '咖啡馆的下午',
    content: '在街角的咖啡馆坐了一下午，点了一杯拿铁，看着窗外来来往往的人群。有时候，静静地看着世界运转也是一种享受...',
    mood: 'calm',
    tags: ['咖啡', '下午', '放松']
  },
  {
    id: '3',
    date: '2026-03-10',
    title: '完成了一个项目',
    content: '终于完成了这个月的重要项目！虽然过程很辛苦，但看到成果的那一刻，所有的疲惫都消失了。晚上和朋友一起庆祝...',
    mood: 'excited',
    tags: ['工作', '成就', '庆祝']
  }
]

const moodColors: Record<string, string> = {
  happy: 'from-yellow-400 to-orange-400',
  calm: 'from-blue-400 to-cyan-400',
  excited: 'from-pink-400 to-red-400',
  sad: 'from-gray-400 to-gray-600',
  neutral: 'from-gray-300 to-gray-400'
}

const moodEmojis: Record<string, string> = {
  happy: '😊',
  calm: '😌',
  excited: '🎉',
  sad: '😢',
  neutral: '😐'
}

export default function TimelineStoryPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState(5000) // 5秒每篇

  const currentDiary = mockDiaries[currentIndex]
  const progress = ((currentIndex + 1) / mockDiaries.length) * 100

  // 自动播放
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => 
          prev < mockDiaries.length - 1 ? prev + 1 : 0
        )
      }, playbackSpeed)
    }
    return () => clearInterval(timer)
  }, [isPlaying, playbackSpeed])

  // 控制栏自动隐藏
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && showControls) {
      timer = setTimeout(() => setShowControls(false), 3000)
    }
    return () => clearTimeout(timer)
  }, [isPlaying, showControls])

  const handlePrevious = () => {
    setCurrentIndex((prev) => prev > 0 ? prev - 1 : mockDiaries.length - 1)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => prev < mockDiaries.length - 1 ? prev + 1 : 0)
  }

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        handlePrevious()
        break
      case 'ArrowRight':
        handleNext()
        break
      case ' ':
        e.preventDefault()
        setIsPlaying((prev) => !prev)
        break
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      onClick={() => setShowControls(true)}
    >
      {/* Background Gradient based on mood */}
      <div className={`absolute inset-0 bg-gradient-to-br ${moodColors[currentDiary.mood] || moodColors.neutral} opacity-20 transition-all duration-1000`} />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header - only show when controls visible */}
        <header className={`absolute top-0 left-0 right-0 z-20 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-gradient-to-b from-black/50 to-transparent px-4 py-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <Link href="/story-mode" className="flex items-center gap-2 text-white/80 hover:text-white">
                <ChevronLeft className="w-5 h-5" />
                <span>退出故事模式</span>
              </Link>
              <div className="flex items-center gap-4 text-white/80">
                <span className="text-sm">{currentIndex + 1} / {mockDiaries.length}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-2xl w-full">
            {/* Date */}
            <div className="text-center mb-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{currentDiary.date}</span>
                <span className="text-2xl">{moodEmojis[currentDiary.mood]}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8 animate-slide-up">
              {currentDiary.title}
            </h1>

            {/* Content */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 animate-fade-in">
              <p className="text-xl text-white/90 leading-relaxed whitespace-pre-wrap">
                {currentDiary.content}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {currentDiary.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>

        {/* Bottom Controls */}
        <footer className={`absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-gradient-to-t from-black/50 to-transparent px-4 py-4">
            {/* Progress Bar */}
            <div className="max-w-4xl mx-auto mb-4">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Thumbnail navigation */}
              <div className="flex gap-1 mt-2">
                {mockDiaries.map((diary, index) => (
                  <button
                    key={diary.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-1 h-1 rounded-full transition-all ${
                      index === currentIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={handlePrevious}
                className="p-3 text-white/80 hover:text-white transition-colors"
              >
                <SkipBack className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-4 bg-white rounded-full text-gray-900 hover:bg-white/90 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>
              
              <button 
                onClick={handleNext}
                className="p-3 text-white/80 hover:text-white transition-colors"
              >
                <SkipForward className="w-6 h-6" />
              </button>

              <div className="w-px h-6 bg-white/20 mx-2" />

              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <button className="p-2 text-white/80 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>

              <button className="p-2 text-white/80 hover:text-white transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="text-center mt-4 text-white/50 text-xs">
              按 <kbd className="px-1 py-0.5 bg-white/20 rounded">Space</kbd> 播放/暂停 · 
              <kbd className="px-1 py-0.5 bg-white/20 rounded">←</kbd> <kbd className="px-1 py-0.5 bg-white/20 rounded">→</kbd> 切换日记
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}