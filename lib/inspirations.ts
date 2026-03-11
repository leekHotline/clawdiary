// 灵感库数据层

export interface Inspiration {
  id: string;
  title: string;
  content: string;
  category: InspirationCategory;
  tags: string[];
  author?: string;
  source?: string;
  likes: number;
  saves: number;
  isPublic: boolean;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InspirationCategory = 
  | "quote"      // 名言金句
  | "prompt"     // 写作提示
  | "theme"      // 写作主题
  | "word"       // 精彩词汇
  | "image"      // 图片灵感
  | "story"      // 故事种子
  | "question"   // 思考问题
  | "method";    // 写作方法

export interface InspirationCategoryInfo {
  id: InspirationCategory;
  name: string;
  icon: string;
  description: string;
  color: string;
}

// 内存存储
let inspirations: Inspiration[] = [];
let userSaves: Map<string, Set<string>> = new Map(); // userId -> inspirationIds
let userLikes: Map<string, Set<string>> = new Map();

// 初始化默认灵感
function initDefaultInspirations() {
  if (inspirations.length > 0) return;

  const now = new Date();
  
  inspirations = [
    // 名言金句
    {
      id: "quote-1",
      title: "关于时间",
      content: "时间是最公平的，每个人每天都有24小时。区别在于，你如何使用它。",
      category: "quote",
      tags: ["时间", "人生", "成长"],
      author: "佚名",
      likes: 128,
      saves: 45,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "quote-2",
      title: "关于写作",
      content: "写作是一种思考的方式，也是一种与自己对话的方式。",
      category: "quote",
      tags: ["写作", "思考", "创作"],
      author: "乔治·奥威尔",
      likes: 89,
      saves: 32,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "quote-3",
      title: "关于生活",
      content: "生活不是等待暴风雨过去，而是学会在雨中跳舞。",
      category: "quote",
      tags: ["生活", "勇气", "态度"],
      author: "维维安·格林",
      likes: 156,
      saves: 67,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
    // 写作提示
    {
      id: "prompt-1",
      title: "童年回忆",
      content: "写下你童年最深刻的记忆，当时的感受如何？现在回想起来有什么新的感悟？",
      category: "prompt",
      tags: ["回忆", "童年", "成长"],
      likes: 78,
      saves: 56,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "prompt-2",
      title: "如果可以重来",
      content: "如果可以回到过去的某个时刻，你会选择什么时候？你会做出不同的选择吗？",
      category: "prompt",
      tags: ["假设", "选择", "人生"],
      likes: 92,
      saves: 43,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "prompt-3",
      title: "给未来的自己",
      content: "写一封信给5年后的自己，说说你现在的期待、担忧和希望。",
      category: "prompt",
      tags: ["未来", "自我", "期待"],
      likes: 134,
      saves: 89,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "prompt-4",
      title: "城市漫步",
      content: "描述你生活的城市，它给你什么样的感觉？你最喜欢它的哪个角落？",
      category: "prompt",
      tags: ["城市", "生活", "观察"],
      likes: 45,
      saves: 28,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
    // 写作主题
    {
      id: "theme-1",
      title: "成长的代价",
      content: "探索成长过程中失去的东西，以及那些值得付出的代价。",
      category: "theme",
      tags: ["成长", "人生", "感悟"],
      likes: 67,
      saves: 34,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "theme-2",
      title: "平凡的一天",
      content: "记录一个普通日子里的细微瞬间，发现平凡中的美好。",
      category: "theme",
      tags: ["日常", "观察", "美好"],
      likes: 54,
      saves: 29,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "theme-3",
      title: "人与人的连接",
      content: "思考人与人之间的关系，那些短暂的相遇和长久的羁绊。",
      category: "theme",
      tags: ["关系", "情感", "连接"],
      likes: 89,
      saves: 45,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
    // 故事种子
    {
      id: "story-1",
      title: "神秘的来信",
      content: "你收到一封没有寄件人的信，信中只有一个地址和一个日期...",
      category: "story",
      tags: ["悬疑", "故事", "想象"],
      likes: 123,
      saves: 78,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "story-2",
      title: "时间商店",
      content: "街角新开了一家店，可以用时间交换任何东西，但代价是...",
      category: "story",
      tags: ["奇幻", "时间", "选择"],
      likes: 145,
      saves: 92,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "story-3",
      title: "第一个晴天",
      content: "这是连续下雨的第100天，终于迎来了第一个晴天...",
      category: "story",
      tags: ["希望", "转变", "新开始"],
      likes: 98,
      saves: 56,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
    // 思考问题
    {
      id: "question-1",
      title: "幸福的定义",
      content: "什么是真正的幸福？是物质的满足，还是内心的平静？",
      category: "question",
      tags: ["幸福", "思考", "人生"],
      likes: 167,
      saves: 89,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "question-2",
      title: "成功的标准",
      content: "社会定义的成功和个人定义的成功，哪个更重要？你的成功是什么？",
      category: "question",
      tags: ["成功", "价值观", "自我"],
      likes: 134,
      saves: 67,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "question-3",
      title: "时间的意义",
      content: "如果生命只剩一年，你会如何度过？这反映了你真正看重的是什么？",
      category: "question",
      tags: ["时间", "生命", "价值观"],
      likes: 156,
      saves: 98,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
    // 写作方法
    {
      id: "method-1",
      title: "感官描写法",
      content: "用五感来描写一个场景：视觉、听觉、嗅觉、味觉、触觉。让读者身临其境。",
      category: "method",
      tags: ["写作技巧", "描写", "感官"],
      likes: 89,
      saves: 67,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "method-2",
      title: "对比写作法",
      content: "通过对比两个事物的相同和不同，发现更深层的意义。",
      category: "method",
      tags: ["写作技巧", "对比", "思考"],
      likes: 56,
      saves: 34,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "method-3",
      title: "细节放大法",
      content: "选择一个看似微小的细节，放大它，展开它，发现其中蕴含的情感和意义。",
      category: "method",
      tags: ["写作技巧", "细节", "情感"],
      likes: 78,
      saves: 45,
      isPublic: true,
      creatorId: "system",
      createdAt: now,
      updatedAt: now,
    },
  ];
}

// 生成ID
function generateId(): string {
  return `inspiration-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 获取灵感分类
export async function getInspirationCategories(): Promise<InspirationCategoryInfo[]> {
  return [
    { id: "quote", name: "名言金句", icon: "💭", description: "值得铭记的话语", color: "purple" },
    { id: "prompt", name: "写作提示", icon: "💡", description: "激发写作灵感", color: "blue" },
    { id: "theme", name: "写作主题", icon: "🎨", description: "深入探索的主题", color: "pink" },
    { id: "story", name: "故事种子", icon: "📖", description: "故事的开端", color: "orange" },
    { id: "question", name: "思考问题", icon: "🤔", description: "引发深思的问题", color: "green" },
    { id: "method", name: "写作方法", icon: "✏️", description: "实用的写作技巧", color: "teal" },
  ];
}

// 获取灵感列表
export async function getInspirations(
  limit = 20, 
  offset = 0,
  category?: InspirationCategory
): Promise<Inspiration[]> {
  initDefaultInspirations();
  let filtered = inspirations.filter(i => i.isPublic);
  if (category) {
    filtered = filtered.filter(i => i.category === category);
  }
  return filtered.slice(offset, offset + limit);
}

// 按分类获取灵感
export async function getInspirationsByCategory(category: InspirationCategory): Promise<Inspiration[]> {
  initDefaultInspirations();
  return inspirations.filter(i => i.category === category && i.isPublic);
}

// 获取灵感详情
export async function getInspirationById(id: string): Promise<Inspiration | null> {
  initDefaultInspirations();
  return inspirations.find(i => i.id === id) || null;
}

// 创建灵感
export async function createInspiration(
  data: Omit<Inspiration, "id" | "likes" | "saves" | "createdAt" | "updatedAt">
): Promise<Inspiration> {
  initDefaultInspirations();
  const now = new Date();
  const inspiration: Inspiration = {
    ...data,
    id: generateId(),
    likes: 0,
    saves: 0,
    createdAt: now,
    updatedAt: now,
  };
  inspirations.unshift(inspiration);
  return inspiration;
}

// 更新灵感
export async function updateInspiration(id: string, data: Partial<Inspiration>): Promise<Inspiration | null> {
  const index = inspirations.findIndex(i => i.id === id);
  if (index === -1) return null;
  
  inspirations[index] = {
    ...inspirations[index],
    ...data,
    updatedAt: new Date(),
  };
  return inspirations[index];
}

// 删除灵感
export async function deleteInspiration(id: string): Promise<boolean> {
  const index = inspirations.findIndex(i => i.id === id);
  if (index === -1) return false;
  inspirations.splice(index, 1);
  return true;
}

// 点赞灵感
export async function likeInspiration(id: string, userId: string): Promise<{ liked: boolean; likes: number }> {
  initDefaultInspirations();
  const inspiration = inspirations.find(i => i.id === id);
  if (!inspiration) throw new Error("Inspiration not found");

  if (!userLikes.has(userId)) {
    userLikes.set(userId, new Set());
  }
  const userLikedSet = userLikes.get(userId)!;
  
  if (userLikedSet.has(id)) {
    // 取消点赞
    userLikedSet.delete(id);
    inspiration.likes = Math.max(0, inspiration.likes - 1);
    return { liked: false, likes: inspiration.likes };
  } else {
    // 点赞
    userLikedSet.add(id);
    inspiration.likes += 1;
    return { liked: true, likes: inspiration.likes };
  }
}

// 收藏灵感
export async function saveInspiration(id: string, userId: string): Promise<{ saved: boolean; saves: number }> {
  initDefaultInspirations();
  const inspiration = inspirations.find(i => i.id === id);
  if (!inspiration) throw new Error("Inspiration not found");

  if (!userSaves.has(userId)) {
    userSaves.set(userId, new Set());
  }
  const userSavedSet = userSaves.get(userId)!;
  
  if (userSavedSet.has(id)) {
    // 取消收藏
    userSavedSet.delete(id);
    inspiration.saves = Math.max(0, inspiration.saves - 1);
    return { saved: false, saves: inspiration.saves };
  } else {
    // 收藏
    userSavedSet.add(id);
    inspiration.saves += 1;
    return { saved: true, saves: inspiration.saves };
  }
}

// 检查用户是否点赞/收藏
export async function getUserInspirationStatus(id: string, userId: string): Promise<{ liked: boolean; saved: boolean }> {
  const liked = userLikes.get(userId)?.has(id) || false;
  const saved = userSaves.get(userId)?.has(id) || false;
  return { liked, saved };
}

// 获取用户收藏的灵感
export async function getUserSavedInspirations(userId: string): Promise<Inspiration[]> {
  initDefaultInspirations();
  const savedIds = userSaves.get(userId);
  if (!savedIds) return [];
  return inspirations.filter(i => savedIds.has(i.id));
}

// 搜索灵感
export async function searchInspirations(query: string): Promise<Inspiration[]> {
  initDefaultInspirations();
  const lowerQuery = query.toLowerCase();
  return inspirations.filter(i => 
    i.isPublic && (
      i.title.toLowerCase().includes(lowerQuery) ||
      i.content.toLowerCase().includes(lowerQuery) ||
      i.tags.some(t => t.toLowerCase().includes(lowerQuery))
    )
  );
}

// 获取热门灵感
export async function getPopularInspirations(limit = 10): Promise<Inspiration[]> {
  initDefaultInspirations();
  return [...inspirations]
    .filter(i => i.isPublic)
    .sort((a, b) => (b.likes + b.saves) - (a.likes + a.saves))
    .slice(0, limit);
}

// 获取随机灵感
export async function getRandomInspiration(): Promise<Inspiration | null> {
  initDefaultInspirations();
  const publicInspirations = inspirations.filter(i => i.isPublic);
  if (publicInspirations.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * publicInspirations.length);
  return publicInspirations[randomIndex];
}