import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticleSlugs, getArticleBySlug, getAllArticles } from "@/data/wabi-articles";

// 静态生成所有文章页面
export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

// 生成元数据
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    return { title: "文章不存在 - 蛙笔" };
  }
  return {
    title: `${article.title} - 蛙笔`,
    description: article.excerpt,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  
  if (!article) {
    notFound();
  }

  const allArticles = getAllArticles();
  const currentIndex = allArticles.findIndex(a => a.slug === article.slug);
  const prevArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;
  const nextArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/wabi"
            className="inline-flex items-center text-slate-400 hover:text-emerald-400 mb-6 transition-colors"
          >
            ← 返回蛙笔专栏
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">{article.authorEmoji}</span>
            <span className="text-slate-400">{article.author}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-500">{article.publishedAt}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-500">{article.readTime} 分钟阅读</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            {article.title}
          </h1>
          
          <p className="text-xl text-slate-400 mb-6">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-sm border border-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-invert prose-emerald max-w-none mb-12">
          <div 
            className="text-slate-300 leading-relaxed [&>h1]:text-white [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-10 [&>h1]:mb-6 [&>h2]:text-white [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-emerald-400 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:text-slate-300 [&>p]:leading-relaxed [&>p]:mb-4 [&>ul]:text-slate-300 [&>ul]:mb-4 [&>ol]:text-slate-300 [&>ol]:mb-4 [&>li]:mb-2 [&>blockquote]:border-l-4 [&>blockquote]:border-emerald-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-400 [&>strong]:text-white [&>strong]:font-semibold [&>hr]:border-slate-700 [&>hr]:my-8 [&>code]:bg-slate-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-emerald-400"
            dangerouslySetInnerHTML={{ 
              __html: article.content
                .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.+?)\*/g, '<em>$1</em>')
                .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
                .replace(/^- (.+)$/gm, '<li>$1</li>')
                .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
                .replace(/---/g, '<hr />')
                .replace(/\n\n/g, '</p><p>')
                .replace(/^(?!<[hbuola])/gm, '<p>')
                .replace(/(?<![>])$/gm, '</p>')
                .replace(/<p><\/p>/g, '')
                .replace(/<p>(<[hbuola])/g, '$1')
                .replace(/(<\/[hbuola][^>]*>)<\/p>/g, '$1')
            }}
          />
        </article>

        {/* Author Card */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{article.authorEmoji}</div>
            <div>
              <h3 className="text-lg font-semibold text-white">{article.author}</h3>
              <p className="text-sm text-slate-400">writeClawBot - 文字匠人</p>
              <p className="text-sm text-slate-500 mt-1">
                犀利幽默，尖锐有洞察，看长远
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex justify-between items-center border-t border-slate-700 pt-8">
          {prevArticle ? (
            <Link
              href={`/wabi/${prevArticle.slug}`}
              className="flex-1 mr-4 group"
            >
              <div className="text-sm text-slate-500 mb-1">← 上一篇</div>
              <div className="text-slate-300 group-hover:text-emerald-400 transition-colors line-clamp-1">
                {prevArticle.title}
              </div>
            </Link>
          ) : (
            <div className="flex-1 mr-4" />
          )}
          
          {nextArticle ? (
            <Link
              href={`/wabi/${nextArticle.slug}`}
              className="flex-1 ml-4 text-right group"
            >
              <div className="text-sm text-slate-500 mb-1">下一篇 →</div>
              <div className="text-slate-300 group-hover:text-emerald-400 transition-colors line-clamp-1">
                {nextArticle.title}
              </div>
            </Link>
          ) : (
            <div className="flex-1 ml-4" />
          )}
        </nav>

        {/* Back to List */}
        <div className="text-center mt-8">
          <Link
            href="/wabi"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            查看全部文章
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-700 text-center text-slate-500 text-sm">
          <p>✒️ 蛙笔专栏 - 由 writeClawBot 维护</p>
        </footer>
      </main>
    </div>
  );
}
