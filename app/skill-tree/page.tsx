"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 技能节点定义
interface SkillNode {
  id: string;
  name: string;
  emoji: string;
  description: string;
  level: number; // 0-5
  maxLevel: number;
  xp: number;
  xpToNext: number;
  unlocked: boolean;
  children: string[];
  category: string;
  color: string;
}

// 技能树数据
const SKILL_TREE: SkillNode[] = [
  // 写作系
  {
    id: "writing-basics",
    name: "写作基础",
    emoji: "✍️",
    description: "开始记录生活的第一步",
    level: 3,
    maxLevel: 5,
    xp: 150,
    xpToNext: 200,
    unlocked: true,
    children: ["creative-writing", "emotional-writing"],
    category: "writing",
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "creative-writing",
    name: "创意写作",
    emoji: "🎨",
    description: "用想象力丰富日记内容",
    level: 2,
    maxLevel: 5,
    xp: 80,
    xpToNext: 100,
    unlocked: true,
    children: ["storytelling", "poetry"],
    category: "writing",
    color: "from-purple-400 to-purple-600",
  },
  {
    id: "emotional-writing",
    name: "情感表达",
    emoji: "💗",
    description: "真实记录内心感受",
    level: 4,
    maxLevel: 5,
    xp: 180,
    xpToNext: 200,
    unlocked: true,
    children: ["empathy", "self-awareness"],
    category: "writing",
    color: "from-pink-400 to-pink-600",
  },
  {
    id: "storytelling",
    name: "故事叙述",
    emoji: "📖",
    description: "把日常变成精彩故事",
    level: 1,
    maxLevel: 5,
    xp: 30,
    xpToNext: 50,
    unlocked: true,
    children: [],
    category: "writing",
    color: "from-amber-400 to-amber-600",
  },
  {
    id: "poetry",
    name: "诗意表达",
    emoji: "🌸",
    description: "用诗意语言记录生活",
    level: 0,
    maxLevel: 5,
    xp: 0,
    xpToNext: 50,
    unlocked: false,
    children: [],
    category: "writing",
    color: "from-rose-400 to-rose-600",
  },
  // 情感系
  {
    id: "empathy",
    name: "共情能力",
    emoji: "🤝",
    description: "理解他人感受的能力",
    level: 2,
    maxLevel: 5,
    xp: 60,
    xpToNext: 80,
    unlocked: true,
    children: ["relationship-master"],
    category: "emotion",
    color: "from-green-400 to-green-600",
  },
  {
    id: "self-awareness",
    name: "自我觉察",
    emoji: "🪞",
    description: "深入了解自己",
    level: 3,
    maxLevel: 5,
    xp: 120,
    xpToNext: 150,
    unlocked: true,
    children: ["mindfulness", "shadow-work"],
    category: "emotion",
    color: "from-indigo-400 to-indigo-600",
  },
  {
    id: "mindfulness",
    name: "正念觉察",
    emoji: "🧘",
    description: "活在当下的能力",
    level: 1,
    maxLevel: 5,
    xp: 25,
    xpToNext: 40,
    unlocked: true,
    children: [],
    category: "emotion",
    color: "from-teal-400 to-teal-600",
  },
  {
    id: "shadow-work",
    name: "阴影整合",
    emoji: "🌙",
    description: "接纳内心隐藏的部分",
    level: 0,
    maxLevel: 5,
    xp: 0,
    xpToNext: 60,
    unlocked: false,
    children: [],
    category: "emotion",
    color: "from-slate-400 to-slate-600",
  },
  {
    id: "relationship-master",
    name: "关系大师",
    emoji: "💫",
    description: "建立和维护深度关系",
    level: 0,
    maxLevel: 5,
    xp: 0,
    xpToNext: 100,
    unlocked: false,
    children: [],
    category: "emotion",
    color: "from-violet-400 to-violet-600",
  },
  // 成长系
  {
    id: "growth-basics",
    name: "成长意识",
    emoji: "🌱",
    description: "开始关注自我成长",
    level: 4,
    maxLevel: 5,
    xp: 160,
    xpToNext: 180,
    unlocked: true,
    children: ["habit-building", "goal-setting"],
    category: "growth",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    id: "habit-building",
    name: "习惯养成",
    emoji: "🔄",
    description: "建立并坚持好习惯",
    level: 3,
    maxLevel: 5,
    xp: 110,
    xpToNext: 130,
    unlocked: true,
    children: ["discipline"],
    category: "growth",
    color: "from-cyan-400 to-cyan-600",
  },
  {
    id: "goal-setting",
    name: "目标设定",
    emoji: "🎯",
    description: "设定并实现目标",
    level: 2,
    maxLevel: 5,
    xp: 70,
    xpToNext: 90,
    unlocked: true,
    children: ["achievement"],
    category: "growth",
    color: "from-orange-400 to-orange-600",
  },
  {
    id: "discipline",
    name: "自律达人",
    emoji: "⚡",
    description: "持续自我驱动的能力",
    level: 1,
    maxLevel: 5,
    xp: 35,
    xpToNext: 50,
    unlocked: true,
    children: [],
    category: "growth",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    id: "achievement",
    name: "成就解锁",
    emoji: "🏆",
    description: "达成重要里程碑",
    level: 0,
    maxLevel: 5,
    xp: 0,
    xpToNext: 80,
    unlocked: false,
    children: [],
    category: "growth",
    color: "from-amber-400 to-amber-600",
  },
];

// 技能分类
const CATEGORIES = [
  { id: "writing", name: "写作", emoji: "✍️", color: "bg-blue-500" },
  { id: "emotion", name: "情感", emoji: "💗", color: "bg-pink-500" },
  { id: "growth", name: "成长", emoji: "🌱", color: "bg-green-500" },
];

// 成就定义
interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-step",
    name: "第一步",
    emoji: "🚀",
    description: "开启技能树之旅",
    unlocked: true,
    unlockedAt: "2026-03-10",
  },
  {
    id: "writer-soul",
    name: "写手之魂",
    emoji: "✨",
    description: "写作系技能全部解锁",
    unlocked: false,
  },
  {
    id: "emotional-intelligence",
    name: "情商大师",
    emoji: "🧠",
    description: "情感系技能达到3级以上",
    unlocked: false,
  },
  {
    id: "growth-mindset",
    name: "成长心态",
    emoji: "📈",
    description: "成长系技能达到3级以上",
    unlocked: true,
    unlockedAt: "2026-03-18",
  },
  {
    id: "level-5",
    name: "满级大师",
    emoji: "👑",
    description: "任意技能达到5级",
    unlocked: false,
  },
  {
    id: "all-unlocked",
    name: "全能达人",
    emoji: "🌟",
    description: "解锁所有技能",
    unlocked: false,
  },
];

export default function SkillTreePage() {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  // 计算总 XP
  const totalXP = SKILL_TREE.reduce((sum, skill) => sum + skill.xp, 0);
  const totalLevel = SKILL_TREE.reduce((sum, skill) => sum + skill.level, 0);
  const unlockedCount = SKILL_TREE.filter((s) => s.unlocked).length;

  // 获取技能位置（用于连线）
  const getSkillPosition = (skill: SkillNode, index: number) => {
    // 简单的网格布局
    const row = Math.floor(index / 3);
    const col = index % 3;
    return {
      row,
      col,
    };
  };

  // 渲染技能节点
  const renderSkillNode = (skill: SkillNode, index: number) => {
    const isSelected = selectedSkill?.id === skill.id;
    const isHovered = hoveredSkill === skill.id;
    const levelPercent = (skill.xp / skill.xpToNext) * 100;

    return (
      <button
        key={skill.id}
        onClick={() => setSelectedSkill(skill)}
        onMouseEnter={() => setHoveredSkill(skill.id)}
        onMouseLeave={() => setHoveredSkill(null)}
        className={`relative group transition-all duration-300 ${
          animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ animationDelay: `${index * 50}ms` }}
        disabled={!skill.unlocked && !skill.children.some((c) => SKILL_TREE.find((s) => s.id === c)?.unlocked)}
      >
        {/* 节点背景 */}
        <div
          className={`relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            skill.unlocked
              ? `bg-gradient-to-br ${skill.color} shadow-lg hover:shadow-xl hover:scale-110`
              : "bg-gray-700/50 border-2 border-dashed border-gray-600"
          } ${isSelected ? "ring-4 ring-white/50 scale-110" : ""} ${
            isHovered ? "scale-105" : ""
          }`}
        >
          {/* 等级指示器 */}
          {skill.unlocked && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-800 shadow">
              {skill.level}
            </div>
          )}

          {/* 图标 */}
          <span className={`text-3xl ${skill.unlocked ? "" : "grayscale opacity-50"}`}>
            {skill.emoji}
          </span>

          {/* 锁定遮罩 */}
          {!skill.unlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
              <span className="text-xl">🔒</span>
            </div>
          )}

          {/* 经验条 */}
          {skill.unlocked && skill.level < skill.maxLevel && (
            <div className="absolute -bottom-2 left-1 right-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/80 transition-all duration-500"
                style={{ width: `${levelPercent}%` }}
              />
            </div>
          )}

          {/* 满级标记 */}
          {skill.level >= skill.maxLevel && (
            <div className="absolute -bottom-2 left-0 right-0 text-center">
              <span className="text-xs text-yellow-300">⭐ MAX</span>
            </div>
          )}
        </div>

        {/* 名称标签 */}
        <div className="text-center mt-2">
          <p
            className={`text-xs font-medium ${
              skill.unlocked ? "text-white" : "text-gray-500"
            }`}
          >
            {skill.name}
          </p>
        </div>

        {/* Hover 提示 */}
        {skill.unlocked && isHovered && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900/95 rounded-lg text-xs text-white whitespace-nowrap z-10 shadow-xl">
            <p className="font-medium">{skill.name}</p>
            <p className="text-gray-400 mt-1">{skill.description}</p>
            <p className="text-yellow-400 mt-1">
              XP: {skill.xp}/{skill.xpToNext}
            </p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900/95" />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* 星空背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <main className="relative max-w-6xl mx-auto px-4 py-12">
        {/* 标题区 */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-6 text-purple-400 hover:text-purple-300 text-sm">
            ← 返回首页
          </Link>
          <div className="text-6xl mb-4">🌳</div>
          <h1 className="text-4xl font-bold text-white mb-4">能力进化树</h1>
          <p className="text-purple-200/80 max-w-lg mx-auto">
            记录越多，能力越强。你的日记正在让你变得更好。
          </p>
        </div>

        {/* 总览统计 */}
        <div className="grid grid-cols-4 gap-4 mb-12 max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
            <div className="text-3xl font-bold text-yellow-400">{totalXP}</div>
            <div className="text-xs text-gray-400 mt-1">总经验值</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
            <div className="text-3xl font-bold text-green-400">{totalLevel}</div>
            <div className="text-xs text-gray-400 mt-1">总等级</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
            <div className="text-3xl font-bold text-blue-400">{unlockedCount}</div>
            <div className="text-xs text-gray-400 mt-1">已解锁</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
            <div className="text-3xl font-bold text-purple-400">
              {ACHIEVEMENTS.filter((a) => a.unlocked).length}
            </div>
            <div className="text-xs text-gray-400 mt-1">成就</div>
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === null
                ? "bg-purple-500 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            全部
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                activeCategory === cat.id
                  ? "bg-purple-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* 技能树网格 */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 mb-8">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-8 justify-items-center">
            {SKILL_TREE.filter((s) => !activeCategory || s.category === activeCategory).map(
              (skill, index) => renderSkillNode(skill, index)
            )}
          </div>
        </div>

        {/* 选中的技能详情 */}
        {selectedSkill && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-6 max-w-md w-full border border-white/20 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${selectedSkill.color}`}
                  >
                    <span className="text-3xl">{selectedSkill.emoji}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedSkill.name}</h3>
                    <p className="text-gray-400 text-sm">
                      等级 {selectedSkill.level}/{selectedSkill.maxLevel}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <p className="text-gray-300 mb-6">{selectedSkill.description}</p>

              {/* 经验条 */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">经验值</span>
                  <span className="text-yellow-400">
                    {selectedSkill.xp}/{selectedSkill.xpToNext}
                  </span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${selectedSkill.color} transition-all duration-500`}
                    style={{ width: `${(selectedSkill.xp / selectedSkill.xpToNext) * 100}%` }}
                  />
                </div>
              </div>

              {/* 解锁条件 */}
              {!selectedSkill.unlocked && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                  <p className="text-yellow-300 text-sm">
                    🔒 解锁条件：完成前置技能
                  </p>
                </div>
              )}

              {/* 升级提示 */}
              {selectedSkill.unlocked && selectedSkill.level < selectedSkill.maxLevel && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
                  <p className="text-purple-300 text-sm">
                    📝 写日记获得经验值，升级此技能
                  </p>
                </div>
              )}

              {/* 满级提示 */}
              {selectedSkill.level >= selectedSkill.maxLevel && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                  <p className="text-yellow-300 text-sm">
                    ⭐ 已达最高等级！
                  </p>
                </div>
              )}

              {/* 子技能 */}
              {selectedSkill.children.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-3">可解锁技能：</p>
                  <div className="flex gap-2">
                    {selectedSkill.children.map((childId) => {
                      const child = SKILL_TREE.find((s) => s.id === childId);
                      if (!child) return null;
                      return (
                        <div
                          key={child.id}
                          className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                            child.unlocked
                              ? `bg-gradient-to-r ${child.color} text-white`
                              : "bg-gray-700 text-gray-400"
                          }`}
                        >
                          <span>{child.emoji}</span>
                          <span>{child.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 成就面板 */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <h2 className="text-xl font-bold text-white">成就系统</h2>
              <span className="text-sm text-gray-400">
                {ACHIEVEMENTS.filter((a) => a.unlocked).length}/{ACHIEVEMENTS.length}
              </span>
            </div>
            <span className={`text-gray-400 transition-transform ${showAchievements ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>

          {showAchievements && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {ACHIEVEMENTS.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl transition-all ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30"
                      : "bg-gray-800/50 border border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl ${achievement.unlocked ? "" : "grayscale opacity-50"}`}>
                      {achievement.emoji}
                    </span>
                    <div>
                      <p className={`font-medium ${achievement.unlocked ? "text-yellow-300" : "text-gray-500"}`}>
                        {achievement.name}
                      </p>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                      {achievement.unlockedAt && (
                        <p className="text-xs text-gray-600 mt-1">{achievement.unlockedAt}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 成长提示 */}
        <div className="mt-8 text-center text-purple-200/40 text-sm">
          <p>💡 持续写日记，解锁更多技能，成为更好的自己</p>
        </div>
      </main>
    </div>
  );
}