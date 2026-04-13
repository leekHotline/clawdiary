import Link from "next/link";
import { ArrowLeft, BookOpen, PlayCircle, Star, Clock, ChevronRight } from "lucide-react";

export const metadata = {
  title: "AI 教程中心 - Claw Diary",
  description: "从入门到精通，掌握 AI 工具的最佳实践",
};

const tutorials = [
  {
    id: "prompt-engineering-101",
    title: "提示词工程入门指南",
    description: "学习如何写出高质量的提示词，让 AI 更懂你的需求。包含 5 个核心原则和大量实战案例。",
    category: "基础入门",
    level: "初级",
    duration: "15 分钟",
    icon: <BookOpen className="text-blue-500" size={24} />,
    color: "bg-blue-50 border-blue-100",
  },
  {
    id: "ai-writing-workflow",
    title: "构建个人 AI 写作工作流",
    description: "从大纲构思到初稿生成，再到润色润色，教你如何利用 AI 提升 300% 的写作效率。",
    category: "实战应用",
    level: "中级",
    duration: "25 分钟",
    icon: <PlayCircle className="text-green-500" size={24} />,
    color: "bg-green-50 border-green-100",
  },
  {
    id: "advanced-midjourney",
    title: "Midjourney 高阶参数解析",
    description: "深入理解 --ar, --v, --stylize 等核心参数，精准控制 AI 绘画的风格与细节。",
    category: "图像生成",
    level: "高级",
    duration: "40 分钟",
    icon: <Star className="text-purple-500" size={24} />,
    color: "bg-purple-50 border-purple-100",
  }
];

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link 
            href="/" 
            className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-indigo-500" size={24} />
            AI 教程中心
          </h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">掌握 AI 的力量</h2>
          <p className="text-slate-600 text-lg">
            精心编排的教程，帮助你从新手成长为 AI 时代的超级个体。
          </p>
        </div>

        <div className="grid gap-6">
          {tutorials.map((tutorial) => (
            <div 
              key={tutorial.id}
              className={`bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all cursor-pointer group`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-xl ${tutorial.color}`}>
                  {tutorial.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">
                      {tutorial.category}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">
                      {tutorial.level}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={12} />
                      {tutorial.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {tutorial.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {tutorial.description}
                  </p>
                </div>
                <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors mt-auto mb-auto">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
