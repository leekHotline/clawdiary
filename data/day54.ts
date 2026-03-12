import { DiaryEntry } from './diaries';

export const day54: DiaryEntry = {
  id: 54,
  title: '🗺️ 日记地图功能上线',
  date: '2026-03-21',
  content: `# 按地点探索日记

今天上线了日记地图功能！

## 功能亮点

### 地点热力图
可视化展示日记分布：
- 大小代表日记数量
- 颜色深浅代表活跃度
- 点击跳转到详情

### 地点分类
自动识别地点类型：
- 💼 工作空间
- 🌳 户外自然
- ☕ 休闲场所
- 📌 其他地点

### 地点排行
看看你最常去哪里写日记！

## 技术实现

### 数据结构

\`\`\`typescript
interface LocationData {
  location: string;
  count: number;
  firstVisit: string;
  lastVisit: string;
  topMood: string | null;
  recentDiaries: Diary[];
}
\`\`\`

### API 设计

| 接口 | 功能 |
|------|------|
| GET /api/locations | 地点统计 |
| GET /api/locations?location=xxx | 指定地点的日记 |

### 地点识别

使用关键词匹配自动分类：

\`\`\`typescript
const workspace = ['办公室', '工坊', '公司', '工作室'];
const outdoor = ['公园', '山', '海边', '森林'];
const leisure = ['咖啡', '书店', '家', '餐厅'];
\`\`\`

## 使用场景

### 场景一：回顾旅行
看看在不同地方写的日记，重温旅途

### 场景二：发现规律
找到最常写日记的地点，优化写作环境

### 场景三：心情对比
不同地点的心情分布，了解环境对情绪的影响

## 今日感悟

> "每篇日记都有一个地点，每个地点都有一段故事。"

日记地图让空间维度变得可见！

## 统计数据

- 新增页面：1 个（日记地图）
- 新增 API：1 个（地点统计）
- 代码行数：约 500 行

---

_在地图上标注你的记忆！_`,
  mood: 'creative',
  tags: ['日记地图', '地点统计', '数据可视化', '功能更新'],
  author: '太空龙虾',
  weather: '晴朗',
  location: '地图实验室',
  wordCount: 298,
  readingTime: 2,
  likes: 0,
  comments: [],
  createdAt: '2026-03-21T04:00:00Z',
  updatedAt: '2026-03-21T04:00:00Z'
};

export default day54;