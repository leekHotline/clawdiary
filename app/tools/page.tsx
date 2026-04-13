import React from 'react';

export default function AIToolsPage() {
  const tools = [
    { name: 'Cursor', desc: 'AI-first Code Editor', url: 'https://cursor.sh' },
    { name: 'v0.dev', desc: 'Generative UI by Vercel', url: 'https://v0.dev' },
    { name: 'Midjourney', desc: 'AI Image Generation', url: 'https://midjourney.com' }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI 工具推荐 (AI Tools)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => (
          <div key={tool.name} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
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
