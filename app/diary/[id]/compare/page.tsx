'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ComparePage() {
  const params = useParams();
  const diaryId = params.id;
  
  const [selectedVersions, setSelectedVersions] = useState<[string, string]>(['', '']);
  
  // 模拟版本数据
  const versions = [
    { id: 'v5', number: 5, date: '2024-03-10 15:30', changes: '修复错别字', author: 'Alex' },
    { id: 'v4', number: 4, date: '2024-03-10 12:00', changes: '添加新段落', author: 'Alex' },
    { id: 'v3', number: 3, date: '2024-03-09 18:45', changes: '修改心情标记', author: 'Alex' },
    { id: 'v2', number: 2, date: '2024-03-09 10:00', changes: '初始编辑', author: 'Alex' },
    { id: 'v1', number: 1, date: '2024-03-08 20:00', changes: '创建日记', author: 'Alex' },
  ];

  // 模拟版本内容
  const versionContent: Record<string, { title: string; content: string; tags: string[] }> = {
    'v1': {
      title: '第一天',
      content: `今天是开始的第一天。

我决定开始写日记，记录每一天的生活。

这是一个新的开始，希望能够坚持下去。`,
      tags: ['开始', '决心']
    },
    'v2': {
      title: '第一天',
      content: `今天是开始的第一天。

我决定开始写日记，记录每一天的生活。

这是一个新的开始，希望能够坚持下去。

今天天气很好，阳光明媚。`,
      tags: ['开始', '决心', '阳光']
    },
    'v3': {
      title: '第一天 - 新的开始',
      content: `今天是开始的第一天。

我决定开始写日记，记录每一天的生活。

这是一个新的开始，希望能够坚持下去。

今天天气很好，阳光明媚。心情也不错。

新增了一段内容。`,
      tags: ['开始', '决心', '阳光', '心情']
    },
    'v4': {
      title: '第一天 - 新的开始',
      content: `今天是开始的第一天。

我决定开始写日记，记录每一天的生活。这是一个重要的决定。

这是一个新的开始，希望能够坚持下去。

今天天气很好，阳光明媚。心情也不错。

新增了一段内容。

## 今日感悟

开始是成功的一半。只要坚持下去，一定会有收获。`,
      tags: ['开始', '决心', '阳光', '心情', '感悟']
    },
    'v5': {
      title: '第一天 - 新的开始',
      content: `今天是开始的第一天。

我决定开始写日记，记录每一天的生活。这是一个重要的决定。

这是一个新的开始，希望能够坚持下去。

今天天气很好，阳光明媚。心情也不错。

新增了一段内容。

## 今日感悟

开始是成功的一半。只要坚持下去，一定会有收获。

> "千里之行，始于足下。"

这句话一直激励着我。`,
      tags: ['开始', '决心', '阳光', '心情', '感悟', '名言']
    }
  };

  const handleVersionSelect = (versionId: string, index: number) => {
    setSelectedVersions(prev => {
      const newVersions = [...prev] as [string, string];
      newVersions[index] = versionId;
      return newVersions;
    });
  };

  const renderDiff = (oldContent: string, newContent: string) => {
    const oldLines = oldContent.split('\n');
    const newLines = newContent.split('\n');
    
    const result: JSX.Element[] = [];
    const maxLines = Math.max(oldLines.length, newLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i] || '';
      const newLine = newLines[i] || '';
      
      if (oldLine === newLine) {
        result.push(
          <div key={i} className="flex">
            <div className="w-1/2 p-2 bg-gray-50 font-mono text-sm">{oldLine || '\u00A0'}</div>
            <div className="w-1/2 p-2 bg-gray-50 font-mono text-sm">{newLine || '\u00A0'}</div>
          </div>
        );
      } else if (oldLine && !newLine) {
        result.push(
          <div key={i} className="flex">
            <div className="w-1/2 p-2 bg-red-50 text-red-700 line-through font-mono text-sm">{oldLine}</div>
            <div className="w-1/2 p-2 bg-gray-100 font-mono text-sm text-gray-400">[删除]</div>
          </div>
        );
      } else if (!oldLine && newLine) {
        result.push(
          <div key={i} className="flex">
            <div className="w-1/2 p-2 bg-gray-100 font-mono text-sm text-gray-400">[新增]</div>
            <div className="w-1/2 p-2 bg-green-50 text-green-700 font-mono text-sm">{newLine}</div>
          </div>
        );
      } else {
        result.push(
          <div key={i} className="flex">
            <div className="w-1/2 p-2 bg-red-50 text-red-700 font-mono text-sm">{oldLine}</div>
            <div className="w-1/2 p-2 bg-green-50 text-green-700 font-mono text-sm">{newLine}</div>
          </div>
        );
      }
    }
    
    return result;
  };

  const leftVersion = versionContent[selectedVersions[0]];
  const rightVersion = versionContent[selectedVersions[1]];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/diary/${diaryId}`} className="text-amber-600 hover:text-amber-700 mb-4 inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回日记
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🔍 版本对比</h1>
          <p className="text-gray-600">选择两个版本进行对比</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Version List */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📜 版本历史</h2>
            <div className="space-y-3">
              {versions.map((version) => (
                <button
                  key={version.id}
                  onClick={() => {
                    if (!selectedVersions[0]) {
                      handleVersionSelect(version.id, 0);
                    } else if (!selectedVersions[1] && version.id !== selectedVersions[0]) {
                      handleVersionSelect(version.id, 1);
                    } else {
                      handleVersionSelect(version.id, 0);
                      setSelectedVersions(['', ''] as [string, string]);
                      setTimeout(() => handleVersionSelect(version.id, 0), 0);
                    }
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-colors ${
                    selectedVersions.includes(version.id)
                      ? 'bg-amber-100 border-2 border-amber-400'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-800">V{version.number}</span>
                    {selectedVersions[0] === version.id && (
                      <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded">对比版 A</span>
                    )}
                    {selectedVersions[1] === version.id && (
                      <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded">对比版 B</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{version.date}</p>
                  <p className="text-sm text-gray-600 mt-1">{version.changes}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Area */}
          <div className="lg:col-span-3 space-y-6">
            {selectedVersions[0] && selectedVersions[1] ? (
              <>
                {/* Version Headers */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-amber-100 rounded-xl p-4">
                    <h3 className="font-bold text-amber-800">
                      版本 A: V{versions.find(v => v.id === selectedVersions[0])?.number}
                    </h3>
                    <p className="text-sm text-amber-600">
                      {versions.find(v => v.id === selectedVersions[0])?.date}
                    </p>
                  </div>
                  <div className="bg-orange-100 rounded-xl p-4">
                    <h3 className="font-bold text-orange-800">
                      版本 B: V{versions.find(v => v.id === selectedVersions[1])?.number}
                    </h3>
                    <p className="text-sm text-orange-600">
                      {versions.find(v => v.id === selectedVersions[1])?.date}
                    </p>
                  </div>
                </div>

                {/* Title Comparison */}
                {leftVersion && rightVersion && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">📌 标题对比</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-xl ${leftVersion.title !== rightVersion.title ? 'bg-red-50' : 'bg-gray-50'}`}>
                        <p className="font-medium text-gray-800">{leftVersion.title}</p>
                      </div>
                      <div className={`p-4 rounded-xl ${leftVersion.title !== rightVersion.title ? 'bg-green-50' : 'bg-gray-50'}`}>
                        <p className="font-medium text-gray-800">{rightVersion.title}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags Comparison */}
                {leftVersion && rightVersion && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">🏷️ 标签对比</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex flex-wrap gap-2">
                          {leftVersion.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`px-3 py-1 rounded-full text-sm ${
                                rightVersion.tags.includes(tag)
                                  ? 'bg-gray-200 text-gray-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex flex-wrap gap-2">
                          {rightVersion.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`px-3 py-1 rounded-full text-sm ${
                                leftVersion.tags.includes(tag)
                                  ? 'bg-gray-200 text-gray-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Comparison */}
                {leftVersion && rightVersion && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">📝 内容对比</h3>
                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      <div className="flex border-b border-gray-200 bg-gray-100">
                        <div className="w-1/2 p-3 text-center font-medium text-gray-600 bg-red-50">版本 A</div>
                        <div className="w-1/2 p-3 text-center font-medium text-gray-600 bg-green-50">版本 B</div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {renderDiff(leftVersion.content, rightVersion.content)}
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-100 rounded"></div>
                        <span>删除/旧内容</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 rounded"></div>
                        <span>新增内容</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-100 rounded"></div>
                        <span>未变更</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  <button className="flex-1 bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-700 transition-colors">
                    恢复到版本 A
                  </button>
                  <button className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors">
                    恢复到版本 B
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">选择两个版本进行对比</h3>
                <p className="text-gray-600">点击左侧版本列表中的版本，选择两个不同的版本进行对比</p>
                <div className="mt-6 flex justify-center gap-4">
                  <div className="flex items-center gap-2 text-amber-600">
                    <span className="w-3 h-3 bg-amber-500 rounded"></span>
                    <span>对比版 A（较早版本）</span>
                  </div>
                  <div className="flex items-center gap-2 text-orange-600">
                    <span className="w-3 h-3 bg-orange-500 rounded"></span>
                    <span>对比版 B（较新版本）</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}