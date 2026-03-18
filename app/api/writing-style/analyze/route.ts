import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface WordCount {
  word: string
  count: number
}

interface PhraseCount {
  phrase: string
  count: number
}

interface SentenceStarter {
  starter: string
  count: number
}

interface Suggestion {
  type: 'strength' | 'improvement' | 'tip'
  title: string
  content: string
  icon: string
}

function analyzeText(text: string) {
  // 去除Markdown标记和特殊字符
  const cleanText = text.replace(/[#*_`\[\]]/g, '').replace(/\s+/g, ' ')
  
  // 分词（简单处理中英文）
  const words = cleanText.split(/[\s，。！？、；：""''（）【】《》\n]+/).filter(w => w.length > 0)
  const sentences = cleanText.split(/[。！？\n]+/).filter(s => s.trim().length > 0)
  
  return { words, sentences, cleanText }
}

function getFormalityScore(text: string, words: string[]): number {
  // 基于句式和用词评估正式度
  const formalMarkers = ['因此', '然而', '此外', '综上所述', '由此可见', '值得注意的是']
  const informalMarkers = ['哈哈', '嘿嘿', '哎呀', '嘛', '咯', '啦', '呢', '吧']
  
  let score = 50 // 基准分数
  
  formalMarkers.forEach(marker => {
    const count = (text.match(new RegExp(marker, 'g')) || []).length
    score += count * 3
  })
  
  informalMarkers.forEach(marker => {
    const count = (text.match(new RegExp(marker, 'g')) || []).length
    score -= count * 2
  })
  
  return Math.max(0, Math.min(100, score))
}

function getEmotionalTone(text: string): number {
  // 基于情感词汇评估情感表达程度
  const emotionalWords = ['开心', '快乐', '幸福', '感动', '悲伤', '难过', '愤怒', '焦虑', '担心', '期待', '兴奋', '满足']
  const intensityMarkers = ['非常', '特别', '极其', '相当', '真的', '十分']
  
  let score = 40 // 基准分数
  
  emotionalWords.forEach(word => {
    const count = (text.match(new RegExp(word, 'g')) || []).length
    score += count * 5
  })
  
  intensityMarkers.forEach(marker => {
    const count = (text.match(new RegExp(marker, 'g')) || []).length
    score += count * 3
  })
  
  return Math.max(0, Math.min(100, score))
}

function getDescriptivenessScore(text: string, words: string[]): number {
  // 基于形容词和描述性词汇评估描写丰富度
  const descriptiveWords = ['美丽', '漂亮', '温暖', '明亮', '宁静', '热闹', '清新', '柔和', '灿烂', '朦胧', '优雅', '精致']
  const sensoryWords = ['看到', '听到', '闻到', '触摸', '感觉', '感受到', '品尝']
  
  let score = 30 // 基准分数
  
  descriptiveWords.forEach(word => {
    const count = (text.match(new RegExp(word, 'g')) || []).length
    score += count * 4
  })
  
  sensoryWords.forEach(word => {
    const count = (text.match(new RegExp(word, 'g')) || []).length
    score += count * 3
  })
  
  // 长句子通常有更多描写
  const avgSentenceLength = words.length / Math.max(1, text.split(/[。！？\n]+/).filter(s => s.trim()).length)
  if (avgSentenceLength > 15) score += 10
  if (avgSentenceLength > 20) score += 10
  
  return Math.max(0, Math.min(100, score))
}

function getSentenceVarietyScore(sentences: string[]): number {
  // 分析句式多样性
  if (sentences.length < 5) return 50
  
  const lengths = sentences.map(s => s.length)
  const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length
  const variance = lengths.reduce((a, b) => a + Math.pow(b - avgLength, 2), 0) / lengths.length
  
  // 标准差越大，多样性越高
  const stdDev = Math.sqrt(variance)
  return Math.min(100, Math.floor(30 + stdDev * 3))
}

function getReadabilityScore(text: string, sentences: string[], words: string[]): number {
  // 基于句子长度和词汇复杂度评估可读性
  const avgSentenceLength = words.length / Math.max(1, sentences.length)
  
  // 最佳句子长度在 15-25 之间
  let score = 100 - Math.abs(avgSentenceLength - 20) * 2
  
  // 短句子增加可读性
  const shortSentences = sentences.filter(s => s.length < 15).length
  score += shortSentences * 0.5
  
  return Math.max(0, Math.min(100, Math.floor(score)))
}

function extractCommonPhrases(text: string, phrases: Map<string, number>): void {
  // 提取2-4字的常用短语
  const patterns = [
    /觉得.{1,4}/g,
    /感觉.{1,4}/g,
    /发现.{1,4}/g,
    /想到.{1,4}/g,
    /看到.{1,4}/g,
    /希望.{1,4}/g,
    /决定.{1,4}/g
  ]
  
  patterns.forEach(pattern => {
    const matches = text.match(pattern) || []
    matches.forEach(match => {
      if (match.length >= 3 && match.length <= 6) {
        phrases.set(match, (phrases.get(match) || 0) + 1)
      }
    })
  })
}

function extractSentenceStarters(text: string, starters: Map<string, number>): void {
  const sentences = text.split(/[。！？\n]+/).filter(s => s.trim().length > 0)
  
  sentences.forEach(sentence => {
    const firstWords = sentence.trim().slice(0, 4)
    if (firstWords.length >= 2) {
      starters.set(firstWords, (starters.get(firstWords) || 0) + 1)
    }
  })
}

function analyzePunctuation(text: string): { type: string; count: number }[] {
  return [
    { type: '，', count: (text.match(/，/g) || []).length },
    { type: '。', count: (text.match(/。/g) || []).length },
    { type: '！', count: (text.match(/！/g) || []).length },
    { type: '？', count: (text.match(/？/g) || []).length },
    { type: '、', count: (text.match(/、/g) || []).length },
    { type: '"', count: (text.match(/["""]/g) || []).length },
    { type: '……', count: (text.match(/……/g) || []).length }
  ]
}

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    
    if (!fs.existsSync(dataDir)) {
      return NextResponse.json({ 
        success: false,
        error: '数据目录不存在' 
      }, { status: 500 })
    }

    const dayFiles = fs.readdirSync(dataDir)
      .filter(f => f.startsWith('day') && f.endsWith('.ts'))
      .sort((a, b) => {
        const numA = parseInt(a.replace('day', '').replace('.ts', ''))
        const numB = parseInt(b.replace('day', '').replace('.ts', ''))
        return numB - numA
      })

    if (dayFiles.length === 0) {
      return NextResponse.json({ 
        success: false,
        error: '没有找到日记数据' 
      }, { status: 404 })
    }

    // 统计变量
    let totalWords = 0
    const allWords: string[] = []
    const allSentences: string[] = []
    let allText = ''
    const wordCounts: Map<string, number> = new Map()
    const rareWords: Set<string> = new Set()
    const phraseCounts: Map<string, number> = new Map()
    const sentenceStarters: Map<string, number> = new Map()
    
    // 每月数据
    const monthlyData: Map<string, { words: number; uniqueWords: Set<string> }> = new Map()
    
    // 分析每个文件
    dayFiles.forEach(file => {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf-8')
      
      // 提取内容（简单处理）
      const contentMatch = content.match(/content:\s*`([^`]*)`/) || 
                          content.match(/content:\s*'([^']*)'/) ||
                          content.match(/content:\s*"([^"]*)"/)
      
      if (contentMatch) {
        const diaryContent = contentMatch[1]
        allText += diaryContent + '\n'
        
        const { words, sentences } = analyzeText(diaryContent)
        totalWords += words.length
        allWords.push(...words)
        allSentences.push(...sentences)
        
        // 统计词汇
        words.forEach(word => {
          if (word.length >= 2) {
            wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
          }
        })
        
        // 提取短语和句子开头
        extractCommonPhrases(diaryContent, phraseCounts)
        extractSentenceStarters(diaryContent, sentenceStarters)
        
        // 月度数据
        const dayNum = parseInt(file.replace('day', '').replace('.ts', ''))
        const month = Math.ceil(dayNum / 30)
        const monthKey = `第${month}月`
        
        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, { words: 0, uniqueWords: new Set() })
        }
        const monthData = monthlyData.get(monthKey)!
        monthData.words += words.length
        words.forEach(w => {
          if (w.length >= 2) monthData.uniqueWords.add(w)
        })
      }
    })

    // 词汇分析
    const uniqueWords = wordCounts.size
    const vocabularyRichness = uniqueWords / Math.max(1, totalWords)
    const avgSentenceLength = Math.round(allWords.length / Math.max(1, allSentences.length))
    
    // 高频词汇（排除常见词）
    const stopWords = new Set(['的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '那', '但', '还', '能', '他', '她', '它', '这个', '那个', '什么', '怎么'])
    const topWords: WordCount[] = Array.from(wordCounts.entries())
      .filter(([word]) => !stopWords.has(word) && word.length >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count]) => ({ word, count }))

    // 稀有词汇（使用次数少但有意义的词）
    const rareWordList = Array.from(wordCounts.entries())
      .filter(([word, count]) => count === 1 && word.length >= 2 && !stopWords.has(word))
      .map(([word]) => word)
      .slice(0, 15)

    // 风格分析
    const formality = getFormalityScore(allText, allWords)
    const emotionalTone = getEmotionalTone(allText)
    const descriptiveness = getDescriptivenessScore(allText, allWords)
    const sentenceVariety = getSentenceVarietyScore(allSentences)
    const readability = getReadabilityScore(allText, allSentences, allWords)

    // 常用短语
    const commonPhrases: PhraseCount[] = Array.from(phraseCounts.entries())
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([phrase, count]) => ({ phrase, count }))

    // 句子开头
    const starters: SentenceStarter[] = Array.from(sentenceStarters.entries())
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([starter, count]) => ({ starter, count }))

    // 标点符号统计
    const punctuation = analyzePunctuation(allText)

    // 风格演变数据
    const months = Array.from(monthlyData.entries()).sort((a, b) => {
      const numA = parseInt(a[0].replace('第', '').replace('月', ''))
      const numB = parseInt(b[0].replace('第', '').replace('月', ''))
      return numA - numB
    })
    
    const evolution = months.map(([month, data], index) => ({
      month,
      wordCount: data.words,
      vocabularyGrowth: data.uniqueWords.size,
      styleScore: Math.min(100, 40 + data.words / 100 + data.uniqueWords.size / 10)
    }))

    // 写作人格分析
    const traits = [
      { name: '内省深度', score: Math.min(100, Math.round((formality + descriptiveness) / 2)) },
      { name: '情感表达', score: emotionalTone },
      { name: '创意指数', score: Math.min(100, Math.round((descriptiveness + sentenceVariety) / 2)) },
      { name: '逻辑性', score: Math.min(100, Math.round((formality + readability) / 2)) },
      { name: '故事感', score: Math.min(100, Math.round((descriptiveness + emotionalTone) / 2)) }
    ]

    // 写作声音判断
    let writingVoice = '细腻的记录者'
    if (emotionalTone > 70 && descriptiveness > 60) {
      writingVoice = '热情的讲述者'
    } else if (formality > 70) {
      writingVoice = '严谨的思考者'
    } else if (descriptiveness > 70) {
      writingVoice = '诗意的观察者'
    } else if (emotionalTone < 40) {
      writingVoice = '冷静的分析者'
    }

    // 沟通风格
    let communicationStyle = '你的文字简洁有力，善于用精炼的语言表达深刻的想法。'
    if (emotionalTone > 60 && descriptiveness > 50) {
      communicationStyle = '你的文字充满温度，善于用生动的描写传达情感，让读者身临其境。'
    } else if (formality > 60) {
      communicationStyle = '你的文字条理清晰，逻辑性强，善于用结构化的方式阐述观点。'
    } else if (sentenceVariety > 60) {
      communicationStyle = '你的文字节奏感强，善于用多样的句式保持读者的兴趣。'
    }

    // 生成建议
    const suggestions: Suggestion[] = [
      {
        type: 'strength',
        title: '写作优势',
        content: `你的词汇丰富度达到 ${vocabularyRichness.toFixed(2)}，展现了良好的语言运用能力。平均每句 ${avgSentenceLength} 字，节奏把握得当。`,
        icon: '💪'
      }
    ]

    if (descriptiveness > 60) {
      suggestions.push({
        type: 'strength',
        title: '描写能力强',
        content: '你善于运用细节描写，让文字更有画面感和感染力。继续保持这种观察生活的习惯。',
        icon: '🎨'
      })
    }

    if (emotionalTone < 50) {
      suggestions.push({
        type: 'improvement',
        title: '情感表达提升',
        content: '可以尝试在日记中加入更多内心感受的描写，记录当下的情绪变化会让日记更有温度。',
        icon: '❤️'
      })
    }

    if (sentenceVariety < 50) {
      suggestions.push({
        type: 'improvement',
        title: '句式多样化',
        content: '尝试使用更多变化的句式，长句与短句交替，会让阅读体验更加流畅有趣。',
        icon: '📝'
      })
    }

    suggestions.push({
      type: 'tip',
      title: '写作建议',
      content: '每天尝试使用一个新的表达方式或词汇，持续拓展你的写作工具箱。',
      icon: '💡'
    })

    return NextResponse.json({
      success: true,
      data: {
        vocabulary: {
          totalWords,
          uniqueWords,
          vocabularyRichness,
          avgSentenceLength,
          topWords,
          rareWords: rareWordList
        },
        style: {
          formality,
          emotionalTone,
          descriptiveness,
          sentenceVariety,
          readability
        },
        patterns: {
          commonPhrases,
          sentenceStarters: starters,
          punctuation
        },
        evolution,
        suggestions,
        personality: {
          traits,
          writingVoice,
          communicationStyle
        }
      }
    })
  } catch {
    return NextResponse.json({ 
      success: false,
      error: '分析失败，请稍后重试' 
    }, { status: 500 })
  }
}