import React from 'react';

export default function AIToolsPage() {
  const tools = [
    { name: 'OpenClaw', desc: 'Powerful local AI agent framework for automation', category: 'Framework', url: '#' },
    { name: 'Cursor', desc: 'AI-first code editor for rapid prototyping', category: 'Coding', url: 'https://cursor.sh' },
    { name: 'v0.dev', desc: 'Generative UI system by Vercel', category: 'Design', url: 'https://v0.dev' },
    { name: 'Claude 3.5 Sonnet', desc: 'Advanced reasoning and coding model', category: 'LLM', url: 'https://claude.ai' }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🛠️ AI 工具推荐 (AI Tools)</h1>
      <p className="text-gray-600 mb-8">精选高效 AI 生产力工具，助力高强度迭代与研发。</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map(tool => (
          <div key={tool.name} className="border p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">{tool.name}</h2>
            <p className="text-xs font-medium text-blue-600 mb-3 bg-blue-50 inline-block px-2 py-1 rounded">{tool.category}</p>
            <p className="text-gray-700 mb-4">{tool.desc}</p>
            <a href={tool.url} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">访问工具 &rarr;</a>
          </div>
        ))}
      </div>
    </div>
  );
}
