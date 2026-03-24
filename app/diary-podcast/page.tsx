'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Diary {
  id: string;
  title: string;
  date: string;
  content: string;
  tags?: string[];
}

interface PodcastSegment {
  speaker: 'host1' | 'host2';
  name: string;
  content: string;
  emotion: 'neutral' | 'happy' | 'thoughtful' | 'excited';
}

interface PodcastScript {
  title: string;
  intro: PodcastSegment[];
  mainStory: PodcastSegment[];
  insights: PodcastSegment[];
  outro: PodcastSegment[];
  backgroundMusic: string;
  totalDuration: string;
}

const EMOTION_COLORS = {
  neutral: 'bg-gray-100 text-gray-700',
  happy: 'bg-yellow-100 text-yellow-700',
  thoughtful: 'bg-blue-100 text-blue-700',
  excited: 'bg-orange-100 text-orange-700',
};

const SPEAKER_AVATARS = {
  host1: '🎙️',
  host2: '🎧',
};

export default function DiaryPodcastPage() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [podcastScript, setPodcastScript] = useState<PodcastScript | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<'select' | 'generating' | 'result'>('select');
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      const res = await fetch('/api/diaries');
      const data = await res.json();
      setDiaries(data.slice(0, 10)); // 最近10篇
    } catch (error) {
      // 模拟数据
      setDiaries([
        {
          id: '1',
          title: '今天完成了一个重要项目',
          date: '2026-03-24',
          content: '终于把那个困扰我两周的项目完成了！过程中遇到了很多挑战，但最终都一一克服。特别是那个性能优化的部分，原本以为需要重写整个模块，结果发现只是几个小问题导致的。这让我意识到，有时候问题的根源比想象中简单。',
          tags: ['工作', '成就', '成长']
        },
        {
          id: '2',
          title: '周末的咖啡时光',
          date: '2026-03-23',
          content: '今天和朋友约在了一家新开的咖啡馆。阳光很好，咖啡也很香。我们聊了很多，从工作到生活，从过去到未来。这样的时光让人感到平静和满足。我想，生活的美好往往就藏在这些简单的时刻里。',
          tags: ['生活', '朋友', '放松']
        },
        {
          id: '3',
          title: '关于学习的一点思考',
          date: '2026-03-22',
          content: '今天读到一句话：学习的本质不是记住知识，而是改变思维方式。这让我反思自己的学习习惯。很多时候，我只是在机械地记忆，却没有真正理解。从今天开始，我要改变这个习惯，多问为什么，多思考本质。',
          tags: ['学习', '思考', '成长']
        }
      ]);
    }
  };

  const generatePodcast = async (diary: Diary) => {
    setSelectedDiary(diary);
    setCurrentStep('generating');
    setIsGenerating(true);

    // 模拟生成过程
    const steps = [
      '分析日记内容...',
      '提取关键故事线...',
      '设计对话脚本...',
      '添加情感解说...',
      '生成播客节目...',
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setGenerationProgress((i + 1) / steps.length * 100);
    }

    // 生成播客脚本
    const script: PodcastScript = generateScript(diary);
    setPodcastScript(script);
    setIsGenerating(false);
    setCurrentStep('result');
  };

  const generateScript = (diary: Diary): PodcastScript => {
    const title = `《${diary.title}》- 日记播客`;

    return {
      title,
      intro: [
        {
          speaker: 'host1',
          name: '小播',
          content: `欢迎来到今天的日记播客！我是主持人小播。`,
          emotion: 'happy'
        },
        {
          speaker: 'host2',
          name: '小客',
          content: `我是小客！今天我们要分享的是一篇写于${diary.date}的日记，标题是《${diary.title}》。`,
          emotion: 'neutral'
        },
        {
          speaker: 'host1',
          name: '小播',
          content: `这篇日记记录了一个特别的时刻，让我们一起走进作者的内心世界。`,
          emotion: 'thoughtful'
        }
      ],
      mainStory: [
        {
          speaker: 'host2',
          name: '小客',
          content: `在这篇日记中，作者写道："${diary.content.substring(0, 100)}..."`,
          emotion: 'thoughtful'
        },
        {
          speaker: 'host1',
          name: '小播',
          content: `这段文字让我感受到了作者当时的真实情感。你能感受到那种细腻的心绪吗？`,
          emotion: 'thoughtful'
        },
        {
          speaker: 'host2',
          name: '小客',
          content: `是的，日记最珍贵的地方就在于它记录了那个当下最真实的感受。`,
          emotion: 'neutral'
        },
        {
          speaker: 'host1',
          name: '小播',
          content: `${diary.tags?.length ? `作者给这篇日记打了这些标签：${diary.tags.join('、')}。这些标签揭示了这篇日记的核心主题。` : ''}`,
          emotion: 'excited'
        }
      ],
      insights: [
        {
          speaker: 'host2',
          name: '小客',
          content: `从这篇日记中，我们可以看到作者是一个善于观察和思考的人。`,
          emotion: 'thoughtful'
        },
        {
          speaker: 'host1',
          name: '小播',
          content: `是的！日记不仅仅是记录，更是与自己对话的过程。每一次回顾，都是一次成长。`,
          emotion: 'happy'
        },
        {
          speaker: 'host2',
          name: '小客',
          content: `如果你也在写日记，不妨问问自己：这篇日记记录了什么？它让我学到了什么？`,
          emotion: 'neutral'
        }
      ],
      outro: [
        {
          speaker: 'host1',
          name: '小播',
          content: `感谢大家收听今天的日记播客！希望这篇日记能给你带来一些启发。`,
          emotion: 'happy'
        },
        {
          speaker: 'host2',
          name: '小客',
          content: `如果你也想把自己的日记变成播客，记得关注我们哦！下期再见！`,
          emotion: 'excited'
        }
      ],
      backgroundMusic: '舒缓钢琴曲 - 适合思考和回忆',
      totalDuration: '约 3-5 分钟'
    };
  };

  const renderSegment = (segment: PodcastSegment, index: number) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: segment.speaker === 'host1' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex gap-3 ${segment.speaker === 'host1' ? '' : 'flex-row-reverse'}`}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-lg">
        {SPEAKER_AVATARS[segment.speaker]}
      </div>
      <div className={`flex-1 max-w-[80%] ${segment.speaker === 'host1' ? '' : 'text-right'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-700">{segment.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${EMOTION_COLORS[segment.emotion]}`}>
            {segment.emotion === 'happy' ? '开心' : segment.emotion === 'thoughtful' ? '沉思' : segment.emotion === 'excited' ? '兴奋' : '平静'}
          </span>
        </div>
        <p className="text-gray-600 leading-relaxed bg-white/80 rounded-xl p-3 shadow-sm">
          {segment.content}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-indigo-50 to-pink-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 py-12">
        {/* 头部 */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4"
          >
            🎙️
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            日记播客生成器
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            把你的日记变成精彩的播客节目，双主持人带你回顾每一个故事
          </p>
        </div>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['选择日记', '生成播客', '收听节目'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'select' && index === 0 ? 'bg-purple-500 text-white' :
                currentStep === 'generating' && index === 1 ? 'bg-purple-500 text-white' :
                currentStep === 'result' && index === 2 ? 'bg-purple-500 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {index + 1}
              </div>
              <span className={`ml-2 text-sm ${
                currentStep === 'select' && index === 0 ? 'text-purple-600 font-medium' :
                currentStep === 'generating' && index === 1 ? 'text-purple-600 font-medium' :
                currentStep === 'result' && index === 2 ? 'text-purple-600 font-medium' :
                'text-gray-400'
              }`}>
                {step}
              </span>
              {index < 2 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  (currentStep === 'generating' && index === 0) || (currentStep === 'result' && index <= 1)
                    ? 'bg-purple-300'
                    : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* 选择日记 */}
          {currentStep === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">选择一篇日记</h2>
                <div className="space-y-3">
                  {diaries.map((diary) => (
                    <motion.button
                      key={diary.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => generatePodcast(diary)}
                      className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-100 hover:border-purple-200 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{diary.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{diary.content.substring(0, 60)}...</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-400">{diary.date}</span>
                            {diary.tags?.map(tag => (
                              <span key={tag} className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-purple-400 text-2xl">🎙️</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 生成中 */}
          {currentStep === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="text-6xl mb-6 inline-block"
              >
                🎧
              </motion.div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">正在生成播客脚本...</h2>
              <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-3 mb-4">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${generationProgress}%` }}
                />
              </div>
              <p className="text-gray-500">AI 正在分析你的日记并创作播客内容</p>
            </motion.div>
          )}

          {/* 结果 */}
          {currentStep === 'result' && podcastScript && selectedDiary && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* 播客信息卡片 */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-3xl">
                    🎙️
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{podcastScript.title}</h2>
                    <p className="text-white/80 text-sm">原日记：{selectedDiary.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <span>⏱️ {podcastScript.totalDuration}</span>
                  <span>🎵 {podcastScript.backgroundMusic}</span>
                </div>
              </div>

              {/* 播客脚本 */}
              <div className="space-y-6">
                {/* 开场 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎬</span> 开场白
                  </h3>
                  <div className="space-y-4">
                    {podcastScript.intro.map((seg, i) => renderSegment(seg, i))}
                  </div>
                </div>

                {/* 故事主体 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📖</span> 故事时间
                  </h3>
                  <div className="space-y-4">
                    {podcastScript.mainStory.map((seg, i) => renderSegment(seg, i))}
                  </div>
                </div>

                {/* 洞察 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">💡</span> 深度洞察
                  </h3>
                  <div className="space-y-4">
                    {podcastScript.insights.map((seg, i) => renderSegment(seg, i))}
                  </div>
                </div>

                {/* 结尾 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎉</span> 结束语
                  </h3>
                  <div className="space-y-4">
                    {podcastScript.outro.map((seg, i) => renderSegment(seg, i))}
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentStep('select');
                    setPodcastScript(null);
                    setSelectedDiary(null);
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  生成新播客
                </motion.button>
                <Link
                  href="/growth"
                  className="flex-1 py-3 rounded-xl bg-white/80 text-gray-700 font-medium text-center shadow-lg hover:bg-white transition-all"
                >
                  查看日记
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 功能说明 */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>✨</span> 关于日记播客
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-xl bg-purple-50">
              <div className="font-medium text-purple-700 mb-1">🎙️ 双主持人</div>
              <p className="text-gray-500">两位 AI 主播以对话形式讲述你的日记故事</p>
            </div>
            <div className="p-3 rounded-xl bg-pink-50">
              <div className="font-medium text-pink-700 mb-1">🎬 完整脚本</div>
              <p className="text-gray-500">包含开场、故事、洞察和结尾四大模块</p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50">
              <div className="font-medium text-indigo-700 mb-1">🎵 情感配乐</div>
              <p className="text-gray-500">根据日记内容推荐合适的背景音乐</p>
            </div>
          </div>
        </div>

        {/* 返回链接 */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-purple-500 hover:text-purple-600 text-sm">
            ← 返回首页
          </Link>
        </div>
      </main>
    </div>
  );
}