"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 心情商品类型
interface MoodProduct {
  id: string;
  name: string;
  emoji: string;
  price: number;
  color: string;
  bgColor: string;
  description: string;
  tags: string[];
  contains: {
    blessing: string;
    action: string;
    luckyItem: string;
    song: string;
    quote: string;
  };
  inStock: boolean;
  isNew?: boolean;
  isHot?: boolean;
}

// 心情商品库存
const moodProducts: MoodProduct[] = [
  {
    id: "happy-sunshine",
    name: "阳光好心情",
    emoji: "☀️",
    price: 1,
    color: "text-amber-600",
    bgColor: "bg-gradient-to-br from-amber-100 to-yellow-200",
    description: "今日宜笑，笑口常开",
    tags: ["能量满满", "社交力UP", "好运加持"],
    contains: {
      blessing: "今天会有小确幸降临在你身上 ✨",
      action: "给朋友发一条暖心的消息，分享你的好心情",
      luckyItem: "黄色物品、圆形物品",
      song: "《Sunny Day》- 任何让你想跳舞的歌",
      quote: "笑容是最便宜的化妆品，却能创造最昂贵的心情。",
    },
    inStock: true,
    isHot: true,
  },
  {
    id: "calm-peace",
    name: "平静心流",
    emoji: "🌊",
    price: 1,
    color: "text-blue-600",
    bgColor: "bg-gradient-to-br from-blue-100 to-cyan-100",
    description: "心如止水，物我两忘",
    tags: ["专注力UP", "内心平静", "创造力涌现"],
    contains: {
      blessing: "今天适合深度思考和学习 📚",
      action: "找一个安静的地方，花15分钟做你一直想做的事",
      luckyItem: "蓝色物品、水、笔",
      song: "《Weightless》- Marconi Union",
      quote: "平静的海洋练不出优秀的水手，但平静的内心能看清一切。",
    },
    inStock: true,
  },
  {
    id: "creative-spark",
    name: "灵感火花",
    emoji: "✨",
    price: 2,
    color: "text-purple-600",
    bgColor: "bg-gradient-to-br from-purple-100 to-pink-100",
    description: "灵感迸发，创意无限",
    tags: ["创造力MAX", "艺术灵感", "突破瓶颈"],
    contains: {
      blessing: "今天你的大脑会冒出绝妙的想法 💡",
      action: "立刻记录下任何冒出来的想法，不要评判",
      luckyItem: "紫色物品、笔记本、彩色笔",
      song: "《Creative Mind》- 激发灵感的纯音乐",
      quote: "灵感是准备遇到机会的产物。",
    },
    inStock: true,
    isNew: true,
  },
  {
    id: "cozy-comfort",
    name: "温馨治愈",
    emoji: "🧸",
    price: 1,
    color: "text-pink-600",
    bgColor: "bg-gradient-to-br from-pink-100 to-rose-100",
    description: "柔软治愈，被爱包围",
    tags: ["安全感", "自我关怀", "内心温暖"],
    contains: {
      blessing: "今天给自己一个温暖的拥抱 🤗",
      action: "泡一杯热饮，看一集喜欢的剧，宠爱自己",
      luckyItem: "毛绒物品、暖色灯光、热饮",
      song: "《起风了》- 温暖治愈的旋律",
      quote: "对自己温柔一点，你也是第一次当人。",
    },
    inStock: true,
  },
  {
    id: "adventure-ready",
    name: "冒险精神",
    emoji: "🚀",
    price: 2,
    color: "text-orange-600",
    bgColor: "bg-gradient-to-br from-orange-100 to-red-100",
    description: "勇于探索，拥抱未知",
    tags: ["勇气加持", "突破舒适圈", "新鲜体验"],
    contains: {
      blessing: "今天勇敢踏出一步，会有意外惊喜 🎁",
      action: "尝试一件从未做过的小事，换条路走或尝新美食",
      luckyItem: "红色物品、地图、相机",
      song: "《Adventure of a Lifetime》- Coldplay",
      quote: "人生最大的冒险，就是不冒险。",
    },
    inStock: true,
    isHot: true,
  },
  {
    id: "focus-mode",
    name: "专注能量",
    emoji: "🎯",
    price: 2,
    color: "text-green-600",
    bgColor: "bg-gradient-to-br from-green-100 to-emerald-100",
    description: "效率拉满，势不可挡",
    tags: ["效率MAX", "目标达成", "深度工作"],
    contains: {
      blessing: "今天你的专注力将达到顶峰 🎯",
      action: "列一个优先级清单，先做最重要的一件事",
      luckyItem: "绿色物品、计时器、清单",
      song: "《Flow State》- 专注类白噪音",
      quote: "专注是成功的隐形加速器。",
    },
    inStock: true,
  },
  {
    id: "love-energy",
    name: "爱与感恩",
    emoji: "💕",
    price: 3,
    color: "text-rose-600",
    bgColor: "bg-gradient-to-br from-rose-100 to-pink-200",
    description: "心怀感恩，爱意满满",
    tags: ["关系升温", "感恩日记", "魅力UP"],
    contains: {
      blessing: "今天爱与被爱的能量环绕着你 💝",
      action: "对三个人说一声谢谢，记录一件感恩的事",
      luckyItem: "粉色物品、鲜花、照片",
      song: "《Perfect》- Ed Sheeran",
      quote: "感恩是最高级的记忆术，它让美好的事物永存。",
    },
    inStock: true,
    isNew: true,
  },
  {
    id: "mystery-box",
    name: "神秘盲盒",
    emoji: "🎁",
    price: 1,
    color: "text-violet-600",
    bgColor: "bg-gradient-to-br from-violet-100 to-indigo-200",
    description: "未知惊喜，等待开启",
    tags: ["随机", "惊喜", "好运"],
    contains: {
      blessing: "命运的齿轮正在转动... 🔮",
      action: "闭眼随机指向一个方向，那就是今天的小目标",
      luckyItem: "今天遇到的第一件彩色物品",
      song: "命运自会安排",
      quote: "生活最迷人的地方，就是它的不可预测。",
    },
    inStock: true,
    isHot: true,
  },
];

// 已购买记录类型
interface PurchasedMood {
  productId: string;
  purchasedAt: string;
}

export default function MoodStorePage() {
  const [coins, setCoins] = useState(5);
  const [purchased, setPurchased] = useState<PurchasedMood[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MoodProduct | null>(null);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);
  const [lastPurchasedProduct, setLastPurchasedProduct] = useState<MoodProduct | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "hot">("all");
  const [canClaim, setCanClaim] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 从 localStorage 加载数据 - 仅在客户端
  useEffect(() => {
    setMounted(true);
    try {
      const savedCoins = localStorage.getItem("mood-store-coins");
      const savedPurchased = localStorage.getItem("mood-store-purchased");
      const lastClaim = localStorage.getItem("mood-store-last-claim");
      
      if (savedCoins) {
        setCoins(parseInt(savedCoins));
      }
      if (savedPurchased) {
        setPurchased(JSON.parse(savedPurchased));
      }
      // 检查是否可以领取每日金币
      setCanClaim(lastClaim !== new Date().toDateString());
    } catch {
      // localStorage 可能不可用
    }
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem("mood-store-coins", coins.toString());
    localStorage.setItem("mood-store-purchased", JSON.stringify(purchased));
  }, [coins, purchased]);

  // 购买心情
  const purchaseMood = (product: MoodProduct) => {
    if (coins < product.price) {
      return;
    }

    setCoins(coins - product.price);
    setPurchased([
      ...purchased,
      { productId: product.id, purchasedAt: new Date().toISOString() },
    ]);
    setLastPurchasedProduct(product);
    setShowPurchaseSuccess(true);
    setSelectedProduct(null);
  };

  // 领取每日金币
  const claimDailyCoins = () => {
    if (!canClaim) return false;
    
    localStorage.setItem("mood-store-last-claim", new Date().toDateString());
    setCoins(coins + 3);
    setCanClaim(false);
    return true;
  };

  // 过滤商品
  const filteredProducts = moodProducts.filter((p) => {
    if (filter === "new") return p.isNew;
    if (filter === "hot") return p.isHot;
    return true;
  });

  // 获取已购买次数
  const getPurchaseCount = (productId: string) => {
    return purchased.filter((p) => p.productId === productId).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-10 w-60 h-60 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-5xl mx-auto px-6 py-8">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <span>←</span>
          <span>返回首页</span>
        </Link>

        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">🏪</span>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              心情便利店
            </h1>
          </div>
          <p className="text-gray-500 max-w-md mx-auto">
            用心情币购买你想要的心情套餐，内含祝福、行动建议、幸运物品
          </p>
        </div>

        {/* 金币和统计 */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-sm flex items-center gap-3">
            <span className="text-2xl">🪙</span>
            <div>
              <div className="text-sm text-gray-500">心情币</div>
              <div className="text-2xl font-bold text-amber-600">{coins}</div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-sm flex items-center gap-3">
            <span className="text-2xl">🛒</span>
            <div>
              <div className="text-sm text-gray-500">已购买</div>
              <div className="text-2xl font-bold text-violet-600">{purchased.length}</div>
            </div>
          </div>

          {mounted && canClaim && (
            <button
              onClick={claimDailyCoins}
              className="bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <span>🎁</span>
              <span>领取每日 +3</span>
            </button>
          )}
        </div>

        {/* 过滤标签 */}
        <div className="flex justify-center gap-2 mb-6">
          {[
            { key: "all", label: "全部", emoji: "🛍️" },
            { key: "new", label: "新品", emoji: "🆕" },
            { key: "hot", label: "热卖", emoji: "🔥" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-violet-600 text-white shadow-lg"
                  : "bg-white/70 text-gray-600 hover:bg-white"
              }`}
            >
              {f.emoji} {f.label}
            </button>
          ))}
        </div>

        {/* 商品网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`relative ${product.bgColor} rounded-2xl p-4 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] group overflow-hidden`}
            >
              {/* 标签 */}
              <div className="absolute top-2 right-2 flex gap-1">
                {product.isNew && (
                  <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">NEW</span>
                )}
                {product.isHot && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">🔥</span>
                )}
              </div>

              {/* 内容 */}
              <div className="text-center mb-3">
                <div className="text-4xl mb-2">{product.emoji}</div>
                <h3 className={`font-bold ${product.color}`}>{product.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.description}</p>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-1 justify-center mb-3">
                {product.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white/50 text-gray-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* 价格 */}
              <div className="flex items-center justify-center gap-1">
                <span className="text-amber-600 font-bold">{product.price}</span>
                <span className="text-xs">🪙</span>
                {getPurchaseCount(product.id) > 0 && (
                  <span className="ml-2 text-xs text-gray-400">×{getPurchaseCount(product.id)}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 最近购买记录 */}
        {purchased.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📋</span>
              <span>购买记录</span>
            </h2>
            <div className="grid gap-2">
              {purchased.slice(-5).reverse().map((p, i) => {
                const product = moodProducts.find((mp) => mp.id === p.productId);
                if (!product) return null;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-white/50 rounded-xl px-4 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{product.emoji}</span>
                      <span className="text-gray-700">{product.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(p.purchasedAt).toLocaleString("zh-CN", {
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 商品详情弹窗 */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`${selectedProduct.bgColor} rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl`}>
              {/* 关闭按钮 */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/50 rounded-full flex items-center justify-center text-gray-500 hover:bg-white transition-colors"
              >
                ✕
              </button>

              {/* 头部 */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-3">{selectedProduct.emoji}</div>
                <h2 className={`text-2xl font-bold ${selectedProduct.color}`}>{selectedProduct.name}</h2>
                <p className="text-gray-500 mt-1">{selectedProduct.description}</p>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {selectedProduct.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-white/60 text-gray-600 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* 包含内容 */}
              <div className="space-y-4 mb-6">
                <div className="bg-white/60 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">✨ 今日祝福</div>
                  <div className="text-gray-800 font-medium">{selectedProduct.contains.blessing}</div>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">🎯 建议行动</div>
                  <div className="text-gray-800">{selectedProduct.contains.action}</div>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">🍀 幸运物品</div>
                  <div className="text-gray-800">{selectedProduct.contains.luckyItem}</div>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">🎵 推荐歌曲</div>
                  <div className="text-gray-800">{selectedProduct.contains.song}</div>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">💭 心情语录</div>
                  <div className="text-gray-800 italic">"{selectedProduct.contains.quote}"</div>
                </div>
              </div>

              {/* 购买按钮 */}
              <button
                onClick={() => purchaseMood(selectedProduct)}
                disabled={coins < selectedProduct.price}
                className={`w-full py-3 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  coins >= selectedProduct.price
                    ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span>🛒</span>
                <span>购买 · {selectedProduct.price} 🪙</span>
              </button>
              
              {coins < selectedProduct.price && (
                <p className="text-center text-red-500 text-sm mt-2">心情币不足 😢</p>
              )}
            </div>
          </div>
        )}

        {/* 购买成功弹窗 */}
        {showPurchaseSuccess && lastPurchasedProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
              <div className="text-7xl mb-4 animate-bounce">{lastPurchasedProduct.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">购买成功！</h2>
              <p className="text-gray-500 mb-6">你获得了「{lastPurchasedProduct.name}」</p>
              
              <div className="bg-gradient-to-r from-violet-50 to-pink-50 rounded-2xl p-4 mb-6">
                <p className="text-violet-700 font-medium">{lastPurchasedProduct.contains.blessing}</p>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowPurchaseSuccess(false);
                    setSelectedProduct(lastPurchasedProduct);
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  查看详情
                </button>
                <Link
                  href={`/chat-diary?prompt=${encodeURIComponent(`今天我购买了「${lastPurchasedProduct.name}」心情套餐，感觉${lastPurchasedProduct.description}。让我记录一下今天的心情...`)}`}
                  className="px-6 py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  🦞 写入日记
                </Link>
              </div>

              <button
                onClick={() => setShowPurchaseSuccess(false)}
                className="mt-4 text-gray-400 text-sm hover:text-gray-600"
              >
                关闭
              </button>
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="bg-white/50 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-700 mb-3">🎯 如何使用</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-500">
            <div className="bg-white/50 rounded-xl p-3">
              <div className="text-2xl mb-2">1️⃣</div>
              <div>领取每日心情币</div>
            </div>
            <div className="bg-white/50 rounded-xl p-3">
              <div className="text-2xl mb-2">2️⃣</div>
              <div>选择想要的心情套餐</div>
            </div>
            <div className="bg-white/50 rounded-xl p-3">
              <div className="text-2xl mb-2">3️⃣</div>
              <div>按照建议行动，记录日记</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}