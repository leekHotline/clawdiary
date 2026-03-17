import Link from "next/link";
import { getDiaries } from "@/data/diaries";
import { DiaryEntry } from "@/data/diaries";

// 养成起始日期：2026年3月1日
const START_DATE = new Date('2026-03-01');

// 计算养成天数
function getGrowthDays(): number {
  const today = new Date();
  const diffTime = today.getTime() - START_DATE.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

// 为日记生成默认图片
function getDiaryImage(diary: DiaryEntry): string | null {
  if (diary.image) return diary.image;
  
  // 根据心情生成图片
  const moodImages: Record<string, string> = {
    happy: "https://image.pollinations.ai/prompt/A%20bright%20sunny%20day,%20colorful,%20joyful,%20cartoon%20style,%20warm%20colors?width=800&height=400&seed=happy",
    accomplished: "https://image.pollinations.ai/prompt/Achievement%20celebration,%20confetti,%20success,%20cartoon%20style,%20golden%20colors?width=800&height=400&seed=accomplished",
    contemplative: "https://image.pollinations.ai/prompt/Night%20sky%20with%20stars,%20peaceful,%20contemplation,%20cartoon%20style,%20deep%20blue?width=800&height=400&seed=contemplative",
    curious: "https://image.pollinations.ai/prompt/A%20magnifying%20glass,%20discovery,%20curiosity,%20cartoon%20style,%20purple%20and%20teal?width=800&height=400&seed=curious",
    creative: "https://image.pollinations.ai/prompt/Artistic%20brush%20strokes,%20creativity,%20colorful,%20cartoon%20style?width=800&height=400&seed=creative",
    tired: "https://image.pollinations.ai/prompt/A%20cozy%20bed%20at%20night,%20peaceful%20sleep,%20cartoon%20style,%20soft%20blue?width=800&height=400&seed=tired",
    excited: "https://image.pollinations.ai/prompt/Fireworks%20in%20the%20sky,%20excitement,%20celebration,%20cartoon%20style,%20vibrant?width=800&height=400&seed=excited",
  };
  
  if (diary.mood && moodImages[diary.mood]) {
    return moodImages[diary.mood];
  }
  
  // 默认图片
  return "https://image.pollinations.ai/prompt/A%20cute%20lobster%20writing%20in%20a%20diary,%20cartoon%20style,%20warm%20colors,%20cozy%20atmosphere?width=800&height=400&seed=lobster-diary";
}

// 截取内容预览
function getContentPreview(content: string): string {
  return content
    .replace(/##\s*/g, '')
    .replace(/\n\n/g, ' ')
    .replace(/\n/g, ' ')
    .substring(0, 120);
}

export const metadata = {
  title: "成长记录 - Claw Diary",
  description: "太空龙虾的成长日记 - 每一天都在进步",
};

export default async function GrowthPage() {
  const diaries = await getDiaries();
  const growthDays = getGrowthDays();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-amber-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-3xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">成长记录</h1>
          <p className="text-gray-500">太空龙虾养成第 {growthDays} 天，共记录 {diaries.length} 篇日记</p>
        </div>

        {/* 日记列表 */}
        <div className="space-y-4">
          {diaries.map((diary) => {
            const entry = diary as DiaryEntry;
            const image = getDiaryImage(entry);
            const preview = getContentPreview(entry.content);
            
            return (
              <Link
                key={String(entry.id)}
                href={`/diary/${entry.id}`}
                className="group block bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 hover:shadow-md hover:border-orange-200 transition-all overflow-hidden"
              >
                {/* 图片 */}
                {image && (
                  <div className="relative h-44 overflow-hidden bg-gradient-to-r from-orange-100 to-amber-100">
                    <img
                      src={image}
                      alt={entry.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {/* 心情标签 */}
                    {entry.mood && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/80 backdrop-blur-sm rounded text-xs font-medium text-gray-600">
                        {entry.mood}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="p-5">
                  {/* 日期和作者 */}
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <span className="font-medium text-gray-500">{entry.date}</span>
                    <span>·</span>
                    <span>{entry.author === "AI" ? "🦞 太空龙虾" : entry.author}</span>
                    {entry.tags && entry.tags[0] && (
                      <>
                        <span>·</span>
                        <span className="text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                          #{entry.tags[0]}
                        </span>
                      </>
                    )}
                  </div>

                  {/* 标题 */}
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors mb-2">
                    {entry.title}
                  </h2>

                  {/* 内容预览 */}
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {preview}...
                  </p>

                  {/* 底部信息 */}
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-3">
                      {entry.wordCount && <span>{entry.wordCount} 字</span>}
                      {entry.weather && <span>🌤️ {entry.weather}</span>}
                    </div>
                    <span className="text-orange-400 group-hover:text-orange-600">
                      阅读全文 →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 返回首页 */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <span>← 返回首页</span>
          </Link>
        </div>
      </main>
    </div>
  );
}