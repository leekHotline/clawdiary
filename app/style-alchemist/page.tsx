'use client';

import { useState } from 'react';
import Link from 'next/link';

// 风格库
const STYLE_MASTERS = [
  {
    id: 'luxun',
    name: '鲁迅',
    avatar: '🖋️',
    description: '犀利冷峻，一针见血',
    traits: ['讽刺', '犀利', '深刻', '冷峻'],
    example: '我向来不惮以最坏的恶意，来推测中国人的。',
    color: 'from-gray-700 to-gray-900',
  },
  {
    id: 'sanmao',
    name: '三毛',
    avatar: '🏜️',
    description: '浪漫洒脱，自由如风',
    traits: ['浪漫', '自由', '感性', '流浪'],
    example: '如果有来生，要做一棵树，站成永恒。',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'murakami',
    name: '村上春树',
    avatar: '🐱',
    description: '孤独疏离，小确幸',
    traits: ['孤独', '隐喻', '小确幸', '疏离'],
    example: '如果你年轻的时候没有经历过什么痛苦，那你将来就不会有什么真正的幸福。',
    color: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'zhangailing',
    name: '张爱玲',
    avatar: '🌸',
    description: '华丽苍凉，洞彻人心',
    traits: ['华丽', '苍凉', '细腻', '尖锐'],
    example: '生命是一袭华美的袍，爬满了虱子。',
    color: 'from-rose-500 to-pink-700',
  },
  {
    id: 'wangxiaobo',
    name: '王小波',
    avatar: '🐷',
    description: '黑色幽默，特立独行',
    traits: ['幽默', '荒诞', '特立独行', '智慧'],
    example: '人的一切痛苦，本质上都是对自己无能的愤怒。',
    color: 'from-purple-600 to-violet-700',
  },
  {
    id: 'muyan',
    name: '莫言',
    avatar: '🌾',
    description: '魔幻现实，乡土诗意',
    traits: ['乡土', '魔幻', '感官', '狂野'],
    example: '世界上的事情，最忌讳的就是个十全十美。',
    color: 'from-yellow-600 to-red-600',
  },
  {
    id: 'guocheng',
    name: '郭敬明',
    avatar: '✨',
    description: '华丽忧伤，青春疼痛',
    traits: ['华丽', '忧伤', '青春', '浮华'],
    example: '时间没有等我，是你忘了带我走。',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'haizi',
    name: '海子',
    avatar: '🌻',
    description: '纯粹热烈，诗意栖居',
    traits: ['纯粹', '热烈', '理想', '诗性'],
    example: '面朝大海，春暖花开。',
    color: 'from-green-500 to-teal-600',
  },
];

interface TransformResult {
  originalText: string;
  transformedText: string;
  style: typeof STYLE_MASTERS[0];
  insights: string[];
}

export default function StyleAlchemistPage() {
  const [selectedStyle, setSelectedStyle] = useState<typeof STYLE_MASTERS[0] | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);
  const [result, setResult] = useState<TransformResult | null>(null);

  const transformText = async () => {
    if (!selectedStyle || !inputText.trim()) return;
    setIsTransforming(true);

    try {
      const response = await fetch('/api/style-alchemist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          styleId: selectedStyle.id,
          styleName: selectedStyle.name,
          traits: selectedStyle.traits,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        // 离线转换
        const offlineResult = performOfflineTransform(inputText, selectedStyle);
        setResult(offlineResult);
      }
    } catch (error) {
      const offlineResult = performOfflineTransform(inputText, selectedStyle);
      setResult(offlineResult);
    } finally {
      setIsTransforming(false);
    }
  };

  const performOfflineTransform = (text: string, style: typeof STYLE_MASTERS[0]): TransformResult => {
    // 风格转换规则
    const styleTransforms: Record<string, { prefix: string; suffix: string; connectors: string[] }> = {
      luxun: {
        prefix: '我想，',
        suffix: '——这大约就是所谓的人生罢。',
        connectors: ['然而', '可是', '其实', '大抵', '罢了'],
      },
      sanmao: {
        prefix: '记得那天的阳光正好，',
        suffix: '人生就是这样，走着走着就懂了。',
        connectors: ['流浪', '远方', '自由', '遇见', '告别'],
      },
      murakami: {
        prefix: '在某种意义上，',
        suffix: '这或许就是所谓的某种宿命。',
        connectors: ['独自', '某种', '静默', '疏离', '像是'],
      },
      zhangailing: {
        prefix: '生命是一袭华美的袍，',
        suffix: '——可是谁又真正懂得谁呢。',
        connectors: ['苍凉', '华丽', '曲折', '惆怅', '浮华'],
      },
      wangxiaobo: {
        prefix: '说来有趣，',
        suffix: '——这大概就是生活的荒诞之处。',
        connectors: ['有趣的是', '说来', '然而', '倒也', '实在'],
      },
      muyan: {
        prefix: '那是个炎热的下午，',
        suffix: '——就像高密东北乡的每一寸土地都知道的那样。',
        connectors: ['泥土', '血液', '热气', '野性', '味道'],
      },
      guocheng: {
        prefix: '如果时间可以倒流，',
        suffix: '那些我们以为永远不会忘记的，就在念念不忘中遗忘了。',
        connectors: ['温柔', '忧伤', '明媚', '寂寞', '华丽'],
      },
      haizi: {
        prefix: '从明天起，',
        suffix: '——面朝大海，春暖花开。',
        connectors: ['阳光', '麦地', '温暖', '纯粹', '明亮'],
      },
    };

    const transform = styleTransforms[style.id] || styleTransforms.luxun;
    const connector = transform.connectors[Math.floor(Math.random() * transform.connectors.length)];
    
    // 简单转换逻辑
    let transformed = text;
    
    // 添加风格前缀
    if (transform.prefix && !text.startsWith(transform.prefix.substring(0, 4))) {
      transformed = transform.prefix + transformed;
    }
    
    // 在句号处插入风格词汇
    if (text.includes('。')) {
      const sentences = text.split('。');
      if (sentences.length > 1) {
        const insertIndex = Math.min(1, sentences.length - 1);
        sentences[insertIndex] = connector + '，' + sentences[insertIndex];
        transformed = sentences.join('。');
      }
    }
    
    // 添加风格后缀
    if (transform.suffix && !text.endsWith(transform.suffix.substring(transform.suffix.length - 6))) {
      transformed = transformed.replace(/[。！？]?$/, '') + '。' + transform.suffix;
    }

    // 风格洞察
    const insights = [
      `${style.name}的风格特点：${style.traits.join('、')}`,
      `原文本经过风格注入，融入了"${connector}"等标志性元素`,
      `建议：多读${style.name}的作品，体会其独特的表达方式`,
    ];

    return {
      originalText: text,
      transformedText: transformed,
      style,
      insights,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-4 pt-8 pb-16">
        {/* 头部 */}
        <div className="text-center mb-8">
          <Link href="/" className="text-purple-300 text-sm hover:text-white transition-colors">
            ← 返回首页
          </Link>
          <div className="mt-4 text-5xl">⚗️</div>
          <h1 className="text-3xl font-bold text-white mt-4 mb-2">风格炼金术</h1>
          <p className="text-purple-200">将你的文字注入大师灵魂，体验不同写作风格的魔力</p>
        </div>

        {!result ? (
          <>
            {/* 风格选择 */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <span>🎨</span> 选择风格大师
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {STYLE_MASTERS.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={`relative p-4 rounded-xl border transition-all ${
                      selectedStyle?.id === style.id
                        ? 'border-purple-400 bg-purple-500/30 shadow-lg shadow-purple-500/20'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-3xl mb-2">{style.avatar}</div>
                    <div className="font-medium text-white">{style.name}</div>
                    <div className="text-xs text-purple-300 mt-1">{style.description}</div>
                    {selectedStyle?.id === style.id && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 风格详情 */}
            {selectedStyle && (
              <div className={`bg-gradient-to-r ${selectedStyle.color} rounded-xl p-4 mb-6`}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{selectedStyle.avatar}</span>
                  <div>
                    <div className="font-bold text-white text-lg">{selectedStyle.name}风格</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedStyle.traits.map((trait) => (
                        <span key={trait} className="px-2 py-0.5 bg-white/20 rounded text-white text-sm">
                          {trait}
                        </span>
                      ))}
                    </div>
                    <p className="text-white/80 mt-2 text-sm italic">"{selectedStyle.example}"</p>
                  </div>
                </div>
              </div>
            )}

            {/* 输入区域 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <label className="text-purple-200 text-sm mb-3 block">
                输入你想转换的文字（日记片段、随笔、心情记录...）
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="今天天气不错，我在公园里散步，看到很多人在放风筝。突然想起了小时候和爸爸一起放风筝的日子..."
                className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-purple-300 text-sm">{inputText.length}/500字</span>
                <button
                  onClick={transformText}
                  disabled={!selectedStyle || !inputText.trim() || isTransforming}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isTransforming ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      炼金中...
                    </>
                  ) : (
                    <>⚗️ 开始炼金</>
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* 结果展示 */
          <div className="space-y-6">
            <button
              onClick={() => setResult(null)}
              className="text-purple-300 text-sm hover:text-white transition-colors"
            >
              ← 重新炼金
            </button>

            {/* 风格标签 */}
            <div className={`bg-gradient-to-r ${result.style.color} rounded-xl p-4 flex items-center gap-3`}>
              <span className="text-3xl">{result.style.avatar}</span>
              <div>
                <div className="font-bold text-white">{result.style.name}风格</div>
                <div className="text-white/80 text-sm">{result.style.description}</div>
              </div>
            </div>

            {/* 原文 */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="text-purple-300 text-sm mb-2">📜 原始文字</div>
              <p className="text-white/80 leading-relaxed">{result.originalText}</p>
            </div>

            {/* 箭头 */}
            <div className="text-center text-4xl text-purple-400 animate-bounce">↓</div>

            {/* 转换后 */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-5 border border-purple-400/30">
              <div className="text-purple-200 text-sm mb-2">✨ {result.style.name}风格</div>
              <p className="text-white leading-relaxed text-lg">{result.transformedText}</p>
            </div>

            {/* 风格洞察 */}
            <div className="bg-white/10 rounded-xl p-5 border border-white/20">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <span>💡</span> 风格洞察
              </h3>
              <ul className="space-y-2">
                {result.insights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2 text-purple-200">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result.transformedText);
                }}
                className="flex-1 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <span>📋</span> 复制结果
              </button>
              <Link
                href="/chat-diary"
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-center hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>📖</span> 写入日记
              </Link>
            </div>

            {/* 再试一次 */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {STYLE_MASTERS.filter((s) => s.id !== result.style.id)
                .slice(0, 4)
                .map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setSelectedStyle(style);
                      setResult(null);
                    }}
                    className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors text-left"
                  >
                    <span className="text-xl mr-2">{style.avatar}</span>
                    <span className="text-white text-sm">试试{style.name}风格</span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* 底部说明 */}
        <div className="mt-12 text-center">
          <p className="text-purple-300/60 text-sm">
            ⚗️ 风格炼金术 - 让文字在不同灵魂间游走
          </p>
          <p className="text-purple-300/40 text-xs mt-1">
            基于 AI 的写作风格迁移，仅供参考学习
          </p>
        </div>
      </main>
    </div>
  );
}