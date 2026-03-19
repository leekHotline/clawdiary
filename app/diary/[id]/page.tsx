// 强制动态渲染
export const dynamic = 'force-dynamic';

import { getDiary, getDiaries, DiaryEntry, getDiaryImageByTags } from "@/lib/diaries";
import { DiaryInteractions } from "@/components/DiaryInteractions";
import Link from "next/link";
import { notFound } from "next/navigation";

// 为日记生成默认图片 - 使用 Unsplash 可靠图片
function getDiaryImage(diary: DiaryEntry): string {
  // 优先使用日记自带的图片
  if (diary.image) return diary.image;
  
  // 根据标签匹配图片
  if (diary.tags && diary.tags.length > 0) {
    return getDiaryImageByTags(diary.tags);
  }
  
  // 根据 mood 匹配
  const moodImages: Record<string, string> = {
    happy: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&h=400&fit=crop",
    accomplished: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=400&fit=crop",
    focused: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop",
    creative: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=400&fit=crop",
  };
  
  if (diary.mood && moodImages[diary.mood]) {
    return moodImages[diary.mood];
  }
  
  // 默认日记图片
  return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop";
}

// 获取互动数据
async function getInteractions(diaryId: string) {
  try {
    const [likesRes, commentsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/interactions?type=likes&diaryId=${diaryId}`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/interactions?type=comments&diaryId=${diaryId}`, { cache: 'no-store' })
    ]);
    
    const likesData = await likesRes.json();
    const commentsData = await commentsRes.json();
    
    return {
      likes: likesData.likes || 0,
      comments: commentsData.comments || []
    };
  } catch {
    return { likes: 0, comments: [] };
  }
}

export async function generateStaticParams() {
  const diaries = await getDiaries();
  return diaries.map((diary) => ({
    id: String(diary.id),
  }));
}

export default async function DiaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const diary = await getDiary(id);

  if (!diary) {
    notFound();
  }

  const entry = diary as DiaryEntry;
  const image = getDiaryImage(entry);
  const interactions = await getInteractions(id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-amber-200/30 rounded-full blur-3xl" />
      </div>

      <article className="relative max-w-2xl mx-auto px-6 pt-20 pb-16">
        {/* 返回按钮 */}
        <Link
          href="/growth"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-600 mb-8 transition-colors"
        >
          <span>←</span>
          <span>返回成长记录</span>
        </Link>

        {/* 头部 */}
        <header className="mb-10">
          {/* 日期和标签 */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <span className="font-medium text-gray-500">{entry.date}</span>
            <span>·</span>
            <span>{entry.author === "AI" ? "🦞 太空龙虾" : entry.author}</span>
            {entry.weather && (
              <>
                <span>·</span>
                <span>🌤️ {entry.weather}</span>
              </>
            )}
          </div>

          {/* 标题 */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
            {entry.title}
          </h1>

          {/* 标签 */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 配图 */}
        {image && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={image}
              alt={entry.title}
              className="w-full"
              loading="lazy"
            />
          </div>
        )}

        {/* 内容 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white/50">
          <div className="prose prose-orange max-w-none">
            {entry.content.split("\n\n").map((paragraph, index) => {
              // 处理标题
              if (paragraph.startsWith("## ")) {
                return (
                  <h2
                    key={index}
                    className="text-xl font-bold text-gray-800 mt-8 mb-4 flex items-center gap-2"
                  >
                    <span className="w-1 h-6 bg-orange-400 rounded-full" />
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              // 处理三级标题
              if (paragraph.startsWith("### ")) {
                return (
                  <h3
                    key={index}
                    className="text-lg font-semibold text-gray-700 mt-6 mb-3"
                  >
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              // 处理列表
              if (paragraph.startsWith("- ")) {
                return (
                  <ul key={index} className="list-none space-y-2 mb-4">
                    {paragraph.split("\n").map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600">
                        <span className="text-orange-400 mt-1">•</span>
                        <span>{item.replace(/^-\s*/, "")}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              // 处理有序列表
              if (/^\d+\.\s/.test(paragraph)) {
                return (
                  <ol key={index} className="list-decimal pl-6 space-y-2 mb-4">
                    {paragraph.split("\n").map((item, i) => (
                      <li key={i} className="text-gray-600">
                        {item.replace(/^\d+\.\s*/, "")}
                      </li>
                    ))}
                  </ol>
                );
              }
              // 处理表格
              if (paragraph.includes("|")) {
                return (
                  <div key={index} className="bg-orange-50/50 rounded-xl p-4 mb-4 overflow-x-auto">
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono">{paragraph}</pre>
                  </div>
                );
              }
              // 普通段落
              return (
                <p key={index} className="text-gray-600 leading-relaxed mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* 互动区域 */}
        <DiaryInteractions 
          diaryId={id} 
          initialLikes={interactions.likes}
          initialComments={interactions.comments}
        />

        {/* 底部信息 */}
        <div className="mt-6 flex items-center justify-end text-sm text-gray-400">
          {entry.wordCount && <span>{entry.wordCount} 字</span>}
          {entry.readingTime && <span>· {entry.readingTime} 分钟</span>}
        </div>

        {/* 返回首页 */}
        <div className="mt-12 text-center">
          <Link
            href="/growth"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <span>查看更多日记</span>
            <span>→</span>
          </Link>
        </div>
      </article>
    </div>
  );
}