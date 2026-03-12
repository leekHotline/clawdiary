// 健康检查报告相关函数

export interface HealthCheckReport {
  overallScore: number;
  lastCheckDate: string;
  bestWritingTime: string;
  writingTimeDistribution: Array<{ period: string; count: number }>;
  avgCompletionTime: string;
  weekendRatio: number;
  avgReadingTime: number;
  tagUsageRate: number;
  locationUsageRate: number;
  weatherUsageRate: number;
  weeklyTrend: number;
  monthlyTrend: number;
  highestScore: number;
  diariesCount: number;
}

export interface WritingHealthMetrics {
  frequencyScore: number;
  wordCountScore: number;
  diariesCount: number;
  avgWords: number;
  totalWords: number;
  longestDiary: number;
  shortestDiary: number;
}

export interface MoodHealthMetrics {
  stabilityScore: number;
  dominantMood: string;
  positiveRatio: number;
  negativeRatio: number;
  neutralRatio: number;
  distribution: Array<{
    mood: string;
    emoji: string;
    count: number;
    percentage: number;
  }>;
  moodSwings: number;
}

export interface ConsistencyScore {
  score: number;
  streak: number;
  longestStreak: number;
  streakStartDate: string;
  missedDays: number;
}

export interface HealthRecommendation {
  icon: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

// 模拟数据生成函数
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function getHealthCheckReport(): Promise<HealthCheckReport> {
  return {
    overallScore: randomInt(65, 95),
    lastCheckDate: new Date().toLocaleDateString('zh-CN'),
    bestWritingTime: '晚间 21:00-23:00',
    writingTimeDistribution: [
      { period: '早晨', count: 3 },
      { period: '下午', count: 5 },
      { period: '晚间', count: 12 },
    ],
    avgCompletionTime: '18 分钟',
    weekendRatio: 35,
    avgReadingTime: 2.5,
    tagUsageRate: 78,
    locationUsageRate: 45,
    weatherUsageRate: 62,
    weeklyTrend: randomInt(-10, 25),
    monthlyTrend: randomInt(5, 35),
    highestScore: 95,
    diariesCount: randomInt(15, 35),
  };
}

export async function getWritingHealthMetrics(): Promise<WritingHealthMetrics> {
  const diariesCount = randomInt(10, 30);
  const avgWords = randomInt(300, 800);
  
  return {
    frequencyScore: Math.min(100, Math.floor(diariesCount * 3.5)),
    wordCountScore: Math.min(100, Math.floor(avgWords / 5)),
    diariesCount,
    avgWords,
    totalWords: diariesCount * avgWords,
    longestDiary: randomInt(800, 2000),
    shortestDiary: randomInt(50, 200),
  };
}

export async function getMoodHealthMetrics(): Promise<MoodHealthMetrics> {
  const moods = [
    { mood: '开心', emoji: '😊', count: 8, percentage: 32 },
    { mood: '平静', emoji: '😌', count: 6, percentage: 24 },
    { mood: '思考', emoji: '🤔', count: 5, percentage: 20 },
    { mood: '忧郁', emoji: '😢', count: 3, percentage: 12 },
    { mood: '兴奋', emoji: '🤩', count: 3, percentage: 12 },
  ];
  
  return {
    stabilityScore: randomInt(70, 95),
    dominantMood: '开心',
    positiveRatio: 68,
    negativeRatio: 12,
    neutralRatio: 20,
    distribution: moods,
    moodSwings: randomInt(0, 5),
  };
}

export async function getConsistencyScore(): Promise<ConsistencyScore> {
  const streak = randomInt(1, 30);
  
  return {
    score: Math.min(100, streak * 3 + 40),
    streak,
    longestStreak: randomInt(streak, streak + 20),
    streakStartDate: new Date(Date.now() - streak * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN'),
    missedDays: randomInt(0, 5),
  };
}

export async function getHealthRecommendations(): Promise<HealthRecommendation[]> {
  return [
    {
      icon: '⏰',
      title: '固定写作时间',
      description: '建议在晚间 21:00 写作，这是你的最佳时段',
      priority: 'high',
    },
    {
      icon: '📍',
      title: '添加地点信息',
      description: '地点记录率较低，添加地点可以丰富日记回忆',
      priority: 'medium',
    },
    {
      icon: '🏷️',
      title: '使用标签分类',
      description: '标签有助于日记分类和检索',
      priority: 'low',
    },
    {
      icon: '🔥',
      title: '保持连续写作',
      description: '当前连续写作天数不错，继续保持！',
      priority: 'low',
    },
  ];
}

// 计算综合健康分数
export function calculateOverallHealth(
  writing: WritingHealthMetrics,
  mood: MoodHealthMetrics,
  consistency: ConsistencyScore
): number {
  const weights = {
    frequency: 0.35,
    wordCount: 0.15,
    mood: 0.25,
    consistency: 0.25,
  };

  return Math.round(
    writing.frequencyScore * weights.frequency +
    writing.wordCountScore * weights.wordCount +
    mood.stabilityScore * weights.mood +
    consistency.score * weights.consistency
  );
}