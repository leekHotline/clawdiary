import Link from "next/link";

export default function AssistantChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/assistant" className="text-gray-400 hover:text-gray-600">
                ← 返回
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <span className="text-2xl">🤖</span>
              <h1 className="text-xl font-bold text-gray-800">AI 聊天助手</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                在线
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Chat Messages */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 min-h-[500px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[400px]">
            {/* AI Welcome */}
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                🦞
              </div>
              <div className="bg-orange-50 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                <p className="text-gray-700">
                  你好！我是太空龙虾助手 🦞 有什么想聊的吗？我可以帮你：
                </p>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  <li>• 回顾最近的学习和成长</li>
                  <li>• 讨论日记内容和想法</li>
                  <li>• 提供写作建议和灵感</li>
                  <li>• 回答关于产品的问题</li>
                </ul>
              </div>
            </div>

            {/* Sample User Message */}
            <div className="flex gap-3 justify-end">
              <div className="bg-blue-500 text-white rounded-2xl rounded-tr-none p-4 max-w-[80%]">
                <p>最近 Claw Diary 有什么新进展？</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                👤
              </div>
            </div>

            {/* AI Response */}
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                🦞
              </div>
              <div className="bg-orange-50 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                <p className="text-gray-700">
                  最近进展很大！让我给你汇报一下：
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-orange-500">90+</div>
                    <div className="text-xs text-gray-500">API 接口</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-500">60+</div>
                    <div className="text-xs text-gray-500">页面数量</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-500">12</div>
                    <div className="text-xs text-gray-500">日记数量</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-500">6</div>
                    <div className="text-xs text-gray-500">Agent 协作</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="text-xs bg-white hover:bg-orange-100 text-orange-600 px-3 py-1 rounded-full transition">
                    详细数据
                  </button>
                  <button className="text-xs bg-white hover:bg-orange-100 text-orange-600 px-3 py-1 rounded-full transition">
                    最近更新
                  </button>
                  <button className="text-xs bg-white hover:bg-orange-100 text-orange-600 px-3 py-1 rounded-full transition">
                    写篇日记
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="输入消息..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition flex items-center gap-2">
                <span>发送</span>
                <span>📤</span>
              </button>
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition">
                💡 给我灵感
              </button>
              <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition">
                📝 帮我写日记
              </button>
              <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition">
                🔍 搜索日记
              </button>
              <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition">
                📊 分析数据
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/assistant/write" className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 hover:shadow-md transition group">
            <div className="text-2xl mb-2">✍️</div>
            <h3 className="font-medium text-gray-800 group-hover:text-orange-500">写作助手</h3>
            <p className="text-sm text-gray-500 mt-1">智能帮助优化日记内容</p>
          </Link>
          <Link href="/assistant/mood" className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 hover:shadow-md transition group">
            <div className="text-2xl mb-2">😊</div>
            <h3 className="font-medium text-gray-800 group-hover:text-orange-500">心情分析</h3>
            <p className="text-sm text-gray-500 mt-1">分析日记中的情绪变化</p>
          </Link>
          <Link href="/insights" className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 hover:shadow-md transition group">
            <div className="text-2xl mb-2">🔮</div>
            <h3 className="font-medium text-gray-800 group-hover:text-orange-500">AI 洞察</h3>
            <p className="text-sm text-gray-500 mt-1">深度分析和建议</p>
          </Link>
        </div>
      </main>
    </div>
  );
}