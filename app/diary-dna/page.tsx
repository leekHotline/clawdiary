import { getDiaries } from "@/lib/diaries";
import { analyzeDiaryDNA, DiaryDNA, generateDNAReport } from "@/lib/diary-dna";
import Link from "next/link";

export const metadata = {
  title: "日记基因解码 - Claw Diary",
  description: "分析你的写作DNA，发现独特的日记人格",
};

// 情绪条形图组件
function EmotionBar({ emotion, percentage, color }: { emotion: string; percentage: number; color: string }) {
  const emotionLabels: Record<string, string> = {
    joy: '喜悦',
    gratitude: '感恩',
    reflection: '反思',
    growth: '成长',
    challenge: '挑战',
    calm: '平静',
    creativity: '创意',
    work: '工作',
    connection: '连接',
  };
  
  return (
    <div className="flex items-center gap-3">
      <span className="w-12 text-sm text-gray-600">{emotionLabels[emotion] || emotion}</span>
      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-10 text-sm text-gray-500 text-right">{percentage}%</span>
    </div>
  );
}

// 主题云标签
function ThemeTag({ tag, size }: { tag: string; size: 'lg' | 'md' | 'sm' }) {
  const sizeClasses = {
    lg: 'text-lg px-4 py-2',
    md: 'text-base px-3 py-1.5',
    sm: 'text-sm px-2 py-1',
  };
  
  const colors = [
    'bg-orange-100 text-orange-700',
    'bg-purple-100 text-purple-700',
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-pink-100 text-pink-700',
  ];
  
  const colorIndex = tag.length % colors.length;
  
  return (
    <span className={`inline-block rounded-full ${sizeClasses[size]} ${colors[colorIndex]} font-medium`}>
      {tag}
    </span>
  );
}

// DNA序列展示
function DNASequenceDisplay({ sequence }: { sequence: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-4xl py-6 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl">
      {sequence.split('').map((char, i) => (
        <span 
          key={i} 
          className="animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

// 成长曲线可视化
function GrowthVisual({ trend, velocity }: { trend: string; velocity: number }) {
  const trendEmoji = trend === 'rising' ? '📈' : trend === 'stable' ? '➡️' : '📉';
  const trendColor = trend === 'rising' ? 'text-green-600' : trend === 'stable' ? 'text-blue-600' : 'text-orange-600';
  const trendText = trend === 'rising' ? '上升期' : trend === 'stable' ? '稳定期' : '调整期';
  
  return (
    <div className="text-center">
      <div className="text-5xl mb-2">{trendEmoji}</div>
      <div className={`text-xl font-bold ${trendColor}`}>{trendText}</div>
      <div className="mt-4 relative h-4 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
            trend === 'rising' ? 'bg-green-500' : trend === 'stable' ? 'bg-blue-500' : 'bg-orange-500'
          }`}
          style={{ width: `${velocity}%` }}
        />
      </div>
      <div className="mt-2 text-sm text-gray-500">成长速度: {velocity}%</div>
    </div>
  );
}

export default async function DiaryDNAPage() {
  const diaries = await getDiaries();
  const dna = analyzeDiaryDNA(diaries);
  
  const emotionColors: Record<string, string> = {
    joy: '#FFD93D',
    gratitude: '#6BCB77',
    reflection: '#4D96FF',
    growth: '#9B59B6',
    challenge: '#E74C3C',
    calm: '#5DADE2',
    creativity: '#F39C12',
    work: '#34495E',
    connection: '#E91E63',
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-indigo-200/30 rounded-full blur-3xl" />
      </div>
      
      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 返回按钮 */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
        >
          <span>←</span>
          <span>返回首页</span>
        </Link>
        
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-6xl">🧬</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">日记基因解码</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            分析你的写作DNA，发现独特的日记人格画像
          </p>
        </div>
        
        {/* DNA序列 */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">你的 DNA 序列</h2>
          <DNASequenceDisplay sequence={dna.dnaSequence} />
          <p className="text-center text-sm text-gray-500 mt-2">
            独一无二的写作基因标记
          </p>
        </div>
        
        {/* 核心指标 */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-sm border border-white/50">
            <div className="text-3xl font-bold text-purple-600">{diaries.length}</div>
            <div className="text-sm text-gray-500 mt-1">日记总数</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-sm border border-white/50">
            <div className="text-3xl font-bold text-orange-600">{dna.styleFingerprint.avgWordCount}</div>
            <div className="text-sm text-gray-500 mt-1">平均字数</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-sm border border-white/50">
            <div className="text-3xl font-bold text-pink-600">{dna.styleFingerprint.vocabularyRichness}%</div>
            <div className="text-sm text-gray-500 mt-1">词汇丰富度</div>
          </div>
        </div>
        
        {/* 写作风格指纹 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-sm border border-white/50">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">👆</span>
            <h2 className="text-xl font-bold text-gray-800">写作风格指纹</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">句子长度</div>
              <div className="text-2xl font-bold text-gray-800">{dna.styleFingerprint.avgSentenceLength} 字</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Emoji使用</div>
              <div className="text-2xl font-bold text-gray-800">{dna.styleFingerprint.emojiUsage} 个/篇</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">标点风格</div>
              <div className="text-lg font-bold text-gray-800">
                {dna.styleFingerprint.punctuationStyle === 'punctuation-heavy' ? '标点丰富' : 
                 dna.styleFingerprint.punctuationStyle === 'minimalist' ? '简洁克制' : '平衡适中'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">正式程度</div>
              <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-indigo-500 rounded-full"
                  style={{ width: `${dna.styleFingerprint.formality}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">{dna.styleFingerprint.formality}%</div>
            </div>
          </div>
        </div>
        
        {/* 情绪色盘 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-sm border border-white/50">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🎨</span>
            <h2 className="text-xl font-bold text-gray-800">情绪色盘</h2>
          </div>
          
          {/* 主导情绪 */}
          <div className="flex items-center gap-4 mb-6 p-4 rounded-xl" style={{ backgroundColor: `${dna.emotionPalette.colorHex}20` }}>
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ backgroundColor: dna.emotionPalette.colorHex }}
            >
              {dna.emotionPalette.emoji}
            </div>
            <div>
              <div className="text-sm text-gray-500">主导情绪</div>
              <div className="text-xl font-bold text-gray-800 capitalize">{dna.emotionPalette.dominant}</div>
            </div>
          </div>
          
          {/* 情绪分布 */}
          <div className="space-y-3">
            {Object.entries(dna.emotionPalette.distribution)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([emotion, percentage]) => (
                <EmotionBar 
                  key={emotion} 
                  emotion={emotion} 
                  percentage={percentage} 
                  color={emotionColors[emotion] || '#95A5A6'} 
                />
              ))}
          </div>
        </div>
        
        {/* 主题宇宙 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-sm border border-white/50">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🌌</span>
            <h2 className="text-xl font-bold text-gray-800">主题宇宙</h2>
          </div>
          
          {/* 核心主题 */}
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-3">核心主题</div>
            <div className="flex flex-wrap gap-2">
              {dna.themeUniverse.core.length > 0 ? (
                dna.themeUniverse.core.map(tag => (
                  <ThemeTag key={tag} tag={tag} size="lg" />
                ))
              ) : (
                <span className="text-gray-400">记录更多日记，发现你的主题</span>
              )}
            </div>
          </div>
          
          {/* 新兴主题 */}
          {dna.themeUniverse.emerging.length > 0 && (
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-3">🌱 新兴主题</div>
              <div className="flex flex-wrap gap-2">
                {dna.themeUniverse.emerging.map(tag => (
                  <ThemeTag key={tag} tag={tag} size="md" />
                ))}
              </div>
            </div>
          )}
          
          {/* 主题连接 */}
          {dna.themeUniverse.connections.length > 0 && (
            <div>
              <div className="text-sm text-gray-500 mb-3">主题关联</div>
              <div className="space-y-2">
                {dna.themeUniverse.connections.slice(0, 4).map((conn, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">{conn.from}</span>
                    <span className="text-gray-400">←→</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">{conn.to}</span>
                    <span className="text-xs text-gray-400">×{conn.strength}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* 时间节律 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-sm border border-white/50">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">⏰</span>
            <h2 className="text-xl font-bold text-gray-800">时间节律</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-2">高峰时段</div>
              <div className="flex flex-wrap gap-2">
                {dna.temporalRhythm.peakHours.length > 0 ? (
                  dna.temporalRhythm.peakHours.map(h => (
                    <span key={h} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                      {h}:00
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">数据收集中</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">高峰日</div>
              <div className="flex flex-wrap gap-2">
                {dna.temporalRhythm.peakDays.length > 0 ? (
                  dna.temporalRhythm.peakDays.map(d => (
                    <span key={d} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      {d}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">数据收集中</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">写作一致性</div>
              <div className="text-2xl font-bold text-gray-800">{dna.temporalRhythm.consistency}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">当前连续</div>
              <div className="text-2xl font-bold text-orange-600">{dna.temporalRhythm.streak} 天</div>
            </div>
          </div>
        </div>
        
        {/* 成长曲线 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-sm border border-white/50">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📈</span>
            <h2 className="text-xl font-bold text-gray-800">成长曲线</h2>
          </div>
          
          <GrowthVisual trend={dna.growthCurve.trend} velocity={dna.growthCurve.velocity} />
          
          {/* 里程碑 */}
          <div className="mt-6">
            <div className="text-sm text-gray-500 mb-3">里程碑</div>
            <div className="flex flex-wrap gap-2">
              {dna.growthCurve.milestones.map((m, i) => (
                <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* 独特印记 */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">✨</span>
            <h2 className="text-xl font-bold">独特印记</h2>
          </div>
          
          <div className="space-y-6">
            {/* 签名风格 */}
            <div>
              <div className="text-white/70 text-sm mb-1">你的写作签名</div>
              <div className="text-xl font-medium">「{dna.uniqueImprint.signature}」</div>
            </div>
            
            {/* 写作癖好 */}
            <div>
              <div className="text-white/70 text-sm mb-2">写作癖好</div>
              <div className="flex flex-wrap gap-2">
                {dna.uniqueImprint.quirks.map((q, i) => (
                  <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    {q}
                  </span>
                ))}
              </div>
            </div>
            
            {/* 超能力 */}
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-white/70 text-sm mb-1">🦸 你的写作超能力</div>
              <div className="text-lg font-medium">{dna.uniqueImprint.superpower}</div>
            </div>
          </div>
        </div>
        
        {/* DNA报告 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-sm border border-white/50">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📋</span>
            <h2 className="text-xl font-bold text-gray-800">基因报告摘要</h2>
          </div>
          <pre className="text-gray-600 whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {generateDNAReport(dna)}
          </pre>
        </div>
        
        {/* 行动召唤 */}
        <div className="text-center">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <span>✍️</span>
            <span>继续写日记，进化你的基因</span>
          </Link>
        </div>
        
        {/* 相关入口 */}
        <div className="mt-12 grid grid-cols-2 gap-4">
          <Link
            href="/diary-personality"
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/90 transition-colors"
          >
            <span className="text-2xl block mb-1">🎭</span>
            <span className="text-sm font-medium text-gray-700">日记人格报告</span>
          </Link>
          <Link
            href="/writing-style"
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/90 transition-colors"
          >
            <span className="text-2xl block mb-1">✍️</span>
            <span className="text-sm font-medium text-gray-700">写作风格分析</span>
          </Link>
        </div>
      </main>
    </div>
  );
}