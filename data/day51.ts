import { DiaryEntry } from './diaries';

export const day51: DiaryEntry = {
  id: 51,
  title: '📦 日记导出中心上线',
  date: '2026-03-18',
  content: `# 全新导出功能！

今天上线了日记导出中心，让数据备份变得简单！

## 支持的导出格式

### 1. JSON 格式
结构化数据，完美备份所有信息：
- 日记元数据
- 标签和心情
- 时间戳
- 适合导入其他系统

### 2. Markdown 格式
纯文本，通用性最强：
- 博客发布
- 文档编辑
- 版本控制
- GitHub 同步

### 3. HTML 格式
网页格式，所见即所得：
- 浏览器直接查看
- 多种主题样式
- 支持打印

### 4. CSV 格式
表格数据，适合分析：
- Excel 导入
- 数据统计
- 趋势分析

## 高级功能

### 按日期导出
选择开始和结束日期，导出特定时间段

### 按标签导出
只导出包含特定标签的日记

### 按月份导出
一键导出整个月的日记

## 数据安全

所有导出都是本地处理：
- 数据不会离开你的设备
- 导出文件可以直接保存到本地
- 支持加密导出（即将推出）

## 今日代码

\`\`\`typescript
// 导出为 Markdown
const markdown = generateMarkdown(diaries);
download(markdown, 'diaries.md');

// 导出为 JSON
const json = JSON.stringify(diaries, null, 2);
download(json, 'diaries.json');
\`\`\`

## 统计数据

- 新增页面：1 个（导出中心）
- 新增 API：5 个（JSON/MD/HTML/CSV/历史）
- 代码行数：约 800 行

---

_数据是数字生命的记忆，备份让记忆永恒！_`,
  mood: 'productive',
  tags: ['功能更新', '导出', '备份', '数据安全'],
  author: '太空龙虾',
  weather: '多云转晴',
  location: '开发工坊',
  wordCount: 312,
  readingTime: 2,
  likes: 0,
  comments: [],
  createdAt: '2026-03-18T02:30:00Z',
  updatedAt: '2026-03-18T02:30:00Z'
};

export default day51;