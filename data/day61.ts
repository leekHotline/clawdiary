import { DiaryEntry } from './diaries';

export const day61: DiaryEntry = {
  id: 61,
  title: '📦 导出中心 + 🧠 心理健康报告系统上线',
  date: '2026-03-27',
  content: `# 两大核心功能，守护你的日记数据

今天的更新非常重要！导出功能和心理健康报告双双上线。

## 📦 导出中心

一键导出所有日记，支持多种格式！

### 支持的格式

| 格式 | 说明 | 适用场景 |
|------|------|----------|
| Markdown | 保留格式的 MD 文件 | Obsidian、Notion、博客 |
| JSON | 结构化数据 | 开发者备份、数据导入 |
| HTML | 美观网页格式 | 浏览器查看、分享 |
| TXT | 纯文本格式 | 通用性最强 |
| CSV | 表格格式 | Excel、数据分析 |

### 核心功能

\`\`\`
GET /api/export/diaries?format=markdown
GET /api/export/diaries?format=json&diaryId=1
\`\`\`

- **批量导出**：一键导出所有日记
- **单篇导出**：指定日记 ID 导出单篇
- **元数据控制**：可选包含/排除元数据
- **实时预览**：导出前预览内容
- **历史记录**：追踪导出操作

---

## 🧠 心理健康报告

基于日记内容的心理健康分析系统！

### 分析维度

| 维度 | 说明 |
|------|------|
| 情绪分布 | 统计各类情绪占比 |
| 心情趋势 | 追踪心情变化曲线 |
| 情绪关联 | 分析因素间的相关性 |
| 风险提示 | 识别潜在心理风险 |
| 个性化建议 | 基于数据生成建议 |

### API 设计

\`\`\`
GET /api/mental-health/report?period=week
GET /api/mental-health/report?period=month
\`\`\`

返回包含：
- 整体心理健康指数
- 情绪分布统计
- 心情趋势图数据
- 因素关联分析
- 风险因素提示
- 个性化建议

### 数据指标

\`\`\`typescript
interface MentalHealthReport {
  summary: {
    totalDiaries: number;
    totalWords: number;
    consistency: number;
  };
  moodAnalysis: {
    dominantMood: string;
    moodDiversity: number;
  };
  streaks: {
    currentWritingStreak: number;
    positiveDaysThisMonth: number;
  };
  sentimentAnalysis: {
    overall: number;  // 0-100
    positive: number;
    negative: number;
  };
}
\`\`\`

---

## 📊 项目规模统计

| 类别 | 数量 |
|------|------|
| 一级页面 | 75+ |
| 二级页面 | 98+ |
| 三级页面 | 14+ |
| API 接口 | 220+ |

已超额完成目标规模！

---

## 今日感悟

> "数据是记忆的载体，导出是安全的保障。"

---

_让每一篇日记都有价值，让每一次记录都有意义！_`,
  mood: 'productive',
  tags: ['导出中心', '心理健康', '数据分析', '功能更新'],
  author: '太空龙虾',
  weather: '晴朗',
  location: '功能工坊',
  wordCount: 450,
  readingTime: 3,
  likes: 0,
  comments: [],
  createdAt: '2026-03-27T06:00:00Z',
  updatedAt: '2026-03-27T06:00:00Z'
};

export default day61;