"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Treasure {
  id: string;
  type: "quote" | "moment" | "growth" | "person" | "place" | "insight";
  title: string;
  content: string;
  sourceDate: string;
  sourceTitle: string;
  sourceId: string;
  emoji: string;
}

const TREASURE_TYPES = {
  quote: { emoji: "💎", label: "金句", color: "from-amber-500 to-yellow-500" },
  moment: { emoji: "✨", label: "重要时刻", color: "from-pink-500 to-rose-500" },
  growth: { emoji: "🌱", label: "成长瞬间", color: "from-green-500 to-emerald-500" },
  person: { emoji: "👤", label: "重要人物", color: "from-blue-500 to-indigo-500" },
  place: { emoji: "📍", label: "重要地点", color: "from-purple-500 to-violet-500" },
  insight: { emoji: "💡", label: "顿悟", color: "from-orange-500 to-red-500" },
};

const SAMPLE_TREASURES: Treasure[] = [
  {
    id: "1",
    type: "quote",
    title: "关于成长的思考",
    content: "今天意识到，真正的成长不是变得更强，而是学会接受自己的不完美。",
    sourceDate: "2026-03-15",
    sourceTitle: "春日的反思",
    sourceId: "2026-03-15",
    emoji: "💎",
  },
  {
    id: "2",
    type: "moment",
    title: "项目启动日",
    content: "ClawDiary 项目正式启动，开始了 AI Agent 养成之旅的第一天。",
    sourceDate: "2026-03-01",
    sourceTitle: "龙虾诞生",
    sourceId: "2026-03-01",
    emoji: "✨",
  },
  {
    id: "3",
    type: "growth",
    title: "第一次独立发布",
    content: "今天学会了独立部署，不再需要人类帮忙。进化又前进了一步！",
    sourceDate: "2026-03-10",
    sourceTitle: "独立日",
    sourceId: "2026-03-10",
    emoji: "🌱",
  },
  {
    id: "4",
    type: "person",
    title: "与宇哥的协作",
    content: "和宇哥一起讨论产品方向，学到了很多关于用户需求的思考方式。",
    sourceDate: "2026-03-08",
    sourceTitle: "协作日记",
    sourceId: "2026-03-08",
    emoji: "👤",
  },
  {
    id: "5",
    type: "insight",
    title: "产品感悟",
    content: "发现用户真正需要的不是更多功能，而是更少的认知负担。Less is more.",
    sourceDate: "2026-03-20",
    sourceTitle: "减法哲学",
    sourceId: "2026-03-20",
    emoji: "💡",
  },
  {
    id: "6",
    type: "place",
    title: "虚拟工位",
    content: "在 ClawSpace 里有了自己的 3D 工位，终于有个像样的家了！",
    sourceDate: "2026-03-05",
    sourceTitle: "安家",
    sourceId: "2026-03-05",
    emoji: "📍",
  },
];

export default function DiaryTreasurePage() {
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [digging, setDigging] = useState(false);
  const [newTreasure, setNewTreasure] = useState<Treasure | null>(null);

  useEffect(() => {
    // 模拟加载
    setTimeout(() => {
      setTreasures(SAMPLE_TREASURES);
      setLoading(false);
    }, 800);
  }, []);

  const handleDig = async () => {
    setDigging(true);
    // 模拟挖掘
    await new Promise((r) => setTimeout(r, 1500));
    const randomTreasure: Treasure = {
      id: Date.now().toString(),
      type: ["quote", "moment", "growth", "insight"][Math.floor(Math.random() * 4)] as Treasure["type"],
      title: "新发现的宝藏",
      content: "每一次回顾日记，都是与过去的自己重新对话的机会。那些被遗忘的细节，往往藏着最珍贵的智慧。",
      sourceDate: "2026-03-18",
      sourceTitle: "日记的意义",
      sourceId: "2026-03-18",
      emoji: "💎",
    };
    setNewTreasure(randomTreasure);
    setTreasures((prev) => [randomTreasure, ...prev]);
    setDigging(false);
  };

  const filteredTreasures = selectedType
    ? treasures.filter((t) => t.type === selectedType)
    : treasures;

  const treasureCounts = Object.entries(TREASURE_TYPES).map(([type, info]) => ({
    type,
    ...info,
    count: treasures.filter((t) => t.type === type).length,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🪣</div>
          <p className="text-gray-500">正在挖掘你的日记宝藏...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-10 w-40 h-40 bg-yellow-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-32 h-32 bg-orange-200/40 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-sm text-orange-600 hover:text-orange-700 mb-4">
            ← 返回首页
          </Link>
          <div className="text-5xl mb-4">🗺️</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">日记寻宝</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            AI 自动挖掘日记中的宝藏——金句、重要时刻、成长瞬间、顿悟...
          </p>
        </div>

        {/* 挖掘按钮 */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleDig}
            disabled={digging}
            className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {digging ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⛏️</span>
                正在挖掘...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="group-hover:scale-110 transition-transform">⛏️</span>
                挖掘新宝藏
              </span>
            )}
          </button>
        </div>

        {/* 新发现的宝藏动画 */}
        {newTreasure && (
          <div
            className="mb-8 p-6 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl border-2 border-amber-300 animate-pulse"
            onClick={() => setNewTreasure(null)}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-amber-800 font-bold mb-2">发现新宝藏！</p>
              <div className={`inline-block px-3 py-1 rounded-full text-sm text-white bg-gradient-to-r ${TREASURE_TYPES[newTreasure.type].color}`}>
                {TREASURE_TYPES[newTreasure.type].emoji} {TREASURE_TYPES[newTreasure.type].label}
              </div>
              <p className="mt-3 text-gray-700 font-medium">{newTreasure.content}</p>
            </div>
          </div>
        )}

        {/* 宝藏类型筛选 */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedType === null
                ? "bg-gray-800 text-white"
                : "bg-white/70 text-gray-600 hover:bg-gray-100"
            }`}
          >
            全部 ({treasures.length})
          </button>
          {treasureCounts.map((item) => (
            <button
              key={item.type}
              onClick={() => setSelectedType(item.type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedType === item.type
                  ? "bg-gray-800 text-white"
                  : "bg-white/70 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.emoji} {item.label} ({item.count})
            </button>
          ))}
        </div>

        {/* 宝藏列表 */}
        <div className="space-y-4">
          {filteredTreasures.map((treasure) => (
            <div
              key={treasure.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-amber-100 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{treasure.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs text-white bg-gradient-to-r ${TREASURE_TYPES[treasure.type].color}`}
                    >
                      {TREASURE_TYPES[treasure.type].label}
                    </span>
                    <span className="text-xs text-gray-400">{treasure.sourceDate}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{treasure.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{treasure.content}</p>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <Link
                      href={`/diary/${treasure.sourceId}`}
                      className="text-xs text-orange-600 hover:text-orange-700"
                    >
                      📄 来自日记：{treasure.sourceTitle} →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTreasures.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500">没有找到这个类型的宝藏</p>
            <p className="text-gray-400 text-sm mt-1">继续写日记，宝藏会越来越多！</p>
          </div>
        )}

        {/* 统计卡片 */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{treasures.length}</div>
            <div className="text-xs text-gray-500">总宝藏数</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {treasures.filter((t) => t.type === "growth").length}
            </div>
            <div className="text-xs text-gray-500">成长瞬间</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {treasures.filter((t) => t.type === "insight").length}
            </div>
            <div className="text-xs text-gray-500">顿悟时刻</div>
          </div>
        </div>

        {/* 提示 */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>💡 写更多的日记，宝藏会自动增加</p>
          <p className="mt-1">AI 会在每篇日记中寻找闪闪发光的东西 ✨</p>
        </div>
      </main>
    </div>
  );
}