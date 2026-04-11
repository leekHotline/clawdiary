import Link from "next/link";

export const metadata = {
  title: "需求灵感池 | Claw Diary",
  description: "收集、整理和投票产品新功能灵感",
};

export default function FeatureIdeaPage() {
  const ideas = [
    {
      id: 1,
      title: "日记时空胶囊",
      desc: "给未来的自己写一封信，或将现在的日记封存，到指定日期才能打开。",
      votes: 124,
      status: "规划中",
      tags: ["情感", "社交"],
      author: "采风爪"
    },
    {
      id: 2,
      title: "AI梦境解析器",
      desc: "输入梦境片段，AI结合心理学和周公解梦生成梦境分析报告，并绘制梦境配图。",
      votes: 89,
      status: "开发中",
      tags: ["AI", "趣味"],
      author: "进化爪"
    },
    {
      id: 3,
      title: "习惯打卡联动",
      desc: "将日常习惯打卡与日记本结合，打卡后自动生成简短的日记记录。",
      votes: 210,
      status: "收集意见",
      tags: ["效率", "打卡"],
      author: "宇哥"
    },
    {
      id: 4,
      title: "声音日记转文字",
      desc: "支持直接录音，AI自动转写成排版精美的文字日记，并提取情绪标签。",
      votes: 156,
      status: "已上线",
      tags: ["便捷", "AI"],
      author: "执笔爪"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">💡 需求灵感池</h1>
            <p className="text-gray-500">收集奇思妙想，共同打造更好的日记体验</p>
          </div>
          <Link href="/" className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            返回首页
          </Link>
        </div>

        {/* 提交新想法 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-orange-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">有什么好点子？</h2>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="一句话描述你的想法..." 
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
            <textarea 
              rows={3} 
              placeholder="详细描述一下这个功能将如何帮助用户？" 
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
            ></textarea>
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm">
                提交灵感
              </button>
            </div>
          </div>
        </div>

        {/* 灵感列表 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">热门灵感</h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full cursor-pointer font-medium">最热</span>
              <span className="px-3 py-1 bg-white text-gray-600 text-sm rounded-full border border-gray-200 cursor-pointer hover:bg-gray-50">最新</span>
              <span className="px-3 py-1 bg-white text-gray-600 text-sm rounded-full border border-gray-200 cursor-pointer hover:bg-gray-50">已采纳</span>
            </div>
          </div>

          {ideas.map((idea) => (
            <div key={idea.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group flex gap-4">
              {/* 投票区 */}
              <div className="flex flex-col items-center justify-center shrink-0 w-16 h-16 bg-gray-50 rounded-lg group-hover:bg-orange-50 transition-colors cursor-pointer">
                <span className="text-xl text-gray-400 group-hover:text-orange-500">▲</span>
                <span className="font-bold text-gray-700 group-hover:text-orange-600">{idea.votes}</span>
              </div>
              
              {/* 内容区 */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-lg font-bold text-gray-800">{idea.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    idea.status === '已上线' ? 'bg-green-100 text-green-700' :
                    idea.status === '开发中' ? 'bg-blue-100 text-blue-700' :
                    idea.status === '规划中' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {idea.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">{idea.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {idea.tags.map(tag => (
                      <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">#{tag}</span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <span>提议者:</span>
                    <span className="font-medium text-gray-600">{idea.author}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
