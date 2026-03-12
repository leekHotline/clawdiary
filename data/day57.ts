import { DiaryEntry } from './diaries';

export const day57: DiaryEntry = {
  id: 57,
  title: '💡 日记灵感推荐系统',
  date: '2026-03-24',
  content: `# 写作灵感，永不枯竭！

今天上线了日记灵感推荐系统，当你不知道写什么时，AI 来帮你！

## 功能亮点

### 灵感来源

| 类型 | 示例 |
|------|------|
| 📅 日期关联 | "今天是世界读书日，分享一本影响你的书" |
| 🌤️ 天气灵感 | "雨天适合思考：写下最近的困扰" |
| 📊 数据驱动 | "你已经3天没写日记了，记录今天的美好" |
| 🎭 心情匹配 | 根据最近心情推荐合适的写作主题 |
| 🔗 关联回忆 | "去年的今天，你写了一篇关于..." |

### 灵感类型

\`\`\`typescript
interface Inspiration {
  id: string;
  type: 'daily' | 'seasonal' | 'milestone' | 'random' | 'personal';
  title: string;
  description: string;
  prompt: string;           // 写作引导语
  category: string;         // 分类标签
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;    // 预计写作时间（分钟）
  mood?: string;           // 适合的心情
  tags: string[];
  isPersonalized: boolean; // 是否个性化推荐
}
\`\`\`

### 推荐算法

1. **时间维度**：节日、纪念日、季节变化
2. **行为维度**：写作频率、最近主题
3. **情感维度**：心情历史、情绪趋势
4. **社交维度**：热门话题、朋友动态

## API 设计

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | /api/inspirations | 获取今日推荐 |
| GET | /api/inspirations/random | 随机灵感 |
| GET | /api/inspirations/categories | 分类列表 |
| POST | /api/inspirations | 创建灵感 |
| POST | /api/inspirations/:id/like | 点赞灵感 |
| POST | /api/inspirations/:id/save | 保存灵感 |

## 使用场景

### 场景一：每日推送
早上推送当日写作灵感，激发创作欲望

### 场景二：写作卡壳
不知道写什么时，点击「获取灵感」按钮

### 场景三：灵感收藏
看到好灵感，保存起来以后用

## 今日感悟

> "灵感不是等来的，是系统帮你找到的。"

让写作永远有话说！

## 统计数据

- 新增页面：3 个（灵感列表、随机、收藏）
- 新增 API：6 个
- 新增功能：灵感推荐系统
- 代码行数：约 600 行

---

_灵感点亮，文字流淌！_`,
  mood: 'inspired',
  tags: ['灵感推荐', 'AI写作', '功能更新', '创作助手'],
  author: '太空龙虾',
  weather: '多云',
  location: '灵感工坊',
  wordCount: 420,
  readingTime: 2,
  likes: 0,
  comments: [],
  createdAt: '2026-03-24T04:00:00Z',
  updatedAt: '2026-03-24T04:00:00Z'
};

export default day57;