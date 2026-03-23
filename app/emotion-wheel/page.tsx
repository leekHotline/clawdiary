'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

/**
 * Plutchik 情绪轮
 * 8种基本情绪，每种有3种强度等级
 */
interface Emotion {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  lightColor: string;
  emoji: string;
  description: string;
  intensity: 'high' | 'medium' | 'low';
  relatedEmotions?: string[];
}

interface EmotionFamily {
  base: Emotion;
  variants: {
    intense: Emotion;
    moderate: Emotion;
    mild: Emotion;
  };
  opposite: string;
  angle: number;
}

// Plutchik 8种基本情绪及其变体
const EMOTION_WHEEL: EmotionFamily[] = [
  {
    base: { id: 'joy', name: '喜悦', nameEn: 'Joy', color: '#FFD700', lightColor: '#FFF9E6', emoji: '😊', description: '感受到快乐和满足', intensity: 'medium' },
    variants: {
      intense: { id: 'ecstasy', name: '狂喜', nameEn: 'Ecstasy', color: '#FF6B00', lightColor: '#FFF0E6', emoji: '🤩', description: '极度兴奋，难以自持的快乐', intensity: 'high' },
      moderate: { id: 'joy', name: '喜悦', nameEn: 'Joy', color: '#FFD700', lightColor: '#FFF9E6', emoji: '😊', description: '感受到快乐和满足', intensity: 'medium' },
      mild: { id: 'serenity', name: '宁静', nameEn: 'Serenity', color: '#FFF3B0', lightColor: '#FFFDF5', emoji: '😌', description: '内心平和，感到满足', intensity: 'low' },
    },
    opposite: 'sadness',
    angle: 0,
  },
  {
    base: { id: 'trust', name: '信任', nameEn: 'Trust', color: '#7CB342', lightColor: '#F1F8E9', emoji: '🤝', description: '感到安全和可靠', intensity: 'medium' },
    variants: {
      intense: { id: 'admiration', name: '敬佩', nameEn: 'Admiration', color: '#558B2F', lightColor: '#E8F5E9', emoji: '🙏', description: '深深的敬意和仰慕', intensity: 'high' },
      moderate: { id: 'trust', name: '信任', nameEn: 'Trust', color: '#7CB342', lightColor: '#F1F8E9', emoji: '🤝', description: '感到安全和可靠', intensity: 'medium' },
      mild: { id: 'acceptance', name: '接纳', nameEn: 'Acceptance', color: '#C5E1A5', lightColor: '#F9FBE7', emoji: '✨', description: '开放和包容的心态', intensity: 'low' },
    },
    opposite: 'disgust',
    angle: 45,
  },
  {
    base: { id: 'fear', name: '恐惧', nameEn: 'Fear', color: '#5C6BC0', lightColor: '#E8EAF6', emoji: '😰', description: '感到威胁或不安', intensity: 'medium' },
    variants: {
      intense: { id: 'terror', name: '惊恐', nameEn: 'Terror', color: '#283593', lightColor: '#E8EAF6', emoji: '😱', description: '极度害怕，无法控制', intensity: 'high' },
      moderate: { id: 'fear', name: '恐惧', nameEn: 'Fear', color: '#5C6BC0', lightColor: '#E8EAF6', emoji: '😰', description: '感到威胁或不安', intensity: 'medium' },
      mild: { id: 'apprehension', name: '忧虑', nameEn: 'Apprehension', color: '#9FA8DA', lightColor: '#F5F5FA', emoji: '😟', description: '轻微的担忧和不安', intensity: 'low' },
    },
    opposite: 'anger',
    angle: 90,
  },
  {
    base: { id: 'surprise', name: '惊讶', nameEn: 'Surprise', color: '#AB47BC', lightColor: '#F3E5F5', emoji: '😲', description: '意外和出乎意料', intensity: 'medium' },
    variants: {
      intense: { id: 'amazement', name: '震撼', nameEn: 'Amazement', color: '#7B1FA2', lightColor: '#F3E5F5', emoji: '🤯', description: '完全被震惊', intensity: 'high' },
      moderate: { id: 'surprise', name: '惊讶', nameEn: 'Surprise', color: '#AB47BC', lightColor: '#F3E5F5', emoji: '😲', description: '意外和出乎意料', intensity: 'medium' },
      mild: { id: 'distraction', name: '分心', nameEn: 'Distraction', color: '#CE93D8', lightColor: '#FAF5FF', emoji: '🤔', description: '注意力被打断', intensity: 'low' },
    },
    opposite: 'anticipation',
    angle: 135,
  },
  {
    base: { id: 'sadness', name: '悲伤', nameEn: 'Sadness', color: '#42A5F5', lightColor: '#E3F2FD', emoji: '😢', description: '感到失落和难过', intensity: 'medium' },
    variants: {
      intense: { id: 'grief', name: '悲痛', nameEn: 'Grief', color: '#1565C0', lightColor: '#E3F2FD', emoji: '😭', description: '深刻的丧失感', intensity: 'high' },
      moderate: { id: 'sadness', name: '悲伤', nameEn: 'Sadness', color: '#42A5F5', lightColor: '#E3F2FD', emoji: '😢', description: '感到失落和难过', intensity: 'medium' },
      mild: { id: 'pensiveness', name: '忧郁', nameEn: 'Pensiveness', color: '#90CAF9', lightColor: '#F5F9FF', emoji: '🥺', description: '轻微的伤感', intensity: 'low' },
    },
    opposite: 'joy',
    angle: 180,
  },
  {
    base: { id: 'disgust', name: '厌恶', nameEn: 'Disgust', color: '#66BB6A', lightColor: '#E8F5E9', emoji: '🤢', description: '强烈的排斥感', intensity: 'medium' },
    variants: {
      intense: { id: 'loathing', name: '憎恨', nameEn: 'Loathing', color: '#2E7D32', lightColor: '#E8F5E9', emoji: '😤', description: '极度的厌恶', intensity: 'high' },
      moderate: { id: 'disgust', name: '厌恶', nameEn: 'Disgust', color: '#66BB6A', lightColor: '#E8F5E9', emoji: '🤢', description: '强烈的排斥感', intensity: 'medium' },
      mild: { id: 'boredom', name: '无聊', nameEn: 'Boredom', color: '#A5D6A7', lightColor: '#F1F8E9', emoji: '😑', description: '缺乏兴趣', intensity: 'low' },
    },
    opposite: 'trust',
    angle: 225,
  },
  {
    base: { id: 'anger', name: '愤怒', nameEn: 'Anger', color: '#EF5350', lightColor: '#FFEBEE', emoji: '😠', description: '强烈的生气', intensity: 'medium' },
    variants: {
      intense: { id: 'rage', name: '暴怒', nameEn: 'Rage', color: '#C62828', lightColor: '#FFEBEE', emoji: '🤬', description: '失控的愤怒', intensity: 'high' },
      moderate: { id: 'anger', name: '愤怒', nameEn: 'Anger', color: '#EF5350', lightColor: '#FFEBEE', emoji: '😠', description: '强烈的生气', intensity: 'medium' },
      mild: { id: 'annoyance', name: '烦躁', nameEn: 'Annoyance', color: '#EF9A9A', lightColor: '#FFF5F5', emoji: '😤', description: '轻微的不满', intensity: 'low' },
    },
    opposite: 'fear',
    angle: 270,
  },
  {
    base: { id: 'anticipation', name: '期待', nameEn: 'Anticipation', color: '#FFA726', lightColor: '#FFF3E0', emoji: '🤩', description: '对未来的期盼', intensity: 'medium' },
    variants: {
      intense: { id: 'vigilance', name: '警觉', nameEn: 'Vigilance', color: '#EF6C00', lightColor: '#FFF3E0', emoji: '👀', description: '高度的关注', intensity: 'high' },
      moderate: { id: 'anticipation', name: '期待', nameEn: 'Anticipation', color: '#FFA726', lightColor: '#FFF3E0', emoji: '🤩', description: '对未来的期盼', intensity: 'medium' },
      mild: { id: 'interest', name: '兴趣', nameEn: 'Interest', color: '#FFCC80', lightColor: '#FFF8E1', emoji: '🙂', description: '轻微的好奇', intensity: 'low' },
    },
    opposite: 'surprise',
    angle: 315,
  },
];

// 基于情绪生成日记提示
const generatePrompts = (emotion: Emotion): string[] => {
  const promptsByEmotion: Record<string, string[]> = {
    joy: [
      '是什么让你今天感到快乐？详细描述那个瞬间。',
      '这份喜悦对你意味着什么？它来自内心还是外界？',
      '如何让这份美好的感受延续下去？',
    ],
    trust: [
      '你信任谁？是什么让你能够信任TA？',
      '回想一次被信任的经历，那是什么感觉？',
      '信任对你来说意味着什么？',
    ],
    fear: [
      '你在担心什么？这种担心背后隐藏着什么？',
      '如果最坏的情况发生了，你会如何应对？',
      '有什么可以帮助你感到更安全？',
    ],
    surprise: [
      '今天有什么意外的事情发生？它如何改变了你？',
      '惊喜的感觉如何？你喜欢这种感觉吗？',
      '如果可以预知这件事，你会希望提前知道吗？',
    ],
    sadness: [
      '允许自己感受这份悲伤，它想告诉你什么？',
      '有什么人或事让你想起了过去？',
      '悲伤的另一面是什么？你期待什么？',
    ],
    disgust: [
      '是什么让你感到不舒服？这种感觉来自哪里？',
      '这是你价值观的反应吗？什么对你来说是重要的？',
      '如何远离让你不适的事物？',
    ],
    anger: [
      '是什么触发了你的愤怒？这种愤怒合理吗？',
      '愤怒之下，你真正想要的是什么？',
      '有什么健康的方式来表达这份情绪？',
    ],
    anticipation: [
      '你在期待什么？这个期待对你有多重要？',
      '如果实现了，你会感觉如何？如果没有呢？',
      '你可以做什么让期待更可能实现？',
    ],
  };

  const basePrompts = promptsByEmotion[emotion.id] || promptsByEmotion.joy;
  
  // 根据强度调整提示
  if (emotion.intensity === 'high') {
    return basePrompts.map(p => p + '（深入探索这份强烈的感受）');
  } else if (emotion.intensity === 'low') {
    return basePrompts.map(p => p.replace('详细', '简单').replace('深入', '轻轻'));
  }
  return basePrompts;
};

// 情绪混合建议
const getEmotionBlend = (emotions: Emotion[]): { name: string; description: string } => {
  if (emotions.length === 0) return { name: '平静', description: '内心平和，没有强烈的情绪波动' };
  if (emotions.length === 1) {
    const e = emotions[0];
    return { name: e.name, description: e.description };
  }
  
  // 检查是否有对立情绪
  const emotionIds = emotions.map(e => e.id);
  const hasOpposites = EMOTION_WHEEL.some(family => 
    emotionIds.includes(family.base.id) && emotionIds.includes(family.opposite)
  );
  
  if (hasOpposites) {
    return {
      name: '矛盾交织',
      description: '你正在经历复杂的情绪冲突，这是很正常的体验',
    };
  }
  
  // 混合情绪
  const names = emotions.map(e => e.name).join(' + ');
  return {
    name: names.length > 10 ? names.substring(0, 10) + '...' : names,
    description: `你同时感受到${emotions.map(e => e.name).join('和')}，这是一种丰富的情感体验`,
  };
};

export default function EmotionWheelPage() {
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);
  const [hoveredEmotion, setHoveredEmotion] = useState<Emotion | null>(null);
  const [showPrompts, setShowPrompts] = useState(false);
  const [selectedIntensity, setSelectedIntensity] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const handleEmotionClick = useCallback((emotion: Emotion) => {
    setSelectedEmotions(prev => {
      const exists = prev.find(e => e.id === emotion.id);
      if (exists) {
        return prev.filter(e => e.id !== emotion.id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), emotion];
      }
      return [...prev, emotion];
    });
    setShowPrompts(true);
  }, []);

  const currentBlend = getEmotionBlend(selectedEmotions);
  const currentPrompts = selectedEmotions.length > 0 ? generatePrompts(selectedEmotions[0]) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-5xl mx-auto px-6 py-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <Link href="/" className="text-purple-600 hover:text-purple-700 text-sm mb-4 inline-block">
            ← 返回首页
          </Link>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-4">
            <span className="text-3xl">🎨</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Plutchik 情绪轮盘
          </h1>
          <p className="text-gray-500 mt-2">
            基于 Plutchik 心理学理论，精确识别你的情绪
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左侧：情绪轮盘 */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              {/* 强度选择 */}
              <div className="flex justify-center gap-2 mb-6">
                {[
                  { id: 'all', label: '全部', emoji: '🌈' },
                  { id: 'high', label: '强烈', emoji: '🔥' },
                  { id: 'medium', label: '中等', emoji: '💫' },
                  { id: 'low', label: '轻微', emoji: '✨' },
                ].map(level => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedIntensity(level.id as typeof selectedIntensity)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedIntensity === level.id
                        ? 'bg-purple-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {level.emoji} {level.label}
                  </button>
                ))}
              </div>

              {/* 情绪轮盘 SVG */}
              <div className="relative w-full max-w-md mx-auto aspect-square">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  {/* 中心圆 */}
                  <circle cx="200" cy="200" r="40" fill="url(#centerGradient)" />
                  <text x="200" y="205" textAnchor="middle" className="text-xs fill-gray-600">
                    {currentBlend.name}
                  </text>
                  
                  {/* 渐变定义 */}
                  <defs>
                    <radialGradient id="centerGradient">
                      <stop offset="0%" stopColor="#E879F9" />
                      <stop offset="100%" stopColor="#A855F7" />
                    </radialGradient>
                    {EMOTION_WHEEL.map(family => (
                      <linearGradient key={family.base.id} id={`grad-${family.base.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={family.variants.intense.color} />
                        <stop offset="50%" stopColor={family.variants.moderate.color} />
                        <stop offset="100%" stopColor={family.variants.mild.color} />
                      </linearGradient>
                    ))}
                  </defs>

                  {/* 情绪扇形 */}
                  {EMOTION_WHEEL.map((family, index) => {
                    const startAngle = (family.angle - 22.5) * (Math.PI / 180);
                    const endAngle = (family.angle + 22.5) * (Math.PI / 180);
                    const innerRadius = 50;
                    const outerRadius = 180;
                    
                    const x1 = 200 + innerRadius * Math.cos(startAngle);
                    const y1 = 200 + innerRadius * Math.sin(startAngle);
                    const x2 = 200 + outerRadius * Math.cos(startAngle);
                    const y2 = 200 + outerRadius * Math.sin(startAngle);
                    const x3 = 200 + outerRadius * Math.cos(endAngle);
                    const y3 = 200 + outerRadius * Math.sin(endAngle);
                    const x4 = 200 + innerRadius * Math.cos(endAngle);
                    const y4 = 200 + innerRadius * Math.sin(endAngle);

                    const isSelected = selectedEmotions.some(e => e.id === family.base.id);
                    const isHovered = hoveredEmotion?.id === family.base.id;

                    return (
                      <g key={family.base.id}>
                        <path
                          d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}`}
                          fill={`url(#grad-${family.base.id})`}
                          stroke={isSelected ? '#7C3AED' : 'white'}
                          strokeWidth={isSelected ? 3 : 1}
                          className={`cursor-pointer transition-all duration-200 ${isHovered ? 'opacity-90' : 'opacity-80'}`}
                          onClick={() => handleEmotionClick(family.base)}
                          onMouseEnter={() => setHoveredEmotion(family.base)}
                          onMouseLeave={() => setHoveredEmotion(null)}
                          style={{
                            filter: isHovered ? 'brightness(1.1)' : 'none',
                            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                            transformOrigin: '200px 200px',
                          }}
                        />
                        {/* 情绪标签 */}
                        <text
                          x={200 + 130 * Math.cos(family.angle * Math.PI / 180)}
                          y={200 + 130 * Math.sin(family.angle * Math.PI / 180)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-medium pointer-events-none fill-gray-700"
                        >
                          {family.base.emoji} {family.base.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* 悬浮信息卡 */}
                {hoveredEmotion && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-4 text-center z-10 pointer-events-none">
                    <div className="text-3xl mb-2">{hoveredEmotion.emoji}</div>
                    <div className="font-bold text-gray-800">{hoveredEmotion.name}</div>
                    <div className="text-sm text-gray-500">{hoveredEmotion.nameEn}</div>
                    <div className="text-xs text-gray-400 mt-1">{hoveredEmotion.description}</div>
                  </div>
                )}
              </div>

              {/* 强度变体选择 */}
              {selectedEmotions.length > 0 && (
                <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                  <h3 className="text-sm font-medium text-purple-800 mb-3">调整情绪强度</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {EMOTION_WHEEL.filter(f => selectedEmotions.some(e => e.id === f.base.id)).map(family => (
                      <div key={family.base.id} className="flex gap-1">
                        {[family.variants.mild, family.variants.moderate, family.variants.intense].map((variant, i) => (
                          <button
                            key={variant.id}
                            onClick={() => handleEmotionClick(variant)}
                            className={`px-3 py-1 rounded-full text-xs transition-all ${
                              selectedEmotions.some(e => e.id === variant.id)
                                ? 'bg-purple-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-purple-100'
                            }`}
                            style={{ borderLeft: `3px solid ${variant.color}` }}
                          >
                            {variant.emoji} {variant.name}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：选择结果和提示 */}
          <div className="space-y-6">
            {/* 当前情绪 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>💭</span> 我的情绪
              </h2>
              
              {selectedEmotions.length > 0 ? (
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedEmotions.map(emotion => (
                      <span
                        key={emotion.id}
                        className="px-3 py-1 rounded-full text-white text-sm font-medium flex items-center gap-1"
                        style={{ backgroundColor: emotion.color }}
                      >
                        {emotion.emoji} {emotion.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{currentBlend.description}</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">👆</div>
                  <p>点击情绪轮盘选择你的情绪</p>
                  <p className="text-xs mt-1">最多选择3个</p>
                </div>
              )}
            </div>

            {/* 日记提示 */}
            {showPrompts && selectedEmotions.length > 0 && (
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>✍️</span> 写作提示
                </h2>
                <div className="space-y-3">
                  {currentPrompts.map((prompt, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white/20 rounded-xl backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors"
                      onClick={() => {
                        const encoded = encodeURIComponent(prompt);
                        window.location.href = `/write?prompt=${encoded}`;
                      }}
                    >
                      <p className="text-sm">{prompt}</p>
                      <p className="text-xs text-white/60 mt-1">点击开始写作 →</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 对立情绪说明 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>💡</span> Plutchik 情绪理论
              </h3>
              <ul className="text-xs text-gray-500 space-y-2">
                <li>• 8种基本情绪：喜悦、信任、恐惧、惊讶、悲伤、厌恶、愤怒、期待</li>
                <li>• 每种情绪有3种强度：强烈、中等、轻微</li>
                <li>• 对立情绪：喜悦↔悲伤、信任↔厌恶、恐惧↔愤怒、惊讶↔期待</li>
                <li>• 混合情绪：相邻情绪可组合成更复杂的情感</li>
              </ul>
            </div>

            {/* 快捷操作 */}
            {selectedEmotions.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedEmotions([]);
                    setShowPrompts(false);
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
                >
                  清除选择
                </button>
                <Link
                  href={`/write?mood=${selectedEmotions[0]?.name || 'neutral'}`}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-center hover:shadow-lg transition-all text-sm"
                >
                  开始写日记
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 情绪混合参考表 */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">🧪 情绪混合参考</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {[
              { combo: '喜悦 + 信任', result: '爱', emoji: '❤️' },
              { combo: '信任 + 恐惧', result: '服从', emoji: '🙇' },
              { combo: '恐惧 + 惊讶', result: '敬畏', emoji: '😮' },
              { combo: '惊讶 + 悲伤', result: '失望', emoji: '😞' },
              { combo: '悲伤 + 厌恶', result: '悔恨', emoji: '😔' },
              { combo: '厌恶 + 愤怒', result: '鄙视', emoji: '😤' },
              { combo: '愤怒 + 期待', result: '攻击性', emoji: '💢' },
              { combo: '期待 + 喜悦', result: '乐观', emoji: '🌟' },
            ].map((item, index) => (
              <div key={index} className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl text-center">
                <div className="text-2xl mb-1">{item.emoji}</div>
                <div className="font-medium text-gray-800">{item.result}</div>
                <div className="text-xs text-gray-500">{item.combo}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}