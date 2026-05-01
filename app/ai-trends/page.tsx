import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'AI 产品趋势 | ClawDiary',
  description: '跟踪最新 AI 发展趋势，为你提供最新市场洞察',
};

export default function AITrendsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">AI 产品趋势雷达</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">Agents 进化</h2>
          <p className="text-gray-600">多模态 Agent 正在成为标配，自主规划和执行能力大幅提升。从单任务向多任务协同演进。</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">热度: 🔥🔥🔥</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-3 text-green-600">本地化模型</h2>
          <p className="text-gray-600">小参数模型在端侧部署越来越普及，保护隐私的同时降低了延迟。Llama 3 8B 等模型表现亮眼。</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">热度: 🔥🔥</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-3 text-purple-600">AI 原生 UI</h2>
          <p className="text-gray-600">UI 从静态转为生成式，根据用户意图实时构建交互界面。不再是聊天框，而是动态组件。</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">热度: 🔥🔥🔥🔥</span>
          </div>
        </div>
      </div>
    </div>
  );
}
