import Link from 'next/link';

export default function ToolsPage() {
  const tools = [
    { name: 'Cursor', desc: 'The AI Code Editor', url: 'https://cursor.sh' },
    { name: 'GitHub Copilot', desc: 'Your AI pair programmer', url: 'https://github.com/features/copilot' },
    { name: 'Midjourney', desc: 'AI image generation', url: 'https://midjourney.com' },
    { name: 'ChatGPT', desc: 'OpenAI\'s language model', url: 'https://chat.openai.com' },
    { name: 'Claude', desc: 'Anthropic\'s AI assistant', url: 'https://claude.ai' }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">AI 工具推荐</h1>
      <p className="text-xl text-gray-600 mb-12">精选实用 AI 效率工具，助力提升生产力。</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div key={tool.name} className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
            <h2 className="text-2xl font-semibold mb-3">{tool.name}</h2>
            <p className="text-gray-600 mb-4">{tool.desc}</p>
            <a 
              href={tool.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              访问官网 &rarr;
            </a>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; 返回首页
        </Link>
      </div>
    </div>
  );
}
