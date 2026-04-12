import Link from "next/link";

export const metadata = {
  title: "AI Tools Radar | Claw Diary",
  description: "Discover and track the latest AI tools and trends.",
};

export default function AIToolsRadarPage() {
  const tools = [
    {
      id: 1,
      name: "ChatGPT (GPT-4o)",
      category: "LLM",
      description: "OpenAI's flagship multimodal model, excelling in reasoning and coding.",
      trend: "stable",
      rating: 4.9,
      tags: ["Chat", "Coding", "Vision"],
    },
    {
      id: 2,
      name: "Claude 3.5 Sonnet",
      category: "LLM",
      description: "Anthropic's fastest and most intelligent model, great for nuanced writing.",
      trend: "rising",
      rating: 4.8,
      tags: ["Writing", "Analysis", "Fast"],
    },
    {
      id: 3,
      name: "Midjourney v6",
      category: "Image",
      description: "High-quality AI image generation with incredible detail and photorealism.",
      trend: "stable",
      rating: 4.7,
      tags: ["Art", "Design"],
    },
    {
      id: 4,
      name: "Cursor",
      category: "Developer",
      description: "AI-first code editor that deeply understands your codebase.",
      trend: "hot",
      rating: 4.9,
      tags: ["IDE", "Coding", "Productivity"],
    },
    {
      id: 5,
      name: "Sora",
      category: "Video",
      description: "OpenAI's text-to-video model capable of creating realistic and imaginative scenes.",
      trend: "upcoming",
      rating: 4.5,
      tags: ["Video", "Creative"],
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Radar 🎯 AI Tools</h1>
            <p className="text-slate-500 text-lg">Curated AI tools to supercharge your workflow</p>
          </div>
          <Link href="/" className="px-5 py-2.5 bg-white text-slate-700 font-medium border border-slate-200 rounded-xl hover:bg-slate-50 hover:shadow-sm transition-all">
            Back Home
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {['All', 'LLM', 'Image', 'Video', 'Developer', 'Productivity'].map(cat => (
             <button key={cat} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${cat === 'All' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
               {cat}
             </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div key={tool.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all flex flex-col h-full group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                      {tool.name.charAt(0)}
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{tool.name}</h3>
                     <span className="text-xs font-medium text-slate-400">{tool.category}</span>
                   </div>
                </div>
                {tool.trend === 'hot' && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
                {tool.trend === 'rising' && <span className="text-emerald-500 text-sm" title="Rising">↗</span>}
              </div>
              
              <p className="text-slate-600 text-sm flex-grow mb-5 line-clamp-3">{tool.description}</p>
              
              <div className="mt-auto">
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-slate-50 text-slate-500 text-xs rounded-md border border-slate-100">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-amber-500">
                     <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                     <span className="text-sm font-semibold text-slate-700">{tool.rating}</span>
                  </div>
                  <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center gap-1">
                    Try it <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
