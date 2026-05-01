import React from 'react';

export default function ToolsPage() {
  const tools = [
    { name: 'Cursor', desc: 'AI-first Code Editor for rapid development', category: 'Coding' },
    { name: 'v0.dev', desc: 'Generative UI by Vercel', category: 'Design' },
    { name: 'OpenClaw', desc: 'Open Source Personal AI Agent Framework', category: 'Agents' },
    { name: 'Perplexity', desc: 'AI-powered research and search engine', category: 'Research' }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI 工具推荐 (Tools)</h1>
      <p className="mb-8 text-gray-600">精心挑选的 AI 效率工具库，提升开发与产品迭代速度。</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map(t => (
          <div key={t.name} className="block p-6 border rounded-lg hover:shadow-lg transition cursor-pointer">
            <span className="text-xs font-bold text-blue-500 mb-2 block">{t.category}</span>
            <h2 className="text-xl font-semibold mb-2">{t.name}</h2>
            <p className="text-gray-600">{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}