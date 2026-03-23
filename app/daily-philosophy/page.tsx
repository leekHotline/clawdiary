'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PhilosophyEntry {
  date: string
  quote: string
  author: string
  source: string
  interpretation: string
  journalPrompt: string
  userReflection?: string
}

const philosophers = [
  { name: '苏格拉底', era: '古希腊', focus: '自我认知' },
  { name: '马可·奥勒留', era: '古罗马', focus: '斯多葛主义' },
  { name: '老子', era: '中国古代', focus: '道家智慧' },
  { name: '庄子', era: '中国古代', focus: '逍遥自在' },
  { name: '尼采', era: '19世纪', focus: '超人哲学' },
  { name: '康德', era: '启蒙时代', focus: '道德理性' },
  { name: '海德格尔', era: '20世纪', focus: '存在主义' },
  { name: '萨特', era: '20世纪', focus: '自由选择' },
  { name: '加缪', era: '20世纪', focus: '荒诞与反抗' },
  { name: '维特根斯坦', era: '20世纪', focus: '语言哲学' },
  { name: '叔本华', era: '19世纪', focus: '意志与苦难' },
  { name: '柏拉图', era: '古希腊', focus: '理念世界' },
]

const quotes = [
  { quote: '未经审视的人生不值得过。', author: '苏格拉底', source: '申辩篇', interpretation: '苏格拉底认为，真正的智慧来自于对自己思想和行为的持续反思。写日记正是这种自我审视的最好方式。', prompt: '今天你有哪件事值得停下来仔细审视？' },
  { quote: '你有力量掌控自己的思想，而非外界事件。认识到这一点，你就找到了力量。', author: '马可·奥勒留', source: '沉思录', interpretation: '斯多葛主义的核心：我们无法控制外界，但可以控制自己的反应。日记可以帮助我们练习这种控制力。', prompt: '今天有什么事让你感到失控？你能如何改变对它的看法？' },
  { quote: '知人者智，自知者明。', author: '老子', source: '道德经', interpretation: '了解别人是智慧，了解自己才是真正的明白。日记是通往自知之明的道路。', prompt: '今天你对自己有了什么新的认识？' },
  { quote: '那杀不死我的，使我更强大。', author: '尼采', source: '偶像的黄昏', interpretation: '苦难是成长的催化剂。记录下那些困难时刻，你会发现它们如何塑造了今天的你。', prompt: '回想一个曾经的挫折，它如何让你变得更好？' },
  { quote: '他人即地狱。', author: '萨特', source: '禁闭', interpretation: '我们太在意他人的眼光，以至于失去了真实的自我。日记是一个只属于自己的空间，无需在意他人。', prompt: '你最近有没有因为在意他人眼光而改变自己的行为？' },
  { quote: '我们必须想象西西弗斯是幸福的。', author: '加缪', source: '西西弗神话', interpretation: '即使面对无意义的工作和生活，我们也可以选择以自己的方式赋予它意义。日记就是意义的创造者。', prompt: '你的"西西弗斯之石"是什么？你如何让它变得有意义？' },
  { quote: '人是被判定为自由的。', author: '萨特', source: '存在与虚无', interpretation: '自由既是礼物也是负担。我们每时每刻都在选择，日记记录了这些选择的轨迹。', prompt: '今天你做了哪些重要选择？它们反映了什么样的你？' },
  { quote: '世界是我的表象。', author: '叔本华', source: '作为意志和表象的世界', interpretation: '我们感知的世界是我们意识的投射。改变内在，世界随之改变。日记是探索这种内在世界的窗口。', prompt: '你对今天的感知有多少来自于客观现实，多少来自于你的心境？' },
  { quote: '我思故我在。', author: '笛卡尔', source: '第一哲学沉思集', interpretation: '思考是存在的证明。当你写下文字，你不仅存在，而且与自己的存在对话。', prompt: '此刻正在思考的你，是谁？' },
  { quote: '认识你自己。', author: '柏拉图', source: '申辩篇', interpretation: '这句刻在德尔斐神庙的话，是所有智慧的起点。日记是认识自己最踏实的路径。', prompt: '如果要你用一个词描述今天的自己，那是什么？为什么？' },
  { quote: '天地有大美而不言。', author: '庄子', source: '知北游', interpretation: '最美的东西往往无需言语。但日记可以成为我们与这种无声之美对话的桥梁。', prompt: '今天你遇到了什么"大美"？试着用文字捕捉它。' },
  { quote: '语言的边界就是世界的边界。', author: '维特根斯坦', source: '逻辑哲学论', interpretation: '我们能理解的世界受限于我们能表达的语言。扩展语言，就扩展了世界。写日记，就是扩展自己的世界。', prompt: '有什么感受你今天没能用语言表达出来？试着写下来。' },
]

// Helper functions for localStorage initialization
function getTodayQuote() {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  return quotes[dayOfYear % quotes.length]
}

function loadInitialHistory(): PhilosophyEntry[] {
  if (typeof window === 'undefined') return [];
  const savedHistory = localStorage.getItem('philosophy-history');
  return savedHistory ? JSON.parse(savedHistory) : [];
}

function loadInitialEntry(): PhilosophyEntry {
  const todayStr = new Date().toLocaleDateString('zh-CN');
  const history = loadInitialHistory();
  
  // Check if there's an entry for today
  const todayEntry = history.find((e: PhilosophyEntry) => e.date === todayStr);
  if (todayEntry) return todayEntry;
  
  // Create new entry for today
  const today = getTodayQuote();
  return {
    date: todayStr,
    quote: today.quote,
    author: today.author,
    source: today.source,
    interpretation: today.interpretation,
    journalPrompt: today.prompt,
  };
}

function loadInitialReflection(): string {
  const todayStr = new Date().toLocaleDateString('zh-CN');
  const history = loadInitialHistory();
  const todayEntry = history.find((e: PhilosophyEntry) => e.date === todayStr);
  return todayEntry?.userReflection || '';
}

export default function DailyPhilosophy() {
  const [entry, setEntry] = useState<PhilosophyEntry | null>(loadInitialEntry)
  const [reflection, setReflection] = useState(loadInitialReflection)
  const [isGenerating, setIsGenerating] = useState(false)
  const [saved, setSaved] = useState(false)
  const [history, setHistory] = useState<PhilosophyEntry[]>(loadInitialHistory)
  const [showHistory, setShowHistory] = useState(false)

  // 保存反思
  const saveReflection = () => {
    if (!entry) return
    
    const updatedEntry = { ...entry, userReflection: reflection }
    const existingIndex = history.findIndex(e => e.date === entry.date)
    
    let newHistory
    if (existingIndex >= 0) {
      newHistory = [...history]
      newHistory[existingIndex] = updatedEntry
    } else {
      newHistory = [updatedEntry, ...history].slice(0, 30) // 保留最近30天
    }
    
    localStorage.setItem('philosophy-history', JSON.stringify(newHistory))
    setHistory(newHistory)
    setEntry(updatedEntry)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // AI 深度解读
  const generateDeepInsight = async () => {
    if (!entry || !reflection.trim()) return
    setIsGenerating(true)
    
    try {
      const res = await fetch('/api/daily-philosophy/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote: entry.quote,
          author: entry.author,
          reflection: reflection,
        }),
      })
      
      const data = await res.json()
      if (data.insight) {
        const updatedEntry = { ...entry, userReflection: reflection, deepInsight: data.insight }
        setEntry(updatedEntry)
      }
    } catch (error) {
      console.error('Failed to generate insight:', error)
    }
    
    setIsGenerating(false)
  }

  if (!entry) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            每日哲思
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            让千年智慧照亮今天的日记
          </p>
          <div className="mt-2 text-sm text-amber-600 dark:text-amber-400">
            {entry.date}
          </div>
        </motion.div>

        {/* 今日哲思卡片 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-3xl shadow-xl p-8 mb-8"
        >
          {/* 名言 */}
          <div className="text-center mb-8">
            <div className="text-3xl md:text-4xl font-serif text-gray-800 dark:text-white leading-relaxed mb-6">
              "{entry.quote}"
            </div>
            <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
              <span className="font-semibold">{entry.author}</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500 text-sm">《{entry.source}》</span>
            </div>
          </div>

          {/* 解读 */}
          <div className="bg-amber-50 dark:bg-gray-700/50 rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
              <span>💡</span> 哲学解读
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {entry.interpretation}
            </p>
          </div>

          {/* 写作提示 */}
          <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-400 mb-3 flex items-center gap-2">
              <span>✍️</span> 今日写作提示
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {entry.journalPrompt}
            </p>
          </div>

          {/* 用户反思区 */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <span>🪶</span> 我的思考
            </h3>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="写下这句名言给你的启发..."
              className="w-full h-32 p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            
            <div className="flex gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={saveReflection}
                className="flex-1 py-3 px-6 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors"
              >
                {saved ? '✓ 已保存' : '保存思考'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateDeepInsight}
                disabled={isGenerating || !reflection.trim()}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'AI 解读中...' : '🤖 AI 深度解读'}
              </motion.button>
            </div>
          </div>

          {/* AI 深度解读 */}
          <AnimatePresence>
            {(entry as any).deepInsight && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6"
              >
                <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-3 flex items-center gap-2">
                  <span>🔮</span> AI 深度解读
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {(entry as any).deepInsight}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 历史记录 */}
        {history.length > 0 && (
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-2xl p-6">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <span>📚</span> 哲思档案
                <span className="text-sm font-normal text-gray-500">
                  ({history.length}条)
                </span>
              </h3>
              <span className="text-gray-400">{showHistory ? '收起' : '展开'}</span>
            </button>
            
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3"
                >
                  {history.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">{item.date}</span>
                        <span className="text-xs text-amber-600">{item.author}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        "{item.quote}"
                      </p>
                      {item.userReflection && (
                        <p className="mt-2 text-gray-500 dark:text-gray-400 text-xs">
                          我的思考: {item.userReflection.slice(0, 50)}...
                        </p>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* 哲学家画廊 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            今日哲学家 · {entry.author}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {philosophers.map((p, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-xs ${
                  p.name === entry.author
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {p.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}