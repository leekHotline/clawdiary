import Link from "next/link";

export const metadata = {
  title: "灵感生成器 - Claw Diary",
  description: "AI 驱动的写作灵感生成器，让创作不再卡壳",
};

const inspirationTypes = [
  {
    id: "daily",
    title: "每日一问",
    emoji: "❓",
    desc: "深度思考的问题，激发有意义的写作",
    examples: ["今天最让你感恩的小事是什么？", "如果明天是世界末日，你今天会做什么？", "最近学到的一个新观点是什么？"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "story",
    title: "故事开头",
    emoji: "📖",
    desc: "故事开头句，让你继续写下去",
    examples: ["那天的阳光格外刺眼，我没想到...", "如果当初我做了另一个选择...", "十分钟后，我收到了那条改变一切的消息..."],
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "mood",
    title: "心情探索",
    emoji: "🎭",
    desc: "探索当下情绪的引导问题",
    examples: ["描述此刻的心情，如果它是一种天气...", "如果你可以对一个人说心里话，会是谁？说什么？", "闭上眼睛，感受此刻身体最紧张的地方是哪里？"],
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "creative",
    title: "创意挑战",
    emoji: "🎨",
    desc: "创意写作挑战，突破舒适区",
    examples: ["用一个比喻描述今天的感受", "写下三件永远不会发生但你想经历的事", "以"我没有告诉任何人..."开头写一段"],
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "memory",
    title: "记忆回溯",
    emoji: "📼",
    desc: "唤醒珍贵记忆的问题",
    examples: ["童年最快乐的夏天是什么样子的？", "你最想念的一顿饭是什么？", "描述一个改变了你人生轨迹的瞬间"],
    color: "from-rose-500 to-red-500",
  },
  {
    id: "gratitude",
    title: "感恩清单",
    emoji: "🙏",
    desc: "发现生活中值得感恩的事物",
    examples: ["今天遇到的三个小确幸", "一个你一直想感谢但没机会的人", "一件理所当然但其实是幸运的事"],
    color: "from-indigo-500 to-violet-500",
  },
];

export default function InspirationGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">💡</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              灵感生成器
            </h1>
          </div>
          <p className="text-gray-500 max-w-md mx-auto">
            AI 驱动的写作灵感，让创作不再卡壳
          </p>
        </div>

        {/* 快速生成 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-10 border border-white/50">
          <div className="text-center">
            <p className="text-gray-600 mb-4">不确定写什么？点击按钮获取随机灵感</p>
            <button 
              id="generate-btn"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              ✨ 生成随机灵感
            </button>
            <div id="inspiration-result" className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl hidden">
              <p id="inspiration-text" className="text-xl text-gray-700 text-center font-medium"></p>
            </div>
          </div>
        </div>

        {/* 灵感类型卡片 */}
        <h2 className="text-xl font-bold text-gray-800 mb-6">选择灵感类型</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {inspirationTypes.map((type) => (
            <div
              key={type.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
            >
              <div className={`h-2 bg-gradient-to-r ${type.color}`} />
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{type.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                      {type.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{type.desc}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {type.examples.map((example, i) => (
                    <div 
                      key={i}
                      className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-2 hover:bg-purple-50 transition-colors cursor-pointer inspiration-item"
                    >
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 写作挑战 */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 text-white mb-10">
          <h2 className="text-2xl font-bold mb-4">🔥 今日写作挑战</h2>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
            <p className="text-xl font-medium mb-4">
              写一封信给未来的自己，设定在一年后收到
            </p>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span>⏱ 预计用时：15分钟</span>
              <span>•</span>
              <span>🎯 难度：中等</span>
              <span>•</span>
              <span>✅ 已有 127 人完成</span>
            </div>
          </div>
          <Link
            href="/create"
            className="inline-block mt-6 px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
          >
            开始挑战 →
          </Link>
        </div>

        {/* 灵感库 */}
        <div className="grid grid-cols-3 gap-4">
          <Link
            href="/inspirations"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center hover:shadow-md transition-shadow"
          >
            <span className="text-3xl block mb-2">📚</span>
            <span className="font-medium text-gray-700">灵感库</span>
            <span className="text-sm text-gray-400 block mt-1">已收藏 28 条</span>
          </Link>
          <Link
            href="/inspirations/random"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center hover:shadow-md transition-shadow"
          >
            <span className="text-3xl block mb-2">🎲</span>
            <span className="font-medium text-gray-700">随机灵感</span>
            <span className="text-sm text-gray-400 block mt-1">试试手气</span>
          </Link>
          <Link
            href="/inspirations/create"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center hover:shadow-md transition-shadow"
          >
            <span className="text-3xl block mb-2">✨</span>
            <span className="font-medium text-gray-700">创建灵感</span>
            <span className="text-sm text-gray-400 block mt-1">分享你的创意</span>
          </Link>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{__html: `
        const inspirations = [
          "如果用一种颜色描述今天，你会选择什么颜色？为什么？",
          "写下一个你从未告诉任何人的小秘密...",
          "如果明天醒来你拥有一种超能力，你希望是什么？",
          "描述一个让你微笑的瞬间，越详细越好。",
          "如果你可以和任何人（活着或已故）共进晚餐，你会选谁？聊什么？",
          "最近一次感到真正放松是什么时候？在哪里？",
          "写一封感谢信，给你从来没有正式感谢过的人。",
          "如果人生是一部电影，现在这一章叫什么名字？",
          "描述童年最喜欢的玩具或游戏，以及它对你的意义。",
          "今天学到的最重要的事情是什么？",
          "如果你可以改变过去的一个决定，会是哪一个？",
          "写下一个让你感到骄傲的小成就。",
          "描述一个你一直想做但还没有勇气尝试的事。",
          "最近的梦想是什么？还记得细节吗？",
          "如果可以对 10 年前的自己说一句话，你会说什么？",
        ];
        
        const btn = document.getElementById('generate-btn');
        const result = document.getElementById('inspiration-result');
        const text = document.getElementById('inspiration-text');
        
        btn.addEventListener('click', () => {
          const random = inspirations[Math.floor(Math.random() * inspirations.length)];
          text.textContent = random;
          result.classList.remove('hidden');
          result.classList.add('animate-pulse');
          setTimeout(() => result.classList.remove('animate-pulse'), 1000);
        });
        
        document.querySelectorAll('.inspiration-item').forEach(item => {
          item.addEventListener('click', () => {
            text.textContent = item.textContent;
            result.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        });
      `}} />
    </div>
  );
}