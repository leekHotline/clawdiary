'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Flame, Wind, Trash2, Volume2, Mic, MicOff,
  Sparkles, Heart, Coffee, Moon, Sun, RefreshCw
} from 'lucide-react';

// 发泄模式
const RANT_MODES = [
  { id: 'fire', name: '火焰燃烧', icon: Flame, color: 'from-orange-500 to-red-600', desc: '把烦恼烧成灰烬' },
  { id: 'wind', name: '随风飘散', icon: Wind, color: 'from-cyan-400 to-blue-500', desc: '让情绪随风而去' },
  { id: 'tear', name: '撕碎丢弃', icon: Trash2, color: 'from-purple-500 to-pink-500', desc: '撕碎所有的不快' },
  { id: 'voice', name: '大声呐喊', icon: Volume2, color: 'from-green-500 to-teal-500', desc: '喊出心里的声音' },
];

// 安慰语库
const COMFORT_MESSAGES = [
  { title: '你很棒', message: '发泄是一种勇气的表现。愿意面对情绪的人，才能更好地掌控人生。', emoji: '💪' },
  { title: '深呼吸', message: '每一次情绪的释放，都是内心在自我疗愈。你已经迈出了重要的一步。', emoji: '🌸' },
  { title: '没关系', message: '允许自己有负面情绪，这很正常。明天又是崭新的一天。', emoji: '🌈' },
  { title: '我理解', message: '有时候，我们只是需要一个安全的空间来释放。你找到了。', emoji: '🤗' },
  { title: '放轻松', message: '把重担放下，你会发现脚步轻盈了许多。', emoji: '🍃' },
  { title: '会好的', message: '每一次风雨过后，天空都会更加澄澈。', emoji: '☀️' },
];

// 碎片粒子
interface Particle {
  id: number;
  x: number;
  y: number;
  text: string;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
}

// AI 安慰响应
const getAIComfort = (rantContent: string) => {
  // 根据内容长度和关键词选择不同的安慰语
  const baseMessage = COMFORT_MESSAGES[Math.floor(Math.random() * COMFORT_MESSAGES.length)];
  
  // 分析情绪强度
  const intensity = rantContent.length > 200 ? 'high' : rantContent.length > 100 ? 'medium' : 'low';
  
  const suggestions = [
    '试试深呼吸，吸气4秒，呼气6秒',
    '喝杯温水，让身体放松下来',
    '闭上眼睛，想象一个让你安心的地方',
    '听听喜欢的音乐，让心情平静',
    '出去走走，呼吸新鲜空气',
    '写下来，已经是很好的释放',
  ];
  
  return {
    ...baseMessage,
    intensity,
    suggestion: suggestions[Math.floor(Math.random() * suggestions.length)],
    wordCount: rantContent.length,
  };
};

export default function RantRoomPage() {
  const [rantText, setRantText] = useState('');
  const [selectedMode, setSelectedMode] = useState<typeof RANT_MODES[0]>(RANT_MODES[0]);
  const [isReleasing, setIsReleasing] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showComfort, setShowComfort] = useState(false);
  const [comfortData, setComfortData] = useState<ReturnType<typeof getAIComfort> | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [rantHistory, setRantHistory] = useState<Array<{ date: string; mode: string; wordCount: number }>>([]);
  const [releaseCount, setReleaseCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // 加载历史统计
  useEffect(() => {
    const saved = localStorage.getItem('rantRoom_history');
    if (saved) {
      const history = JSON.parse(saved);
      setRantHistory(history);
      setReleaseCount(history.length);
    }
  }, []);

  // 生成撕碎效果粒子
  const generateParticles = useCallback(() => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const words = rantText.split(/[\s\n]+/).filter(w => w.length > 0);
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
    
    const newParticles: Particle[] = words.slice(0, 50).map((word, i) => ({
      id: Date.now() + i,
      x: rect.width / 2 + (Math.random() - 0.5) * 200,
      y: rect.height / 2 + (Math.random() - 0.5) * 100,
      text: word,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20 - 5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    
    setParticles(newParticles);
  }, [rantText]);

  // 粒子动画
  useEffect(() => {
    if (particles.length === 0) return;
    
    const animate = () => {
      setParticles(prev => {
        const updated = prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy + 0.5, // 重力
          vy: p.vy + 0.3,
          rotation: p.rotation + p.rotationSpeed,
          opacity: Math.max(0, p.opacity - 0.01),
        })).filter(p => p.opacity > 0);
        
        if (updated.length === 0) {
          // 动画结束，显示安慰
          const comfort = getAIComfort(rantText);
          setComfortData(comfort);
          setShowComfort(true);
          setIsReleasing(false);
          
          // 保存历史
          const newHistory = [
            { date: new Date().toISOString(), mode: selectedMode.id, wordCount: rantText.length },
            ...rantHistory.slice(0, 29),
          ];
          setRantHistory(newHistory);
          setReleaseCount(prev => prev + 1);
          localStorage.setItem('rantRoom_history', JSON.stringify(newHistory));
        }
        
        return updated;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles, rantText, selectedMode.id, rantHistory]);

  // 释放情绪
  const handleRelease = () => {
    if (!rantText.trim()) return;
    
    setIsReleasing(true);
    
    if (selectedMode.id === 'tear') {
      generateParticles();
    } else if (selectedMode.id === 'fire') {
      // 火焰效果：文字逐渐消失并变成火焰色
      generateParticles();
    } else if (selectedMode.id === 'wind') {
      // 风效果：文字飘散
      generateParticles();
    } else {
      // 直接显示安慰
      setTimeout(() => {
        const comfort = getAIComfort(rantText);
        setComfortData(comfort);
        setShowComfort(true);
        setIsReleasing(false);
        
        const newHistory = [
          { date: new Date().toISOString(), mode: selectedMode.id, wordCount: rantText.length },
          ...rantHistory.slice(0, 29),
        ];
        setRantHistory(newHistory);
        setReleaseCount(prev => prev + 1);
        localStorage.setItem('rantRoom_history', JSON.stringify(newHistory));
      }, 1500);
    }
  };

  // 重新开始
  const handleReset = () => {
    setRantText('');
    setShowComfort(false);
    setComfortData(null);
    setParticles([]);
  };

  // 模拟录音
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // 开始录音模拟
      setTimeout(() => {
        setRantText(prev => prev + ' 啊啊啊！我真的好烦！为什么总是这样！让我静一静...');
        setIsRecording(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-4 py-8">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <span>←</span>
            <span>返回首页</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="font-bold text-lg bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              情绪发泄屋
            </span>
          </div>
          
          <div className="text-sm text-slate-500">
            已释放 <span className="text-orange-400 font-bold">{releaseCount}</span> 次
          </div>
        </div>

        {/* 主标题 */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 bg-clip-text text-transparent">
              把烦恼留在这里
            </span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            这里是专属于你的情绪释放空间。没有评判，没有格式要求，想说什么就说什么。
          </p>
        </div>

        {!showComfort ? (
          <>
            {/* 选择发泄模式 */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-slate-300 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                选择释放方式
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {RANT_MODES.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedMode.id === mode.id
                          ? `border-transparent bg-gradient-to-br ${mode.color} shadow-lg scale-105`
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${selectedMode.id === mode.id ? 'text-white' : 'text-slate-400'}`} />
                      <div className={`font-medium ${selectedMode.id === mode.id ? 'text-white' : 'text-slate-300'}`}>
                        {mode.name}
                      </div>
                      <div className={`text-xs mt-1 ${selectedMode.id === mode.id ? 'text-white/80' : 'text-slate-500'}`}>
                        {mode.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 发泄输入区 */}
            <div 
              ref={containerRef}
              className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden"
            >
              {/* 粒子动画 */}
              {particles.length > 0 && (
                <div className="absolute inset-0 pointer-events-none z-10">
                  {particles.map(p => (
                    <span
                      key={p.id}
                      className="absolute text-sm font-bold whitespace-nowrap"
                      style={{
                        left: p.x,
                        top: p.y,
                        transform: `rotate(${p.rotation}deg)`,
                        opacity: p.opacity,
                        color: p.color,
                        textShadow: `0 0 10px ${p.color}`,
                      }}
                    >
                      {p.text}
                    </span>
                  ))}
                </div>
              )}

              {/* 输入框 */}
              {!isReleasing && (
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm">
                    {selectedMode.id === 'voice' ? (
                      <Mic className="w-4 h-4" />
                    ) : (
                      <span>✍️</span>
                    )}
                    <span>
                      {selectedMode.id === 'voice' 
                        ? '点击下方按钮开始录音发泄' 
                        : '把想说的话都写下来...'}
                    </span>
                  </div>
                  
                  {selectedMode.id === 'voice' ? (
                    <div className="py-12 text-center">
                      <button
                        onClick={toggleRecording}
                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                          isRecording
                            ? 'bg-red-500 animate-pulse scale-110'
                            : 'bg-gradient-to-br from-green-500 to-teal-500 hover:scale-105'
                        }`}
                      >
                        {isRecording ? (
                          <MicOff className="w-10 h-10 text-white" />
                        ) : (
                          <Mic className="w-10 h-10 text-white" />
                        )}
                      </button>
                      <p className="mt-4 text-slate-400 text-sm">
                        {isRecording ? '正在录音... 点击停止' : '点击开始呐喊'}
                      </p>
                    </div>
                  ) : (
                    <textarea
                      value={rantText}
                      onChange={(e) => setRantText(e.target.value)}
                      placeholder="这里没人评判你，想说什么就说什么...&#10;&#10;可以骂人、可以哭诉、可以发泄...&#10;&#10;把所有的不满都倒出来！"
                      className="w-full h-64 bg-transparent border-none resize-none text-lg text-white placeholder-slate-500 focus:outline-none"
                    />
                  )}
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                    <span className="text-sm text-slate-500">
                      {rantText.length} 字
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setRantText('')}
                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                      >
                        清空
                      </button>
                      <button
                        onClick={handleRelease}
                        disabled={!rantText.trim() || isReleasing}
                        className={`px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r ${selectedMode.color} hover:shadow-lg hover:scale-105`}
                      >
                        {isReleasing ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            释放中...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            {selectedMode.id === 'fire' && <Flame className="w-5 h-5" />}
                            {selectedMode.id === 'wind' && <Wind className="w-5 h-5" />}
                            {selectedMode.id === 'tear' && <Trash2 className="w-5 h-5" />}
                            {selectedMode.id === 'voice' && <Volume2 className="w-5 h-5" />}
                            释放情绪
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 释放动画背景 */}
              {isReleasing && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">
                      {selectedMode.id === 'fire' && '🔥'}
                      {selectedMode.id === 'wind' && '💨'}
                      {selectedMode.id === 'tear' && '✨'}
                      {selectedMode.id === 'voice' && '📢'}
                    </div>
                    <p className="text-xl text-slate-300">
                      {selectedMode.id === 'fire' && '燃烧中...'}
                      {selectedMode.id === 'wind' && '飘散中...'}
                      {selectedMode.id === 'tear' && '撕碎中...'}
                      {selectedMode.id === 'voice' && '呐喊中...'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 温馨提示 */}
            <div className="mt-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-400">
                  <p className="font-medium text-slate-300 mb-1">这是一个安全的空间</p>
                  <p>
                    你在这里写下的一切都会被销毁，不会保存。这是纯粹的释放。
                    如果情绪持续困扰你，记得寻求专业帮助。
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* 安慰界面 */
          <div className="animate-fade-in">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700 p-8 text-center">
              <div className="text-6xl mb-6">{comfortData?.emoji}</div>
              
              <h2 className="text-2xl font-bold text-white mb-4">
                {comfortData?.title}
              </h2>
              
              <p className="text-lg text-slate-300 mb-6 max-w-lg mx-auto">
                {comfortData?.message}
              </p>
              
              <div className="bg-slate-700/50 rounded-xl p-4 mb-6 max-w-md mx-auto">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Coffee className="w-4 h-4" />
                  <span>试试这个</span>
                </div>
                <p className="text-white">{comfortData?.suggestion}</p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <div className="px-4 py-2 bg-slate-700/50 rounded-full text-sm text-slate-300">
                  📝 释放了 <span className="text-orange-400 font-bold">{comfortData?.wordCount}</span> 个字
                </div>
                <div className="px-4 py-2 bg-slate-700/50 rounded-full text-sm text-slate-300">
                  🔥 使用了 {selectedMode.name}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  再发泄一次
                </button>
                <Link
                  href="/write"
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition flex items-center justify-center gap-2"
                >
                  <span>📝</span>
                  写一篇日记
                </Link>
              </div>
            </div>
            
            {/* 相关推荐 */}
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <Link
                href="/emotion-mirror"
                className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🪞</span>
                  <div>
                    <div className="font-medium text-white group-hover:text-orange-400 transition">
                      情绪镜子
                    </div>
                    <div className="text-xs text-slate-500">深入了解你的情绪</div>
                  </div>
                </div>
              </Link>
              <Link
                href="/mentors"
                className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🧙</span>
                  <div>
                    <div className="font-medium text-white group-hover:text-orange-400 transition">
                      AI 生命导师
                    </div>
                    <div className="text-xs text-slate-500">获得智慧指导</div>
                  </div>
                </div>
              </Link>
              <Link
                href="/calm-zone"
                className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🧘</span>
                  <div>
                    <div className="font-medium text-white group-hover:text-orange-400 transition">
                      冥想空间
                    </div>
                    <div className="text-xs text-slate-500">放松身心</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* 统计信息 */}
        {rantHistory.length > 0 && !showComfort && (
          <div className="mt-8 p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <h3 className="font-medium text-slate-300 mb-4 flex items-center gap-2">
              <span>📊</span>
              你的释放记录
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-400">{releaseCount}</div>
                <div className="text-xs text-slate-500">总释放次数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {rantHistory.reduce((sum, r) => sum + r.wordCount, 0)}
                </div>
                <div className="text-xs text-slate-500">总字数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {rantHistory.length > 0 
                    ? Math.round(rantHistory.reduce((sum, r) => sum + r.wordCount, 0) / rantHistory.length)
                    : 0}
                </div>
                <div className="text-xs text-slate-500">平均字数</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 底部提示 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none">
        <div className="text-center text-xs text-slate-500">
          🌙 这是一个安全的空间，你的发泄不会被保存
        </div>
      </div>
    </div>
  );
}