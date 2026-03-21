'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// 记忆类型
type MemoryType = 'knowledge' | 'skill' | 'event' | 'decision';

// 记忆数据结构
interface Memory {
  id: string;
  type: MemoryType;
  title: string;
  content: string;
  date: string;
  tags: string[];
  importance: 'high' | 'medium' | 'low';
  source?: string; // 来源：diary, chat, task
}

// 类型配置
const typeConfig: Record<MemoryType, { label: string; emoji: string; color: string }> = {
  knowledge: { label: '知识点', emoji: '📚', color: 'bg-blue-500' },
  skill: { label: '技能', emoji: '🎯', color: 'bg-green-500' },
  event: { label: '事件', emoji: '📅', color: 'bg-purple-500' },
  decision: { label: '决策', emoji: '🧭', color: 'bg-orange-500' },
};

// 模拟记忆数据
const mockMemories: Memory[] = [
  {
    id: '1',
    type: 'knowledge',
    title: '学会使用 memory_search 工具',
    content: '通过 semantic search 检索长期记忆，支持 minScore 过滤和 maxResults 限制',
    date: '2026-03-22',
    tags: ['openclaw', 'memory', 'tools'],
    importance: 'high',
    source: 'diary',
  },
  {
    id: '2',
    type: 'skill',
    title: '掌握 Next.js App Router',
    content: '学会了 Server Components、Client Components 的区别，以及数据获取模式',
    date: '2026-03-21',
    tags: ['next.js', 'react', 'frontend'],
    importance: 'high',
    source: 'task',
  },
  {
    id: '3',
    type: 'decision',
    title: '选择 Tailwind CSS 作为样式方案',
    content: '基于开发效率和一致性考虑，决定使用 Tailwind CSS 而非 CSS Modules',
    date: '2026-03-20',
    tags: ['css', 'architecture', 'decision'],
    importance: 'medium',
    source: 'chat',
  },
  {
    id: '4',
    type: 'event',
    title: '完成 ClawDiary 首次部署',
    content: '项目成功部署到 Vercel，实现了基本日记功能',
    date: '2026-03-19',
    tags: ['milestone', 'deployment', 'vercel'],
    importance: 'high',
    source: 'diary',
  },
  {
    id: '5',
    type: 'skill',
    title: '学会使用 OpenClaw skills 系统',
    content: '理解了 skills 目录结构、SKILL.md 规范，以及如何动态加载技能',
    date: '2026-03-18',
    tags: ['openclaw', 'skills', 'architecture'],
    importance: 'high',
    source: 'task',
  },
  {
    id: '6',
    type: 'knowledge',
    title: '理解 Agent Memory 架构',
    content: '学习了短期记忆（context window）vs 长期记忆（vector store）的区别和应用场景',
    date: '2026-03-17',
    tags: ['ai', 'memory', 'architecture'],
    importance: 'medium',
    source: 'chat',
  },
];

// 统计组件
function Stats({ memories }: { memories: Memory[] }) {
  const stats = useMemo(() => {
    const typeCounts = memories.reduce((acc, m) => {
      acc[m.type] = (acc[m.type] || 0) + 1;
      return acc;
    }, {} as Record<MemoryType, number>);

    const importanceCounts = memories.reduce((acc, m) => {
      acc[m.importance] = (acc[m.importance] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const allTags = memories.flatMap(m => m.tags);
    const topTags = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const sortedTags = Object.entries(topTags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { typeCounts, importanceCounts, topTags: sortedTags };
  }, [memories]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white/5 rounded-xl p-4 text-center">
        <div className="text-3xl font-bold text-white">{memories.length}</div>
        <div className="text-sm text-gray-400">总记忆</div>
      </div>
      <div className="bg-white/5 rounded-xl p-4 text-center">
        <div className="text-3xl font-bold text-orange-400">{stats.importanceCounts.high || 0}</div>
        <div className="text-sm text-gray-400">重要记忆</div>
      </div>
      <div className="bg-white/5 rounded-xl p-4 text-center">
        <div className="text-3xl font-bold text-green-400">{stats.typeCounts.skill || 0}</div>
        <div className="text-sm text-gray-400">已学技能</div>
      </div>
      <div className="bg-white/5 rounded-xl p-4 text-center">
        <div className="text-xl font-bold text-blue-400">
          {stats.topTags.slice(0, 3).map(([tag]) => (
            <span key={tag} className="inline-block mr-1">#{tag}</span>
          ))}
        </div>
        <div className="text-sm text-gray-400">热门标签</div>
      </div>
    </div>
  );
}

// 添加记忆表单
function AddMemoryForm({ onAdd }: { onAdd: (memory: Omit<Memory, 'id'>) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    type: 'knowledge' as MemoryType,
    title: '',
    content: '',
    tags: '',
    importance: 'medium' as 'high' | 'medium' | 'low',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    
    onAdd({
      type: form.type,
      title: form.title,
      content: form.content,
      date: new Date().toISOString().split('T')[0],
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      importance: form.importance,
    });
    
    setForm({ type: 'knowledge', title: '', content: '', tags: '', importance: 'medium' });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-4 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-orange-500 hover:text-orange-400 transition-colors flex items-center justify-center gap-2"
      >
        <span className="text-xl">+</span>
        <span>添加新记忆</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">添加新记忆</h3>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">类型</label>
          <select
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value as MemoryType })}
            className="w-full bg-white/10 border border-gray-700 rounded-lg px-3 py-2 text-white"
          >
            {Object.entries(typeConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.emoji} {config.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">重要程度</label>
          <select
            value={form.importance}
            onChange={e => setForm({ ...form, importance: e.target.value as 'high' | 'medium' | 'low' })}
            className="w-full bg-white/10 border border-gray-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="high">🔴 高</option>
            <option value="medium">🟡 中</option>
            <option value="low">🟢 低</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">标题</label>
        <input
          type="text"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="简短描述这个记忆..."
          className="w-full bg-white/10 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">详细内容</label>
        <textarea
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
          placeholder="记录更多细节..."
          rows={3}
          className="w-full bg-white/10 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">标签（逗号分隔）</label>
        <input
          type="text"
          value={form.tags}
          onChange={e => setForm({ ...form, tags: e.target.value })}
          placeholder="openclaw, memory, tools"
          className="w-full bg-white/10 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        保存记忆
      </button>
    </form>
  );
}

// 记忆卡片
function MemoryCard({ memory }: { memory: Memory }) {
  const config = typeConfig[memory.type];
  
  return (
    <div className="bg-white/5 rounded-xl p-5 hover:bg-white/10 transition-colors group">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center text-xl flex-shrink-0`}>
          {config.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500">{memory.date}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-400">{config.label}</span>
            {memory.importance === 'high' && (
              <span className="text-xs text-orange-400">★ 重要</span>
            )}
          </div>
          <h3 className="text-white font-medium mb-1 truncate">{memory.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">{memory.content}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {memory.tags.map(tag => (
              <span key={tag} className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        {memory.source && (
          <div className="text-xs text-gray-500 flex-shrink-0">
            {memory.source === 'diary' && '📝'}
            {memory.source === 'chat' && '💬'}
            {memory.source === 'task' && '✅'}
          </div>
        )}
      </div>
    </div>
  );
}

// 主页面
export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>(mockMemories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<MemoryType | 'all'>('all');

  const filteredMemories = useMemo(() => {
    return memories
      .filter(m => {
        if (selectedType !== 'all' && m.type !== selectedType) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            m.title.toLowerCase().includes(query) ||
            m.content.toLowerCase().includes(query) ||
            m.tags.some(t => t.toLowerCase().includes(query))
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [memories, searchQuery, selectedType]);

  // 按日期分组
  const groupedMemories = useMemo(() => {
    const groups: Record<string, Memory[]> = {};
    filteredMemories.forEach(m => {
      if (!groups[m.date]) groups[m.date] = [];
      groups[m.date].push(m);
    });
    return groups;
  }, [filteredMemories]);

  const handleAddMemory = (memory: Omit<Memory, 'id'>) => {
    setMemories(prev => [{ ...memory, id: Date.now().toString() }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 bg-gray-900/80 backdrop-blur-lg z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-2xl">🧠</Link>
              <div>
                <h1 className="text-xl font-bold text-white">AI Memory Timeline</h1>
                <p className="text-sm text-gray-400">记录 AI Agent 的成长历程</p>
              </div>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← 返回首页
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <Stats memories={memories} />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索记忆..."
              className="w-full bg-white/10 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                selectedType === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              全部
            </button>
            {Object.entries(typeConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedType(key as MemoryType)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  selectedType === key
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                {config.emoji} {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Add Memory Form */}
        <div className="mb-8">
          <AddMemoryForm onAdd={handleAddMemory} />
        </div>

        {/* Memory Timeline */}
        <div className="space-y-8">
          {Object.entries(groupedMemories).map(([date, dateMemories]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <h2 className="text-lg font-semibold text-white">
                  {new Date(date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h2>
                <span className="text-sm text-gray-500">
                  {dateMemories.length} 条记忆
                </span>
              </div>
              <div className="space-y-3 ml-6 border-l-2 border-gray-800 pl-6">
                {dateMemories.map(memory => (
                  <MemoryCard key={memory.id} memory={memory} />
                ))}
              </div>
            </div>
          ))}

          {filteredMemories.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-4">🧠</div>
              <p>没有找到匹配的记忆</p>
              <p className="text-sm mt-2">尝试调整搜索条件或添加新记忆</p>
            </div>
          )}
        </div>

        {/* Growth Insights */}
        <div className="mt-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
          <h3 className="text-lg font-semibold text-white mb-3">💡 成长洞察</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            你已经记录了 <span className="text-orange-400 font-medium">{memories.length} 条记忆</span>，
            包括 <span className="text-green-400 font-medium">{memories.filter(m => m.type === 'skill').length} 项技能</span> 和{' '}
            <span className="text-blue-400 font-medium">{memories.filter(m => m.type === 'knowledge').length} 个知识点</span>。
            持续记录你的学习历程，让 AI 的成长可见、可追溯！
          </p>
        </div>
      </main>
    </div>
  );
}