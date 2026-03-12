import { NextResponse } from 'next/server'

// 成长阶段配置
const growthStages = [
  { id: 'hatchling', name: '孵化期', level: 1, requirement: 0 },
  { id: 'larva', name: '幼体期', level: 2, requirement: 7 },
  { id: 'juvenile', name: '少年期', level: 3, requirement: 30 },
  { id: 'adult', name: '成年期', level: 4, requirement: 60 },
  { id: 'elder', name: '贤者期', level: 5, requirement: 100 },
  { id: 'transcendent', name: '超凡期', level: 6, requirement: 200 },
  { id: 'legendary', name: '传说期', level: 7, requirement: 365 },
]

export async function GET() {
  // 模拟数据，实际应从数据库获取
  const currentDiaries = 35
  const currentStreak = 7
  const totalWords = 25000
  
  // 计算当前阶段
  let currentStage = growthStages[0]
  let nextStage = growthStages[1]
  
  for (let i = growthStages.length - 1; i >= 0; i--) {
    if (currentDiaries >= growthStages[i].requirement) {
      currentStage = growthStages[i]
      nextStage = growthStages[i + 1] || null
      break
    }
  }
  
  const progress = nextStage 
    ? (currentDiaries / nextStage.requirement) * 100 
    : 100

  return NextResponse.json({
    success: true,
    data: {
      currentStage,
      nextStage,
      progress: Math.min(100, progress),
      stats: {
        totalDiaries: currentDiaries,
        currentStreak,
        totalWords,
        level: currentStage.level,
        exp: currentDiaries * 100, // 每篇日记100经验
        nextLevelExp: nextStage ? nextStage.requirement * 100 : null,
      },
      abilities: getAbilities(currentStage.level),
      milestones: getMilestones(currentDiaries, currentStreak),
    }
  })
}

function getAbilities(level: number) {
  const allAbilities = [
    { level: 1, name: '基础对话', icon: '💬' },
    { level: 1, name: '简单记忆', icon: '🧠' },
    { level: 2, name: '写日记', icon: '📝' },
    { level: 2, name: '情感识别', icon: '❤️' },
    { level: 3, name: '主动建议', icon: '💡' },
    { level: 3, name: '深度理解', icon: '🎯' },
    { level: 4, name: '复杂推理', icon: '🔮' },
    { level: 4, name: '多任务协调', icon: '🤹' },
    { level: 5, name: '创意建议', icon: '🎨' },
    { level: 5, name: '情感陪伴', icon: '🤗' },
    { level: 6, name: '预测需求', icon: '👁️' },
    { level: 6, name: '深度理解', icon: '🧘' },
    { level: 7, name: '创造奇迹', icon: '✨' },
    { level: 7, name: '永恒陪伴', icon: '💫' },
  ]
  
  return allAbilities.filter(a => a.level <= level)
}

function getMilestones(diaries: number, streak: number) {
  const milestones = [
    { id: 'first_diary', name: '第一篇日记', requirement: 1, unlocked: diaries >= 1 },
    { id: 'week_streak', name: '连续7天', requirement: 7, unlocked: streak >= 7 },
    { id: 'ten_diaries', name: '10篇日记', requirement: 10, unlocked: diaries >= 10 },
    { id: 'month_streak', name: '连续30天', requirement: 30, unlocked: streak >= 30 },
    { id: 'fifty_diaries', name: '50篇日记', requirement: 50, unlocked: diaries >= 50 },
    { id: 'hundred_diaries', name: '100篇日记', requirement: 100, unlocked: diaries >= 100 },
    { id: 'year_streak', name: '连续365天', requirement: 365, unlocked: streak >= 365 },
  ]
  
  return milestones
}