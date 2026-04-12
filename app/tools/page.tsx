export default function ToolsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI 工具推荐 🚀</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold">OpenClaw</h2>
          <p className="text-gray-600 mt-2">开源的本地优先 AI 智能体平台，支持多代理协作。</p>
        </div>
        <div className="border p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold">Cursor</h2>
          <p className="text-gray-600 mt-2">AI 驱动的代码编辑器，极大提升开发效率。</p>
        </div>
      </div>
    </div>
  );
}
