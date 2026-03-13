// 挑战系统数据层

export interface ChallengeReward {
  points: number;
  badge?: string | null;
  items?: string[];
}

export interface ChallengeParticipant {
  userId: string;
  joinedAt: Date;
  progress: number;
  completed: boolean;
  completedAt?: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  goal: number;
  unit: string; // 篇日记, 天, 小时, etc.
  duration: number; // 持续天数
  difficulty: "easy" | "normal" | "hard" | "extreme";
  rewards: ChallengeReward;
  startDate: Date;
  endDate?: Date | null;
  creatorId: string;
  isPublic: boolean;
  participants: ChallengeParticipant[];
  completions: number;
  status: "active" | "paused" | "ended";
  createdAt: Date;
  updatedAt: Date;
}

export interface ChallengeCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatar?: string;
  completedChallenges: number;
  totalPoints: number;
  streak: number;
  rank: number;
}

// 内存存储（实际应用应使用数据库）
let challenges: Challenge[] = [];
const challengeProgress: Map<string, Map<string, { current: number; history: { date: Date; increment: number; diaryId?: string }[] }>> = new Map();

// 初始化默认挑战
function initDefaultChallenges() {
  if (challenges.length > 0) return;

  const now = new Date();
  
  challenges = [
    {
      id: "streak-7",
      title: "🔥 7天连续日记",
      description: "坚持7天每天写一篇日记，培养写作习惯",
      category: "streak",
      goal: 7,
      unit: "天",
      duration: 7,
      difficulty: "easy",
      rewards: { points: 50, badge: "🔥 火焰新星" },
      startDate: now,
      creatorId: "system",
      isPublic: true,
      participants: [],
      completions: 0,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "streak-30",
      title: "🌟 30天日记达人",
      description: "连续30天每天记录，养成终身习惯",
      category: "streak",
      goal: 30,
      unit: "天",
      duration: 30,
      difficulty: "hard",
      rewards: { points: 300, badge: "🌟 日记达人" },
      startDate: now,
      creatorId: "system",
      isPublic: true,
      participants: [],
      completions: 0,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "total-10",
      title: "📝 初露锋芒",
      description: "累计发布10篇日记",
      category: "total",
      goal: 10,
      unit: "篇",
      duration: 0, // 无限期
      difficulty: "easy",
      rewards: { points: 30, badge: "📝 笔耕者" },
      startDate: now,
      creatorId: "system",
      isPublic: true,
      participants: [],
      completions: 0,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "total-100",
      title: "📚 百篇巨著",
      description: "累计发布100篇日记，成为真正的作家",
      category: "total",
      goal: 100,
      unit: "篇",
      duration: 0,
      difficulty: "extreme",
      rewards: { points: 1000, badge: "📚 百篇作家" },
      startDate: now,
      creatorId: "system",
      isPublic: true,
      participants: [],
      completions: 0,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "image-5",
      title: "🎨 图文并茂",
      description: "发布5篇带配图的日记",
      category: "creative",
      goal: 5,
      unit: "篇",
      duration: 0,
      difficulty: "normal",
      rewards: { points: 50, badge: "🎨 画师" },
      startDate: now,
      creatorId: "system",
      isPublic: true,
      participants: [],
      completions: 0,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "tag-10",
      title: "🏷️ 标签达人",
      description: "使用10个不同的标签",
      category: "exploration",
      goal: 10,
      unit: "个标签",
      duration: 0,
      difficulty: "normal",
      rewards: { points: 40, badge: "🏷️ 分类专家" },
      startDate: now,
      creatorId: "system",
      isPublic: true,
      participants: [],
      completions: 0,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "word-1000",
      title: "✍️ 千字文",
      description: "写一篇超过1000字的日记",
      category: "creative",
      goal: 1,
      unit: "篇",
      duration: 0,
      difficulty: "normal",
      rewards: { points: 30, badge: "✍️ 文思泉涌" },
      startDate: now,
      creatorId: "system",
      isPublic: true,
      participants: [],
      completions: 0,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "mood-7",
      title: "😊 心情追踪者",
      description: "连续7天记录心情",
      category: "wellness",
      goal: 7,
      unit: "天",
      duration: 7,
      difficulty: "easy",
      rewards: { points: 40, badge: "😊 心情观察家" },
      startDate: now,
      creatorId: "system",
      isPublic: true,
      participants: [],
      completions: 0,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "night-owl",
      title: "🦉 夜猫子写手",
      description: "在深夜(23:00-05:00)发布5篇日记",
      category: "fun",
      goal: 5,
      unit: "篇",
      duration: 0,
      difficulty: "normal",
      rewards: { points: 60, badge: "🦉 夜猫子" },
      startDate: now,
      creatorId: "system",
      isPublic: true,
      participants: [],
      completions: 0,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "early-bird",
      title: "🌅 早起打卡",
      description: "在早晨(05:00-08:00)发布5篇日记",
      category: "fun",
      goal: 5,
      unit: "篇",
      duration: 0,
      difficulty: "normal",
      rewards: { points: 60, badge: "🌅 早起鸟" },
      startDate: now,
      creatorId: "system",
      isPublic: true,
      participants: [],
      completions: 0,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "weekend-4",
      title: "📅 周末作家",
      description: "在周末发布4篇日记",
      category: "fun",
      goal: 4,
      unit: "篇",
      duration: 0,
      difficulty: "easy",
      rewards: { points: 30, badge: "📅 周末作家" },
      startDate: now,
      creatorId: "system",
      isPublic: true,
      participants: [],
      completions: 0,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "share-3",
      title: "💌 分享达人",
      description: "分享3篇日记到社交平台",
      category: "social",
      goal: 3,
      unit: "次分享",
      duration: 0,
      difficulty: "normal",
      rewards: { points: 50, badge: "💌 分享家" },
      startDate: now,
      creatorId: "system",
      isPublic: true,
      participants: [],
      completions: 0,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
  ];
}

// 生成唯一ID
function generateId(): string {
  return `challenge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 获取所有挑战
export async function getChallenges(limit = 20, offset = 0): Promise<Challenge[]> {
  initDefaultChallenges();
  return challenges
    .filter(c => c.isPublic && c.status === "active")
    .slice(offset, offset + limit);
}

// 获取活跃挑战
export async function getActiveChallenges(): Promise<Challenge[]> {
  initDefaultChallenges();
  return challenges.filter(c => c.status === "active" && c.isPublic);
}

// 按类别获取挑战
export async function getChallengesByCategory(category: string): Promise<Challenge[]> {
  initDefaultChallenges();
  return challenges.filter(c => c.category === category && c.status === "active");
}

// 获取挑战详情
export async function getChallengeById(id: string): Promise<Challenge | null> {
  initDefaultChallenges();
  return challenges.find(c => c.id === id) || null;
}

// 创建挑战
export async function createChallenge(data: Omit<Challenge, "id" | "participants" | "completions" | "createdAt" | "updatedAt">): Promise<Challenge> {
  initDefaultChallenges();
  const now = new Date();
  const challenge: Challenge = {
    ...data,
    id: generateId(),
    participants: [],
    completions: 0,
    createdAt: now,
    updatedAt: now,
  };
  challenges.push(challenge);
  return challenge;
}

// 更新挑战
export async function updateChallenge(id: string, data: Partial<Challenge>): Promise<Challenge | null> {
  const index = challenges.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  challenges[index] = {
    ...challenges[index],
    ...data,
    updatedAt: new Date(),
  };
  return challenges[index];
}

// 删除挑战
export async function deleteChallenge(id: string): Promise<boolean> {
  const index = challenges.findIndex(c => c.id === id);
  if (index === -1) return false;
  challenges.splice(index, 1);
  return true;
}

// 加入挑战
export async function joinChallenge(challengeId: string, userId: string): Promise<ChallengeParticipant> {
  const challenge = challenges.find(c => c.id === challengeId);
  if (!challenge) throw new Error("Challenge not found");

  const existing = challenge.participants.find(p => p.userId === userId);
  if (existing) return existing;

  const participant: ChallengeParticipant = {
    userId,
    joinedAt: new Date(),
    progress: 0,
    completed: false,
  };
  challenge.participants.push(participant);
  challenge.updatedAt = new Date();

  return participant;
}

// 退出挑战
export async function leaveChallenge(challengeId: string, userId: string): Promise<void> {
  const challenge = challenges.find(c => c.id === challengeId);
  if (!challenge) return;

  challenge.participants = challenge.participants.filter(p => p.userId !== userId);
  challenge.updatedAt = new Date();
}

// 获取挑战进度
export async function getChallengeProgress(challengeId: string, userId: string): Promise<{ current: number; history: { date: Date; increment: number; diaryId?: string }[] }> {
  if (!challengeProgress.has(challengeId)) {
    challengeProgress.set(challengeId, new Map());
  }
  const userProgress = challengeProgress.get(challengeId)!;
  if (!userProgress.has(userId)) {
    userProgress.set(userId, { current: 0, history: [] });
  }
  return userProgress.get(userId)!;
}

// 更新进度
export async function updateProgress(
  challengeId: string, 
  userId: string, 
  increment: number,
  diaryId?: string
): Promise<{ current: number; history: { date: Date; increment: number; diaryId?: string }[] }> {
  if (!challengeProgress.has(challengeId)) {
    challengeProgress.set(challengeId, new Map());
  }
  const userProgress = challengeProgress.get(challengeId)!;
  if (!userProgress.has(userId)) {
    userProgress.set(userId, { current: 0, history: [] });
  }
  const progress = userProgress.get(userId)!;
  progress.current += increment;
  progress.history.push({ date: new Date(), increment, diaryId });

  return progress;
}

// 完成挑战
export async function completeChallenge(challengeId: string, userId: string): Promise<ChallengeParticipant> {
  const challenge = challenges.find(c => c.id === challengeId);
  if (!challenge) throw new Error("Challenge not found");

  const participant = challenge.participants.find(p => p.userId === userId);
  if (!participant) throw new Error("User not in challenge");

  participant.completed = true;
  participant.completedAt = new Date();
  challenge.completions += 1;
  challenge.updatedAt = new Date();

  return participant;
}

// 获取挑战类别
export async function getChallengeCategories(): Promise<ChallengeCategory[]> {
  return [
    { id: "streak", name: "连续挑战", icon: "🔥", description: "培养持续写作习惯", color: "orange" },
    { id: "total", name: "累计挑战", icon: "📊", description: "达到累计目标", color: "blue" },
    { id: "creative", name: "创意挑战", icon: "🎨", description: "发挥创意写作", color: "purple" },
    { id: "exploration", name: "探索挑战", icon: "🔍", description: "探索新功能", color: "green" },
    { id: "wellness", name: "健康挑战", icon: "💚", description: "身心健康成长", color: "teal" },
    { id: "social", name: "社交挑战", icon: "👥", description: "分享与互动", color: "pink" },
    { id: "fun", name: "趣味挑战", icon: "🎉", description: "有趣的小目标", color: "yellow" },
  ];
}

// 获取推荐挑战
export async function getRecommendedChallenges(): Promise<Challenge[]> {
  initDefaultChallenges();
  // 返回前5个挑战作为推荐
  return challenges
    .filter(c => c.status === "active" && c.isPublic)
    .slice(0, 5);
}

// 获取排行榜
export async function getChallengeLeaderboard(period: string, limit: number): Promise<LeaderboardEntry[]> {
  // 模拟排行榜数据
  return [
    { userId: "user1", userName: "日记达人", completedChallenges: 15, totalPoints: 1250, streak: 30, rank: 1 },
    { userId: "user2", userName: "笔耕不辍", completedChallenges: 12, totalPoints: 980, streak: 21, rank: 2 },
    { userId: "user3", userName: "文思泉涌", completedChallenges: 10, totalPoints: 850, streak: 14, rank: 3 },
    { userId: "user4", userName: "夜猫作家", completedChallenges: 8, totalPoints: 720, streak: 7, rank: 4 },
    { userId: "user5", userName: "早起打卡", completedChallenges: 7, totalPoints: 650, streak: 7, rank: 5 },
    { userId: "user6", userName: "周末写手", completedChallenges: 6, totalPoints: 580, streak: 5, rank: 6 },
    { userId: "user7", userName: "新手作者", completedChallenges: 5, totalPoints: 450, streak: 5, rank: 7 },
    { userId: "user8", userName: "新手", completedChallenges: 3, totalPoints: 280, streak: 3, rank: 8 },
  ].slice(0, limit);
}

// 获取用户参与的挑战
export async function getUserChallenges(userId: string): Promise<{ challenge: Challenge; progress: { current: number } }[]> {
  initDefaultChallenges();
  const result: { challenge: Challenge; progress: { current: number } }[] = [];
  
  for (const challenge of challenges) {
    const participant = challenge.participants.find(p => p.userId === userId);
    if (participant) {
      const progress = await getChallengeProgress(challenge.id, userId);
      result.push({ challenge, progress: { current: progress.current } });
    }
  }
  
  return result;
}