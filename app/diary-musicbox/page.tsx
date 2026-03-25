'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// 音景类型
const SOUNDSCAPES = [
  { id: 'rain', name: '雨声', emoji: '🌧️', description: '轻柔的雨滴声，适合沉思', color: 'from-blue-400 to-indigo-500' },
  { id: 'ocean', name: '海浪', emoji: '🌊', description: '海浪拍岸，心旷神怡', color: 'from-cyan-400 to-blue-500' },
  { id: 'forest', name: '森林', emoji: '🌲', description: '鸟鸣虫叫，自然之声', color: 'from-green-400 to-emerald-500' },
  { id: 'cafe', name: '咖啡厅', emoji: '☕', description: '轻声交谈，惬意氛围', color: 'from-amber-400 to-orange-500' },
  { id: 'fire', name: '壁炉', emoji: '🔥', description: '噼啪柴火，温暖安心', color: 'from-orange-400 to-red-500' },
  { id: 'night', name: '夜晚', emoji: '🌙', description: '虫鸣蛙叫，宁静夜晚', color: 'from-indigo-400 to-purple-500' },
  { id: 'wind', name: '微风', emoji: '🍃', description: '轻风拂过，沙沙作响', color: 'from-teal-400 to-cyan-500' },
  { id: 'thunder', name: '雷雨', emoji: '⛈️', description: '电闪雷鸣，思绪万千', color: 'from-slate-400 to-gray-600' },
];

// 情绪对应音景
const EMOTION_SOUND_MAP: Record<string, string[]> = {
  'happy': ['cafe', 'forest', 'wind'],
  'calm': ['rain', 'ocean', 'night'],
  'sad': ['rain', 'thunder', 'night'],
  'anxious': ['fire', 'cafe', 'forest'],
  'energetic': ['wind', 'forest', 'cafe'],
  'reflective': ['rain', 'night', 'ocean'],
  'romantic': ['fire', 'night', 'ocean'],
  'creative': ['cafe', 'wind', 'forest'],
};

// 音乐推荐（基于情绪）
const MUSIC_RECOMMENDATIONS: Record<string, { name: string; artist: string; genre: string }[]> = {
  'happy': [
    { name: 'Here Comes the Sun', artist: 'The Beatles', genre: 'Folk Rock' },
    { name: 'Happy', artist: 'Pharrell Williams', genre: 'Pop' },
    { name: 'Walking on Sunshine', artist: 'Katrina & The Waves', genre: 'Pop Rock' },
  ],
  'calm': [
    { name: 'Weightless', artist: 'Marconi Union', genre: 'Ambient' },
    { name: 'Clair de Lune', artist: 'Debussy', genre: 'Classical' },
    { name: 'River Flows in You', artist: 'Yiruma', genre: 'Piano' },
  ],
  'sad': [
    { name: 'Someone Like You', artist: 'Adele', genre: 'Pop' },
    { name: 'Fix You', artist: 'Coldplay', genre: 'Rock' },
    { name: 'The Night We Met', artist: 'Lord Huron', genre: 'Indie' },
  ],
  'reflective': [
    { name: 'Mad World', artist: 'Gary Jules', genre: 'Alternative' },
    { name: 'Landslide', artist: 'Fleetwood Mac', genre: 'Folk Rock' },
    { name: 'Hurt', artist: 'Johnny Cash', genre: 'Country' },
  ],
  'creative': [
    { name: 'Strawberry Swing', artist: 'Coldplay', genre: 'Alternative' },
    { name: 'Breathe Me', artist: 'Sia', genre: 'Electronic' },
    { name: 'Holocene', artist: 'Bon Iver', genre: 'Indie Folk' },
  ],
  'romantic': [
    { name: 'Thinking Out Loud', artist: 'Ed Sheeran', genre: 'Pop' },
    { name: 'At Last', artist: 'Etta James', genre: 'Soul' },
    { name: 'La Vie En Rose', artist: 'Édith Piaf', genre: 'Chanson' },
  ],
};

// 情绪选项
const EMOTIONS = [
  { id: 'happy', name: '开心', emoji: '😊', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'calm', name: '平静', emoji: '😌', color: 'bg-blue-100 text-blue-700' },
  { id: 'sad', name: '忧伤', emoji: '😢', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'anxious', name: '焦虑', emoji: '😰', color: 'bg-orange-100 text-orange-700' },
  { id: 'energetic', name: '充满活力', emoji: '⚡', color: 'bg-green-100 text-green-700' },
  { id: 'reflective', name: '沉思', emoji: '🤔', color: 'bg-purple-100 text-purple-700' },
  { id: 'romantic', name: '浪漫', emoji: '💕', color: 'bg-pink-100 text-pink-700' },
  { id: 'creative', name: '创意迸发', emoji: '🎨', color: 'bg-teal-100 text-teal-700' },
];

export default function DiaryMusicboxPage() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(70);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 获取推荐音景
  const recommendedSoundscapes = selectedEmotion 
    ? EMOTION_SOUND_MAP[selectedEmotion] || []
    : [];

  // 获取音乐推荐
  const musicRecs = selectedEmotion 
    ? MUSIC_RECOMMENDATIONS[selectedEmotion] || []
    : [];

  // 播放/停止音景
  const toggleSound = (soundId: string) => {
    if (playingSound === soundId) {
      setPlayingSound(null);
    } else {
      setPlayingSound(soundId);
    }
  };

  // 设置定时器
  const setSleepTimer = (minutes: number) => {
    setTimer(minutes);
    setTimerRemaining(minutes * 60);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimerRemaining(prev => {
        if (prev && prev <= 1) {
          setPlayingSound(null);
          setTimer(null);
          clearInterval(timerRef.current!);
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* 星空背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[length:50px_50px] opacity-10" />
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🎵</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            日记音乐盒
          </h1>
          <p className="text-purple-200">
            根据心情选择音景，创造沉浸式写作体验
          </p>
        </div>

        {/* 正在播放状态栏 */}
        {playingSound && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-2xl animate-pulse">
                    {SOUNDSCAPES.find(s => s.id === playingSound)?.emoji}
                  </span>
                </div>
                <div>
                  <div className="text-white font-medium">
                    正在播放: {SOUNDSCAPES.find(s => s.id === playingSound)?.name}
                  </div>
                  <div className="text-purple-300 text-sm">
                    {SOUNDSCAPES.find(s => s.id === playingSound)?.description}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* 音量控制 */}
                <div className="flex items-center gap-2">
                  <span className="text-white">🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-20 accent-purple-500"
                  />
                </div>
                
                {/* 定时器 */}
                {timerRemaining && (
                  <div className="text-purple-300 text-sm">
                    ⏱️ {formatTime(timerRemaining)}
                  </div>
                )}
                
                <button
                  onClick={() => setPlayingSound(null)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm transition-colors"
                >
                  停止
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 情绪选择 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>💭</span> 今天的心情是？
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {EMOTIONS.map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => {
                  setSelectedEmotion(emotion.id);
                  setShowRecommendations(true);
                }}
                className={`p-3 rounded-xl text-center transition-all ${
                  selectedEmotion === emotion.id
                    ? 'bg-white/30 scale-105 border-2 border-white/50'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <span className="text-2xl block mb-1">{emotion.emoji}</span>
                <span className="text-white text-sm">{emotion.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI 推荐音景 */}
        {selectedEmotion && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20 animate-fade-in">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>✨</span> AI 推荐音景
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {recommendedSoundscapes.map((soundId) => {
                const soundscape = SOUNDSCAPES.find(s => s.id === soundId);
                if (!soundscape) return null;
                return (
                  <button
                    key={soundId}
                    onClick={() => toggleSound(soundId)}
                    className={`p-4 rounded-xl bg-gradient-to-br ${soundscape.color} transition-all hover:scale-105 ${
                      playingSound === soundId ? 'ring-4 ring-white/50' : ''
                    }`}
                  >
                    <span className="text-3xl block mb-2">{soundscape.emoji}</span>
                    <span className="text-white font-medium block">{soundscape.name}</span>
                    <span className="text-white/70 text-xs">{soundscape.description}</span>
                    {playingSound === soundId && (
                      <div className="mt-2 text-white/80 text-xs flex items-center justify-center gap-1">
                        <span className="animate-pulse">♪</span> 播放中
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 所有音景 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🎧</span> 音景库
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {SOUNDSCAPES.map((soundscape) => (
              <button
                key={soundscape.id}
                onClick={() => toggleSound(soundscape.id)}
                className={`p-4 rounded-xl bg-gradient-to-br ${soundscape.color} transition-all hover:scale-105 ${
                  playingSound === soundscape.id ? 'ring-4 ring-white/50' : ''
                }`}
              >
                <span className="text-2xl block mb-1">{soundscape.emoji}</span>
                <span className="text-white text-sm font-medium">{soundscape.name}</span>
                {playingSound === soundscape.id && (
                  <div className="text-white/80 text-xs mt-1">♪</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 音乐推荐 */}
        {selectedEmotion && showRecommendations && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>🎶</span> 音乐推荐
            </h2>
            <div className="space-y-3">
              {musicRecs.map((track, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white">🎵</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{track.name}</div>
                    <div className="text-purple-300 text-sm">{track.artist}</div>
                  </div>
                  <div className="text-purple-400 text-xs px-2 py-1 bg-purple-500/20 rounded-full">
                    {track.genre}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-purple-300 text-xs mt-4 text-center">
              💡 可在 Spotify、Apple Music 等平台搜索收听
            </p>
          </div>
        )}

        {/* 睡眠定时器 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>⏰</span> 睡眠定时器
          </h2>
          <div className="flex gap-3 flex-wrap">
            {[15, 30, 45, 60, 90].map((mins) => (
              <button
                key={mins}
                onClick={() => setSleepTimer(mins)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  timer === mins
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {mins} 分钟
              </button>
            ))}
            {timer && (
              <button
                onClick={() => {
                  setTimer(null);
                  setTimerRemaining(null);
                  if (timerRef.current) clearInterval(timerRef.current);
                }}
                className="px-4 py-2 rounded-full text-sm bg-red-500/20 text-red-300 hover:bg-red-500/30"
              >
                取消
              </button>
            )}
          </div>
        </div>

        {/* 使用场景 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>💡</span> 推荐场景
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl mb-2">✍️</div>
              <h3 className="text-white font-medium mb-1">写作时</h3>
              <p className="text-purple-300 text-sm">选择咖啡厅或雨声，创造沉浸式写作氛围</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl mb-2">🧘</div>
              <h3 className="text-white font-medium mb-1">冥想时</h3>
              <p className="text-purple-300 text-sm">海浪或森林，配合深呼吸放松身心</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl mb-2">😴</div>
              <h3 className="text-white font-medium mb-1">睡前</h3>
              <p className="text-purple-300 text-sm">夜晚或微风，设置定时器助眠</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl mb-2">📖</div>
              <h3 className="text-white font-medium mb-1">阅读时</h3>
              <p className="text-purple-300 text-sm">壁炉或雨声，营造温暖阅读环境</p>
            </div>
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/chat-diary"
            className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all text-center"
          >
            <span className="text-2xl block mb-2">💬</span>
            <span className="text-white font-medium">写日记</span>
            <span className="text-purple-300 text-xs block">边听边写</span>
          </Link>
          <Link
            href="/emotion-constellation"
            className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all text-center"
          >
            <span className="text-2xl block mb-2">✨</span>
            <span className="text-white font-medium">情绪星座</span>
            <span className="text-purple-300 text-xs block">回顾情绪</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-purple-300 text-sm">
          <p>🎵 日记音乐盒 · 让写作成为一种享受</p>
        </div>
      </div>
    </div>
  );
}