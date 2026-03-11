'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface TemplateSection {
  title: string;
  placeholder: string;
  required: boolean;
  maxLength?: number;
  suggestions?: string[];
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  tags: string[];
  sections: TemplateSection[];
  prompts: string[];
  wordCount: { min: number; max: number };
  difficulty: 'easy' | 'medium' | 'hard';
  popularity: number;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700'
};

const difficultyLabels = {
  easy: '简单',
  medium: '中等',
  hard: '困难'
};

const categoryLabels: Record<string, string> = {
  daily: '日常记录',
  emotion: '情绪表达',
  growth: '成长反思',
  creative: '创意写作',
  work: '工作日志',
  travel: '旅行日记',
  gratitude: '感恩日记',
  review: '复盘总结',
  dream: '梦境记录',
  learning: '学习笔记'
};

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;
  
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingTemplate, setUsingTemplate] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      const res = await fetch(`/api/templates/${templateId}`);
      const data = await res.json();
      if (data.success) {
        setTemplate(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async () => {
    if (!template) return;
    
    setUsingTemplate(true);
    try {
      const res = await fetch(`/api/templates/${template.id}/use`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'current-user' })
      });
      
      const data = await res.json();
      if (data.success) {
        // 跳转到写作页面并带上草稿数据
        const draft = data.data.draft;
        const encodedDraft = encodeURIComponent(JSON.stringify(draft));
        router.push(`/write?template=${template.id}&draft=${encodedDraft}`);
      }
    } catch (error) {
      console.error('Failed to use template:', error);
    } finally {
      setUsingTemplate(false);
    }
  };

  const toggleSection = (index: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">模板不存在</h2>
          <p className="text-gray-600 mb-4">找不到你想要的模板</p>
          <Link 
            href="/templates"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            返回模板中心
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/templates"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{template.icon}</span>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                  {categoryLabels[template.category] || template.category}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${difficultyColors[template.difficulty]}`}>
                  {difficultyLabels[template.difficulty]}
                </span>
              </div>
            </div>
            <button
              onClick={handleUseTemplate}
              disabled={usingTemplate}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {usingTemplate ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  创建中...
                </span>
              ) : (
                '使用此模板'
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Template Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{template.name}</h1>
          <p className="text-gray-600 mb-4">{template.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {template.tags.map(tag => (
              <span
                key={tag}
                className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>🔥 热度 {template.popularity}%</span>
            <span>📝 {template.wordCount.min}-{template.wordCount.max} 字</span>
            <span>📋 {template.sections.length} 个部分</span>
          </div>
        </div>

        {/* Writing Prompts */}
        {template.prompts.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">💡 写作提示</h2>
            <ul className="space-y-2">
              {template.prompts.map((prompt, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-indigo-500 mt-1">•</span>
                  <span>{prompt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sections */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">📝 日记结构</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {template.sections.map((section, index) => (
              <div key={index} className="border-b border-gray-100 last:border-b-0">
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-800">{section.title}</span>
                    {section.required && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">必填</span>
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.has(index) ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedSections.has(index) && (
                  <div className="px-6 pb-4">
                    <div className="ml-9 space-y-3">
                      <p className="text-gray-500 text-sm italic">
                        {section.placeholder}
                      </p>
                      {section.maxLength && (
                        <p className="text-xs text-gray-400">
                          建议字数：最多 {section.maxLength} 字
                        </p>
                      )}
                      {section.suggestions && section.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs text-gray-500">写作建议：</span>
                          {section.suggestions.map((suggestion, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {suggestion}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-center text-white">
          <h3 className="text-xl font-semibold mb-2">准备好了吗？</h3>
          <p className="text-indigo-100 mb-4">使用这个模板开始你的写作</p>
          <button
            onClick={handleUseTemplate}
            disabled={usingTemplate}
            className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {usingTemplate ? '创建中...' : '开始写作 ✨'}
          </button>
        </div>
      </main>
    </div>
  );
}