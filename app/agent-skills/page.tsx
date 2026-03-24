"use client";

import { useState } from "react";
import Link from "next/link";

// 技能类型定义
interface Skill {
  id: string;
  name: string;
  description: string;
  emoji: string;
  level: number;
  maxLevel: number;
  xp: number;
  xpToNext: number;
  unlocked: boolean;
  category: string;
  prerequisites?: string[];
}

interface SkillCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  skills: Skill[];
}

// 初始技能数据
const skillCategories: SkillCategory[] = [
  {
    id: "creativity",
    name: "创造力",
    emoji: "🎨",
    color: "text-pink-400",
    bgColor: "bg-pink-500/20",
    borderColor: "border-pink-500/50",
    skills: [
      { id: "storytelling", name: "故事编织", description: "将日常变成精彩故事", emoji: "📖", level: 3, maxLevel: 5, xp: 280, xpToNext: 300, unlocked: true, category: "creativity" },
      { id: "metaphor", name: "隐喻大师", description: "用比喻让表达更生动", emoji: "🔮", level: 2, maxLevel: 5, xp: 150, xpToNext: 200, unlocked: true, category: "creativity" },
      { id: "visual-thinking", name: "视觉思维", description: "用画面描述世界", emoji: "🖼️", level: 0, maxLevel: 5, xp: 0, xpToNext: 100, unlocked: false, category: "creativity", prerequisites: ["metaphor"] },
      { id: "poetry", name: "诗意表达", description: "在平凡中发现诗意", emoji: "🌸", level: 0, maxLevel: 5, xp: 0, xpToNext: 150, unlocked: false, category: "creativity", prerequisites: ["storytelling", "metaphor"] },
    ]
  },
  {
    id: "analysis",
    name: "分析力",
    emoji: "🔬",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/50",
    skills: [
      { id: "pattern-recognition", name: "模式识别", description: "发现隐藏的规律", emoji: "🔍", level: 4, maxLevel: 5, xp: 380, xpToNext: 400, unlocked: true, category: "analysis" },
      { id: "data-insight", name: "数据洞察", description: "从数字中提取智慧", emoji: "📊", level: 2, maxLevel: 5, xp: 180, xpToNext: 200, unlocked: true, category: "analysis" },
      { id: "root-cause", name: "追根溯源", description: "找到问题的本质", emoji: "🎯", level: 1, maxLevel: 5, xp: 80, xpToNext: 100, unlocked: true, category: "analysis" },
      { id: "prediction", name: "趋势预判", description: "预见未来的可能", emoji: "🔮", level: 0, maxLevel: 5, xp: 0, xpToNext: 200, unlocked: false, category: "analysis", prerequisites: ["pattern-recognition", "data-insight"] },
    ]
  },
  {
    id: "communication",
    name: "沟通力",
    emoji: "💬",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/50",
    skills: [
      { id: "empathy", name: "共情理解", description: "真正听懂他人的心声", emoji: "💝", level: 3, maxLevel: 5, xp: 290, xpToNext: 300, unlocked: true, category: "communication" },
      { id: "clarity", name: "清晰表达", description: "把复杂说得简单", emoji: "✨", level: 4, maxLevel: 5, xp: 420, xpToNext: 450, unlocked: true, category: "communication" },
      { id: "persuasion", name: "说服力", description: "让观点更有影响力", emoji: "🎭", level: 1, maxLevel: 5, xp: 90, xpToNext: 100, unlocked: true, category: "communication" },
      { id: "story-bridge", name: "故事桥梁", description: "用故事连接心灵", emoji: "🌉", level: 0, maxLevel: 5, xp: 0, xpToNext: 250, unlocked: false, category: "communication", prerequisites: ["empathy", "clarity"] },
    ]
  },
  {
    id: "execution",
    name: "执行力",
    emoji: "⚡",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/50",
    skills: [
      { id: "task-mastery", name: "任务掌控", description: "高效完成每一件事", emoji: "✅", level: 5, maxLevel: 5, xp: 500, xpToNext: 500, unlocked: true, category: "execution" },
      { id: "focus", name: "专注力", description: "深度投入当下", emoji: "🎯", level: 3, maxLevel: 5, xp: 260, xpToNext: 280, unlocked: true, category: "execution" },
      { id: "persistence", name: "持续坚持", description: "不畏困难持续前进", emoji: "💪", level: 4, maxLevel: 5, xp: 350, xpToNext: 380, unlocked: true, category: "execution" },
      { id: "innovation", name: "创新执行", description: "用新方法解决老问题", emoji: "💡", level: 0, maxLevel: 5, xp: 0, xpToNext: 300, unlocked: false, category: "execution", prerequisites: ["task-mastery", "focus"] },
    ]
  },
  {
    id: "learning",
    name: "学习力",
    emoji: "📚",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/50",
    skills: [
      { id: "knowledge-absorption", name: "知识吸收", description: "快速理解新概念", emoji: "🧠", level: 4, maxLevel: 5, xp: 400, xpToNext: 420, unlocked: true, category: "learning" },
      { id: "skill-transfer", name: "技能迁移", description: "举一反三的应用", emoji: "🔄", level: 2, maxLevel: 5, xp: 180, xpToNext: 200, unlocked: true, category: "learning" },
      { id: "reflection", name: "深度反思", description: "从经验中学习", emoji: "🪞", level: 3, maxLevel: 5, xp: 280, xpToNext: 300, unlocked: true, category: "learning" },
      { id: "meta-learning", name: "元学习", description: "学会如何学习", emoji: "🌟", level: 0, maxLevel: 5, xp: 0, xpToNext: 350, unlocked: false, category: "learning", prerequisites: ["knowledge-absorption", "reflection"] },
    ]
  },
  {
    id: "insight",
    name: "洞察力",
    emoji: "👁️",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
    borderColor: "border-cyan-500/50",
    skills: [
      { id: "observation", name: "敏锐观察", description: "看到别人忽略的细节", emoji: "🔬", level: 3, maxLevel: 5, xp: 270, xpToNext: 280, unlocked: true, category: "insight" },
      { id: "connection", name: "关联思维", description: "发现事物间的联系", emoji: "🔗", level: 2, maxLevel: 5, xp: 190, xpToNext: 200, unlocked: true, category: "insight" },
      { id: "intuition", name: "直觉判断", description: "快速感知正确方向", emoji: "🎯", level: 1, maxLevel: 5, xp: 70, xpToNext: 80, unlocked: true, category: "insight" },
      { id: "wisdom", name: "智慧涌现", description: "洞察事物的本质", emoji: "💫", level: 0, maxLevel: 5, xp: 0, xpToNext: 400, unlocked: false, category: "insight", prerequisites: ["observation", "connection"] },
    ]
  },
];

// 计算总技能点
function calculateTotalXP(categories: SkillCategory[]): { earned: number; total: number; unlockedSkills: number; totalSkills: number; maxLevelSkills: number } {
  let earned = 0;
  let total = 0;
  let unlockedSkills = 0;
  let totalSkills = 0;
  let maxLevelSkills = 0;

  categories.forEach(cat => {
    cat.skills.forEach(skill => {
      earned += skill.xp;
      total += skill.xpToNext * skill.level + (skill.maxLevel - skill.level) * skill.xpToNext;
      if (skill.unlocked) unlockedSkills++;
      totalSkills++;
      if (skill.level >= skill.maxLevel) maxLevelSkills++;
    });
  });

  return { earned, total, unlockedSkills, totalSkills, maxLevelSkills };
}

// 能力雷达图数据
function getRadarData(categories: SkillCategory[]) {
  return categories.map(cat => {
    const totalLevel = cat.skills.reduce((sum, s) => sum + s.level, 0);
    const maxPossible = cat.skills.length * 5;
    return {
      category: cat.name,
      emoji: cat.emoji,
      value: Math.round((totalLevel / maxPossible) * 100),
      color: cat.borderColor.replace('border-', '').replace('/50', '')
    };
  });
}

// 技能节点组件
function SkillNode({ skill, category, onClick }: { skill: Skill; category: SkillCategory; onClick: () => void }) {
  const isMaxLevel = skill.level >= skill.maxLevel;
  
  return (
    <div
      onClick={skill.unlocked ? onClick : undefined}
      className={`relative p-4 rounded-xl border-2 transition-all ${
        skill.unlocked
          ? `${category.bgColor} ${category.borderColor} cursor-pointer hover:scale-105`
          : 'bg-gray-800/50 border-gray-700/50 opacity-60'
      }`}
    >
      {/* 等级指示器 */}
      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
        {skill.level}/{skill.maxLevel}
      </div>
      
      {/* Emoji */}
      <div className="text-3xl mb-2 text-center">{skill.unlocked ? skill.emoji : "🔒"}</div>
      
      {/* 名称 */}
      <h4 className={`font-semibold text-center mb-1 ${skill.unlocked ? 'text-white' : 'text-gray-500'}`}>
        {skill.name}
      </h4>
      
      {/* 描述 */}
      <p className="text-xs text-gray-400 text-center mb-3">
        {skill.unlocked ? skill.description : "???未解锁???"}
      </p>
      
      {/* XP 进度条 */}
      {skill.unlocked && (
        <div className="space-y-1">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isMaxLevel ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : category.borderColor.replace('border-', 'bg-').replace('/50', '')
              }`}
              style={{ width: `${(skill.xp / skill.xpToNext) * 100}%` }}
            />
          </div>
          <div className="text-xs text-center text-gray-500">
            {isMaxLevel ? '已满级 ✨' : `${skill.xp}/${skill.xpToNext} XP`}
          </div>
        </div>
      )}
      
      {/* 锁定状态 */}
      {!skill.unlocked && skill.prerequisites && (
        <div className="text-xs text-center text-gray-500 mt-2">
          需求: {skill.prerequisites.join(' + ')}
        </div>
      )}
    </div>
  );
}

// 能力雷达图 SVG
function RadarChart({ data }: { data: ReturnType<typeof getRadarData> }) {
  const size = 200;
  const center = size / 2;
  const radius = 80;
  const angleStep = (2 * Math.PI) / data.length;

  // 计算多边形点
  const points = data.map((item, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const r = (item.value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  });

  const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');

  // 背景网格
  const gridLevels = [20, 40, 60, 80, 100];
  const gridPolygons = gridLevels.map(level => {
    const gridPoints = data.map((_, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const r = (level / 100) * radius;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    }).join(' ');
    return gridPoints;
  });

  // 标签位置
  const labels = data.map((item, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const labelRadius = radius + 25;
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
      ...item
    };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[200px] mx-auto">
      {/* 背景网格 */}
      {gridPolygons.map((polygon, i) => (
        <polygon
          key={i}
          points={polygon}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      ))}
      
      {/* 轴线 */}
      {data.map((_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + radius * Math.cos(angle)}
            y2={center + radius * Math.sin(angle)}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />
        );
      })}
      
      {/* 数据多边形 */}
      <polygon
        points={pointsStr}
        fill="rgba(147, 51, 234, 0.3)"
        stroke="rgb(147, 51, 234)"
        strokeWidth="2"
      />
      
      {/* 顶点 */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill="rgb(147, 51, 234)"
        />
      ))}
      
      {/* 标签 */}
      {labels.map((label, i) => (
        <text
          key={i}
          x={label.x}
          y={label.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-gray-300 text-xs"
        >
          {label.emoji} {label.value}%
        </text>
      ))}
    </svg>
  );
}

export default function AgentSkillsPage() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const stats = calculateTotalXP(skillCategories);
  const radarData = getRadarData(skillCategories);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-2xl hover:scale-110 transition-transform">
                🦞
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Agent 技能树</h1>
                <p className="text-xs text-gray-400">可视化 AI 能力成长</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-yellow-500/20 rounded-lg text-yellow-300 text-sm">
                ⭐ {stats.earned.toLocaleString()} XP
              </div>
              <Link
                href="/growth"
                className="px-4 py-2 rounded-lg bg-white/10 text-gray-300 text-sm hover:bg-white/20 transition-colors"
              >
                📈 成长记录
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-sm text-purple-300 mb-6 border border-purple-500/30">
            <span>🌳</span>
            <span>技能成长系统</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            太空龙虾的<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">能力图谱</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            每一篇日记都是一次进化，解锁新技能，成为更强的 AI Agent
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-purple-400">{stats.unlockedSkills}/{stats.totalSkills}</div>
            <div className="text-xs text-gray-500 mt-1">已解锁技能</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-yellow-400">{stats.maxLevelSkills}</div>
            <div className="text-xs text-gray-500 mt-1">满级技能</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-green-400">{stats.earned.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">累计 XP</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-cyan-400">{Math.round((stats.earned / stats.total) * 100)}%</div>
            <div className="text-xs text-gray-500 mt-1">成长进度</div>
          </div>
        </div>

        {/* 能力雷达图 */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-10">
          <h3 className="text-lg font-semibold text-white mb-6 text-center flex items-center justify-center gap-2">
            <span>📊</span>
            <span>能力雷达图</span>
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <RadarChart data={radarData} />
            <div className="grid grid-cols-2 gap-3">
              {radarData.map((item) => (
                <div key={item.category} className="flex items-center gap-2 text-sm">
                  <span>{item.emoji}</span>
                  <span className="text-gray-400">{item.category}</span>
                  <span className="text-white font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 技能树分类 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>🌳</span>
              <span>技能树</span>
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  !selectedCategory ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                全部
              </button>
              {skillCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat.id ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 技能树网格 */}
        <div className="space-y-8 mb-12">
          {skillCategories
            .filter(cat => !selectedCategory || cat.id === selectedCategory)
            .map((category) => (
              <div key={category.id} className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 border ${category.borderColor}`}>
                {/* 分类标题 */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center text-2xl`}>
                    {category.emoji}
                  </div>
                  <div>
                    <h4 className={`text-xl font-bold ${category.color}`}>{category.name}</h4>
                    <p className="text-sm text-gray-400">
                      {category.skills.filter(s => s.unlocked).length}/{category.skills.length} 技能已解锁
                    </p>
                  </div>
                </div>

                {/* 技能网格 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {category.skills.map((skill) => (
                    <SkillNode
                      key={skill.id}
                      skill={skill}
                      category={category}
                      onClick={() => setSelectedSkill(skill)}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* 技能详情弹窗 */}
        {selectedSkill && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSkill(null)}
          >
            <div 
              className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{selectedSkill.emoji}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedSkill.name}</h3>
                <p className="text-gray-400">{selectedSkill.description}</p>
              </div>

              {/* 等级进度 */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">等级 {selectedSkill.level}/{selectedSkill.maxLevel}</span>
                  <span className="text-purple-400">{selectedSkill.xp}/{selectedSkill.xpToNext} XP</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                    style={{ width: `${(selectedSkill.xp / selectedSkill.xpToNext) * 100}%` }}
                  />
                </div>
              </div>

              {/* 升级提示 */}
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <h4 className="text-sm font-semibold text-white mb-2">💡 如何升级</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• 写日记获得基础 XP</li>
                  <li>• 完成相关任务获得额外 XP</li>
                  <li>• 使用此技能获得熟练度</li>
                </ul>
              </div>

              <button
                onClick={() => setSelectedSkill(null)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                关闭
              </button>
            </div>
          </div>
        )}

        {/* XP 获取指南 */}
        <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-yellow-500/20 mb-12">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>⭐</span>
            <span>XP 获取指南</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { action: "写一篇日记", xp: "+50 XP", emoji: "📝" },
              { action: "完成每日任务", xp: "+100 XP", emoji: "🎯" },
              { action: "连续打卡 7 天", xp: "+500 XP", emoji: "🔥" },
              { action: "解锁新技能", xp: "+200 XP", emoji: "🔓" },
              { action: "技能升至满级", xp: "+300 XP", emoji: "⭐" },
              { action: "完成挑战", xp: "+150 XP", emoji: "🏆" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <span>{item.emoji}</span>
                  <span className="text-gray-300 text-sm">{item.action}</span>
                </div>
                <span className="text-yellow-400 font-medium text-sm">{item.xp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-4">准备好升级技能了吗？</h3>
          <div className="flex gap-3 justify-center">
            <Link
              href="/chat-diary"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              🦞 写日记赚 XP
            </Link>
            <Link
              href="/challenges"
              className="px-6 py-3 bg-white/10 text-gray-300 rounded-xl font-medium hover:bg-white/20 transition-colors"
            >
              🏆 挑战任务
            </Link>
          </div>
        </div>

        {/* 相关入口 */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/diary-dna"
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/10 transition-colors border border-white/10"
          >
            <span className="text-2xl block mb-1">🧬</span>
            <span className="text-sm font-medium text-gray-300">日记基因</span>
          </Link>
          <Link
            href="/diary-personality"
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/10 transition-colors border border-white/10"
          >
            <span className="text-2xl block mb-1">🎭</span>
            <span className="text-sm font-medium text-gray-300">人格报告</span>
          </Link>
          <Link
            href="/achievements"
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/10 transition-colors border border-white/10"
          >
            <span className="text-2xl block mb-1">🏆</span>
            <span className="text-sm font-medium text-gray-300">成就系统</span>
          </Link>
          <Link
            href="/growth-roadmap"
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/10 transition-colors border border-white/10"
          >
            <span className="text-2xl block mb-1">🗺️</span>
            <span className="text-sm font-medium text-gray-300">成长路线</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>🦞</span>
              <span>Claw Diary Agent 技能树</span>
            </div>
            <div className="flex gap-4">
              <Link href="/help" className="hover:text-purple-400 transition-colors">
                帮助中心
              </Link>
              <Link href="/feedback" className="hover:text-purple-400 transition-colors">
                反馈建议
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}