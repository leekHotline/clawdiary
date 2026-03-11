'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BatchPage() {
  const [selectedCount, setSelectedCount] = useState(0);
  const [operation, setOperation] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  // 模拟日记数据
  const diaries = [
    { id: '1', title: '第一天', date: '2024-03-01', tags: ['开始'] },
    { id: '2', title: '第二天', date: '2024-03-02', tags: ['成长'] },
    { id: '3', title: '第三天', date: '2024-03-03', tags: ['思考'] },
    { id: '4', title: '第四天', date: '2024-03-04', tags: ['感悟'] },
    { id: '5', title: '第五天', date: '2024-03-05', tags: ['坚持'] },
  ];

  const operations = [
    { id: 'add-tag', name: '添加标签', icon: '🏷️' },
    { id: 'remove-tag', name: '移除标签', icon: '🏷️' },
    { id: 'change-mood', name: '修改心情', icon: '😊' },
    { id: 'change-privacy', name: '修改隐私', icon: '🔒' },
    { id: 'export', name: '批量导出', icon: '📤' },
    { id: 'archive', name: '归档', icon: '📦' },
    { id: 'delete', name: '删除', icon: '🗑️', danger: true },
  ];

  const handleOperation = async () => {
    if (!operation || selectedCount === 0) return;
    
    setIsProcessing(true);
    setResults([]);
    
    // 模拟处理
    await new Promise(r => setTimeout(r, 1500));
    
    setResults([
      `已选择 ${selectedCount} 篇日记`,
      `执行操作: ${operations.find(o => o.id === operation)?.name}`,
      '操作完成!'
    ]);
    
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 mb-4 inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">⚡ 批量操作</h1>
          <p className="text-gray-600">选择多篇日记进行批量编辑</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selection Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">📋 选择日记</h2>
                <div className="flex gap-2">
                  <button className="text-sm text-indigo-600 hover:text-indigo-700">
                    全选
                  </button>
                  <span className="text-gray-300">|</span>
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    清除选择
                  </button>
                </div>
              </div>
              
              {/* Filter */}
              <div className="flex flex-wrap gap-3 mb-4">
                <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                  <option>所有日期</option>
                  <option>最近一周</option>
                  <option>最近一月</option>
                  <option>最近一年</option>
                </select>
                <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                  <option>所有标签</option>
                  <option>成长</option>
                  <option>思考</option>
                  <option>感悟</option>
                </select>
                <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                  <option>所有心情</option>
                  <option>😊 开心</option>
                  <option>😔 难过</option>
                  <option>🤔 思考</option>
                </select>
              </div>

              {/* Diary List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {diaries.map((diary) => (
                  <label
                    key={diary.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      onChange={(e) => {
                        setSelectedCount(prev => e.target.checked ? prev + 1 : prev - 1);
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{diary.title}</p>
                      <p className="text-sm text-gray-500">{diary.date}</p>
                    </div>
                    <div className="flex gap-2">
                      {diary.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </label>
                ))}
              </div>

              {/* Selection Info */}
              {selectedCount > 0 && (
                <div className="mt-4 p-3 bg-indigo-50 rounded-xl flex items-center justify-between">
                  <span className="text-indigo-700">
                    已选择 <strong>{selectedCount}</strong> 篇日记
                  </span>
                  <button 
                    onClick={() => setSelectedCount(0)}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    清除
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Operations */}
          <div className="space-y-6">
            {/* Available Operations */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">🔧 可用操作</h2>
              <div className="space-y-2">
                {operations.map((op) => (
                  <button
                    key={op.id}
                    onClick={() => setOperation(op.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      operation === op.id 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : op.danger 
                          ? 'hover:bg-red-50 text-gray-700' 
                          : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-xl">{op.icon}</span>
                    <span className="font-medium">{op.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Operation Options */}
            {operation && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">⚙️ 操作选项</h2>
                
                {operation === 'add-tag' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">添加标签</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="输入标签名称"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['重要', '待办', '收藏'].map((tag) => (
                        <button key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200">
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {operation === 'change-mood' && (
                  <div className="flex flex-wrap gap-3">
                    {['😊', '😔', '🤔', '😴', '😤', '🎉'].map((mood) => (
                      <button
                        key={mood}
                        className="w-12 h-12 text-2xl bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                )}

                {operation === 'change-privacy' && (
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100">
                      <span className="text-xl">🌐</span>
                      <div className="text-left">
                        <p className="font-medium">公开</p>
                        <p className="text-sm text-gray-500">所有人可见</p>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100">
                      <span className="text-xl">👥</span>
                      <div className="text-left">
                        <p className="font-medium">仅关注者</p>
                        <p className="text-sm text-gray-500">仅关注者可见</p>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100">
                      <span className="text-xl">🔒</span>
                      <div className="text-left">
                        <p className="font-medium">私密</p>
                        <p className="text-sm text-gray-500">仅自己可见</p>
                      </div>
                    </button>
                  </div>
                )}

                {operation === 'export' && (
                  <div className="space-y-3">
                    {['Markdown (.md)', 'JSON', 'PDF', 'Word (.docx)'].map((format) => (
                      <button
                        key={format}
                        className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100"
                      >
                        <span className="text-xl">📄</span>
                        <span className="font-medium">{format}</span>
                      </button>
                    ))}
                  </div>
                )}

                {operation === 'delete' && (
                  <div className="p-4 bg-red-50 rounded-xl">
                    <p className="text-red-700 mb-3">
                      ⚠️ 删除操作无法撤销！确定要删除选中的 {selectedCount} 篇日记吗？
                    </p>
                    <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
                      确认删除
                    </button>
                  </div>
                )}

                {operation && !['add-tag', 'change-mood', 'change-privacy', 'export', 'delete'].includes(operation) && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-600">选择选项后执行操作</p>
                  </div>
                )}
              </div>
            )}

            {/* Execute Button */}
            <button
              onClick={handleOperation}
              disabled={selectedCount === 0 || !operation || isProcessing}
              className={`w-full py-4 rounded-xl font-bold text-white transition-colors ${
                selectedCount > 0 && operation
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  处理中...
                </span>
              ) : (
                `执行操作 ${selectedCount > 0 ? `(${selectedCount})` : ''}`
              )}
            </button>

            {/* Results */}
            {results.length > 0 && (
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <h3 className="font-bold text-green-800 mb-3">✅ 操作结果</h3>
                <ul className="space-y-2">
                  {results.map((result, i) => (
                    <li key={i} className="text-green-700">{result}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}