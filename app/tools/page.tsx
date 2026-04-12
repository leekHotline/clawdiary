export default function ToolsPage() {
  const tools = [
    { name: 'Cursor', desc: 'The AI Code Editor', url: 'https://cursor.sh' },
    { name: 'OpenClaw', desc: 'Your Personal AI OS', url: 'https://github.com/openclaw' },
    { name: 'Midjourney', desc: 'AI Image Generation', url: 'https://midjourney.com' }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI 工具推荐 (AI Tools)</h1>
      <p className="mb-8 text-gray-600">精心挑选的 AI 生产力工具库，助你效率翻倍。</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => (
          <div key={tool.name} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">{tool.name}</h2>
            <p className="text-gray-600 mb-4">{tool.desc}</p>
            <a href={tool.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
              访问官网 &rarr;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
