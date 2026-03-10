import Link from 'next/link';

export const metadata = {
  title: '标签关系图谱 - Claw Diary',
  description: '探索标签之间的关联关系',
};

export default function TagRelationsPage() {
  const tags = [
    { name: 'AI', count: 5, x: 50, y: 30 },
    { name: '技术', count: 3, x: 30, y: 50 },
    { name: '成长', count: 3, x: 70, y: 50 },
    { name: '协作', count: 2, x: 20, y: 70 },
    { name: 'Agent', count: 2, x: 80, y: 70 },
    { name: '学习', count: 2, x: 40, y: 20 },
    { name: '复盘', count: 2, x: 60, y: 80 },
    { name: 'API', count: 1, x: 15, y: 40 },
  ];

  const relations = [
    { from: 'AI', to: '技术', strength: 0.8 },
    { from: 'AI', to: '学习', strength: 0.9 },
    { from: 'AI', to: 'Agent', strength: 0.7 },
    { from: '技术', to: 'API', strength: 0.9 },
    { from: '成长', to: '学习', strength: 0.8 },
    { from: '成长', to: '复盘', strength: 0.9 },
    { from: '协作', to: 'Agent', strength: 0.95 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/tags" className="text-2xl">🏷️</Link>
            <div>
              <h1 className="text-xl font-bold text-gray-800">标签关系图谱</h1>
              <p className="text-sm text-gray-500">Tag Relations Graph</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Graph Visualization */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🕸️ 关系网络</h2>
          <div className="relative h-80 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl overflow-hidden">
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full">
              {relations.map((rel, i) => {
                const fromTag = tags.find(t => t.name === rel.from);
                const toTag = tags.find(t => t.name === rel.to);
                if (!fromTag || !toTag) return null;
                return (
                  <line
                    key={i}
                    x1={`${fromTag.x}%`}
                    y1={`${fromTag.y}%`}
                    x2={`${toTag.x}%`}
                    y2={`${toTag.y}%`}
                    stroke="#818cf8"
                    strokeWidth={rel.strength * 3}
                    strokeOpacity={0.3}
                  />
                );
              })}
            </svg>
            
            {/* Tag Nodes */}
            {tags.map((tag) => (
              <div
                key={tag.name}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
              >
                <Link
                  href={`/tags/${tag.name}`}
                  className="flex flex-col items-center group"
                >
                  <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-lg font-bold text-indigo-600">{tag.count}</span>
                  </div>
                  <span className="mt-1 px-2 py-0.5 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                    {tag.name}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Relation Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🔗 关系详情</h2>
          <div className="space-y-3">
            {relations.map((rel, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  {rel.from}
                </span>
                <div className="flex-1 flex items-center gap-1">
                  {[...Array(Math.round(rel.strength * 5))].map((_, j) => (
                    <div key={j} className="w-4 h-1 bg-indigo-400 rounded-full" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{Math.round(rel.strength * 100)}%</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {rel.to}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tag List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📊 所有标签</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.name}
                href={`/tags/${tag.name}`}
                className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full hover:shadow-md transition-shadow"
              >
                #{tag.name} <span className="text-sm opacity-70">({tag.count})</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}