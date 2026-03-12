import { NextResponse } from 'next/server'

// 任务类型定义
type QuestType = 'writing' | 'social' | 'exploration' | 'creativity' | 'mindfulness'
type QuestDifficulty = 'easy' | 'medium' | 'hard'

interface Quest {
  id: string
  title: string
  description: string
  type: QuestType
  difficulty: QuestDifficulty
  target: number
  progress: number
  reward: number
  bonusReward?: number
  icon: string
  category: string
  expiresAt: string
  completedAt?: string
}

