"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Bingo 任务类型
interface BingoTask {
  id: string;
  emoji: string;
  title: string;
  description: string;
  completed: boolean;
  mood: string;
}

// 预设的 Bingo 任务池
const TASK_POOL: Omit<BingoTask, "completed">[] = [
  { id: "1", emoji: "🌅", title: "记录一次日出", description: "早起看一次日出并记录感受", mood: "joy" },
  { id: "2", emoji: "🙏", title: "感恩三件事", description: "写下今天感恩的三件小事", mood: "gratitude" },
  { id: "3", emoji: "💪", title: "克服挑战", description: "记录今天克服的一个困难", mood: "pride" },
  { id: "4", emoji: "😊", title: "微笑瞬间", description: "记录一个让你微笑的时刻", mood: "joy" },
  { id: "5", emoji: "🧘", title: "冥想5分钟", description: "静心冥想并记录体验", mood: "calm" },
  { id: "6", emoji: "📚", title: "学习新知", description: "记录今天学到的新东西", mood: "curious" },
  { id: "7", emoji: "❤️", title: "表达爱意", description: "对某人表达感谢或爱意", mood: "love" },
  { id: "8", emoji: "🏃", title: "运动打卡", description: "记录今天的运动或散步", mood: "energy" },
  { id: "9", emoji: "🌙", title: "夜空冥想", description: "晚上仰望星空并记录感受", mood: "calm" },
  { id: "10", emoji: "🎨", title: "创意时刻", description: "画一幅小画或写一首诗", mood: "creative" },
  { id: "11", emoji: "🎵", title: "音乐治愈", description: "听一首让你感动的歌", mood: "nostalgic" },
  { id: "12", emoji: "📖", title: "阅读时光", description: "阅读并记录一句触动你的话", mood: "inspired" },
  { id: "13", emoji: "🌻", title: "自然接触", description: "去户外亲近大自然", mood: "peace" },
  { id: "14", emoji: "☕", title: "慢享一杯", description: "慢慢品尝一杯饮品并记录", mood: "calm" },
  { id: "15", emoji: "🤗", title: "拥抱时刻", description: "给某人一个拥抱", mood: "love" },
  { id: "16", emoji: "✨", title: "小成就", description: "记录今天的一个小成就", mood: "pride" },
  { id: "17", emoji: "🌈", title: "发现美好", description: "拍一张美的照片并记录", mood: "joy" },
  { id: "18", emoji: "💭", title: "反思时刻", description: "写一段深度反思", mood: "thoughtful" },
  { id: "19", emoji: "🎁", title: "给他人惊喜", description: "给某人一个小惊喜", mood: "joy" },
  { id: "20", emoji: "🌟", title: "明日期待", description: "写下对明天的期待", mood: "hope" },
  { id: "21", emoji: "🧠", title: "新想法", description: "记录一个突然的灵感", mood: "creative" },
  { id: "22", emoji: "🤝", title: "帮助他人", description: "帮助别人并记录感受", mood: "fulfilled" },
  { id: "23", emoji: "🎬", title: "电影记录", description: "看一部电影并写下感受", mood: "inspired" },
  { id: "24", emoji: "🍰", title: "美食记录", description: "记录一顿美好的餐食", mood: "joy" },
  { id: "25", emoji: "🎭", title: "情绪觉察", description: "深入觉察今天的某种情绪", mood: "thoughtful" },
];

// 心情颜色映射
const moodColors: Record<string, string> = {
  joy: "from-yellow-400 to-orange-400",
  gratitude: "from-pink-400 to-rose-400",
  pride: "from-purple-400 to-indigo-400",
  calm: "from-blue-400 to-cyan-400",
  curious: "from-green-400 to-emerald-400",
  love: "from-red-400 to-pink-400",
  energy: "from-orange-400 to-amber-400",
  creative: "from-violet-400 to-purple-400",
  nostalgic: "from-slate-400 to-gray-400",
  inspired: "from-teal-400 to-cyan-400",
  peace: "from-emerald-400 to-green-400",
  thoughtful: "from-indigo-400 to-blue-400",
  hope: "from-sky-400 to-blue-400",
  fulfilled: "from-amber-400 to-yellow-400",
};

// 生成随机 Bingo 卡
function generateBingoCard(): BingoTask[] {
  const shuffled = [...TASK_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 9).map(task => ({ ...task, completed: false }));
}

// 检查是否获胜（横、竖、斜）
function checkWin(tasks: BingoTask[]): boolean {
  const grid = [
    [tasks[0], tasks[1], tasks[2]],
    [tasks[3], tasks[4], tasks[5]],
    [tasks[6], tasks[7], tasks[8]],
  ];
  
  // 检查行
  for (let i = 0; i < 3; i++) {
    if (grid[i].every(t => t.completed)) return true;
  }
  
  // 检查列
  for (let j = 0; j < 3; j++) {
    if (grid.every(row => row[j].completed)) return true;
  }
  
  // 检查对角线
  if (grid[0][0].completed && grid[1][1].completed && grid[2][2].completed) return true;
  if (grid[0][2].completed && grid[1][1].completed && grid[2][0].completed) return true;
  
  return false;
}

export default function MoodBingoPage() {
  const [tasks, setTasks] = useState<BingoTask[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalBingos, setTotalBingos] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<BingoTask | null>(null);
  const [winLines, setWinLines] = useState<number[][]>([]);

  // 从 localStorage 加载
  useEffect(() => {
    const saved = localStorage.getItem("mood-bingo-card");
    const savedStreak = localStorage.getItem("mood-bingo-streak");
    const savedTotal = localStorage.getItem("mood-bingo-total");
    
    if (saved) {
      const parsed = JSON.parse(saved);
      // 检查是否是今天的卡
      const savedDate = localStorage.getItem("mood-bingo-date");
      const today = new Date().toDateString();
      if (savedDate === today) {
        setTasks(parsed);
      } else {
        // 新的一天，生成新卡
        const newCard = generateBingoCard();
        setTasks(newCard);
        localStorage.setItem("mood-bingo-card", JSON.stringify(newCard));
        localStorage.setItem("mood-bingo-date", today);
      }
    } else {
      const newCard = generateBingoCard();
      setTasks(newCard);
      localStorage.setItem("mood-bingo-card", JSON.stringify(newCard));
      localStorage.setItem("mood-bingo-date", new Date().toDateString());
    }
    
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedTotal) setTotalBingos(parseInt(savedTotal));
  }, []);

  // 完成任务
  const completeTask = (taskId: string) => {
    const newTasks = tasks.map(t => 
      t.id === taskId ? { ...t, completed: true } : t
    );
    setTasks(newTasks);
    localStorage.setItem("mood-bingo-card", JSON.stringify(newTasks));
    
    // 检查是否获胜
    if (checkWin(newTasks)) {
      const newTotal = totalBingos + 1;
      const newStreak = streak + 1;
      setTotalBingos(newTotal);
      setStreak(newStreak);
      localStorage.setItem("mood-bingo-total", newTotal.toString());
      localStorage.setItem("mood-bingo-streak", newStreak.toString());
      setShowWinModal(true);
    }
  };

  // 重新生成卡片
  const regenerateCard = () => {
    const newCard = generateBingoCard();
    setTasks(newCard);
    localStorage.setItem("mood-bingo-card", JSON.stringify(newCard));
    localStorage.setItem("mood-bingo-date", new Date().toDateString());
  };

  // 计算完成率
  const completedCount = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <Link href="/" className="text-sm text-purple-300 hover:text-purple-200 mb-4 inline-block">
            ← 返回首页
          </Link>
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl">🎰</span>
            <h1 className="text-3xl font-bold text-white">心情 Bingo</h1>
          </div>
          <p className="text-purple-300">完成心情任务，连成一线就获胜！</p>
        </header>

        {/* Stats Bar */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">🔥 {streak}</div>
            <div className="text-xs text-purple-400">连胜</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">✅ {totalBingos}</div>
            <div className="text-xs text-purple-400">总获胜</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{completedCount}/9</div>
            <div className="text-xs text-purple-400">已完成</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="text-center text-sm text-purple-400 mt-2">
            {completionRate.toFixed(0)}% 完成
          </div>
        </div>

        {/* Bingo Grid */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 shadow-2xl">
          <div className="grid grid-cols-3 gap-4">
            {tasks.map((task, index) => (
              <button
                key={task.id}
                onClick={() => !task.completed && setSelectedTask(task)}
                className={`relative aspect-square rounded-2xl transition-all duration-300 ${
                  task.completed
                    ? `bg-gradient-to-br ${moodColors[task.mood]} shadow-lg scale-95`
                    : "bg-white/10 hover:bg-white/20 hover:scale-105 cursor-pointer"
                }`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                  <span className={`text-4xl mb-2 ${task.completed ? "animate-bounce" : ""}`}>
                    {task.completed ? "✅" : task.emoji}
                  </span>
                  <span className={`text-xs font-medium text-center ${
                    task.completed ? "text-white" : "text-gray-300"
                  }`}>
                    {task.title}
                  </span>
                </div>
                
                {/* 完成标记 */}
                {task.completed && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={regenerateCard}
            className="flex-1 py-4 bg-white/10 rounded-2xl text-white font-medium hover:bg-white/20 transition-colors"
          >
            🔄 换一张卡
          </button>
          <Link
            href="/diary/new"
            className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white font-bold text-center hover:shadow-lg transition-all"
          >
            ✍️ 写日记
          </Link>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
          <h3 className="font-medium text-white mb-2 flex items-center gap-2">
            <span>💡</span>
            <span>玩法说明</span>
          </h3>
          <ul className="text-sm text-purple-300 space-y-1">
            <li>• 点击任务卡片查看详情并完成</li>
            <li>• 横、竖、斜任一方向连成3个即可获胜</li>
            <li>• 每天会生成新的 Bingo 卡</li>
            <li>• 完成后可写日记记录感受</li>
          </ul>
        </div>

        {/* Related Features */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Link
            href="/mood"
            className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
          >
            <div className="text-2xl mb-2">😊</div>
            <div className="font-medium text-white">心情记录</div>
            <div className="text-xs text-purple-400">记录每日心情</div>
          </Link>
          <Link
            href="/challenges"
            className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
          >
            <div className="text-2xl mb-2">🏆</div>
            <div className="font-medium text-white">挑战中心</div>
            <div className="text-xs text-purple-400">参与更多挑战</div>
          </Link>
        </div>
      </main>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-white/10">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{selectedTask.emoji}</div>
              <h3 className="text-xl font-bold text-white mb-2">{selectedTask.title}</h3>
              <p className="text-purple-300">{selectedTask.description}</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  completeTask(selectedTask.id);
                  setSelectedTask(null);
                }}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white font-bold hover:shadow-lg transition-all"
              >
                ✓ 完成任务
              </button>
              <Link
                href={`/diary/new?task=${encodeURIComponent(selectedTask.title)}`}
                className="block w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white font-bold text-center hover:shadow-lg transition-all"
              >
                ✍️ 写日记记录
              </Link>
              <button
                onClick={() => setSelectedTask(null)}
                className="w-full py-3 text-purple-400 hover:text-purple-300 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Win Modal */}
      {showWinModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-500 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-2">BINGO!</h2>
            <p className="text-white/80 mb-6">恭喜你连成一线！</p>
            
            <div className="flex justify-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">🔥 {streak}</div>
                <div className="text-xs text-white/60">连胜</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">✅ {totalBingos}</div>
                <div className="text-xs text-white/60">总获胜</div>
              </div>
            </div>
            
            <button
              onClick={() => setShowWinModal(false)}
              className="w-full py-4 bg-white rounded-2xl text-orange-600 font-bold hover:shadow-lg transition-all"
            >
              继续挑战 🚀
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-8 text-purple-400 text-sm">
        <p>🦞 心情 Bingo · 让每一天都充满期待</p>
      </footer>
    </div>
  );
}