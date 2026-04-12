export default function ToolsPage() {
  const tools = [
    { name: 'Cursor', desc: 'The AI Code Editor', url: 'https://cursor.sh' },
    { name: 'Notion AI', desc: 'Connected workspace with AI', url: 'https://notion.so' },
    { name: 'OpenClaw', desc: 'Personal AI Agent Workspace', url: '#' }
  ];
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🚀 AI 工具推荐 (AI Tools)</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-300">精选提升生产力的 AI 工具合集，持续更新中。</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map(t => (
          <a key={t.name} href={t.url} target="_blank" rel="noreferrer" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{t.name}</h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">{t.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
