'use client';

import { useState, useEffect } from 'react';
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

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  templateCount: number;
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

const colorStyles: Record<string, string> = {
  blue: 'bg-blue-50 border-blue-200 hover:border-blue-400',
  purple: 'bg-purple-50 border-purple-200 hover:border-purple-400',
  green: 'bg-green-50 border-green-200 hover:border-green-400',
  yellow: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',
  gray: 'bg-gray-50 border-gray-200 hover:border-gray-400',
  teal: 'bg-teal-50 border-teal-200 hover:border-teal-400',
  pink: 'bg-pink-50 border-pink-200 hover:border-pink-400',
  indigo: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
  violet: 'bg-violet-50 border-violet-200 hover:border-violet-400',
  orange: 'bg-orange-50 border-orange-200 hover:border-orange-400'
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'recommend'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [templatesRes, categoriesRes] = await Promise.all([
        fetch('/api/templates'),
        fetch('/api/templates/categories')
      ]);
      
      const templatesData = await templatesRes.json();
      const categoriesData = await categoriesRes.json();
      
      if (templatesData.success) {
        setTemplates(templatesData.data);
      }
      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await fetch('/api/templates/recommend?limit=10');
      const data = await res.json();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    }
  };

  const fetchPopular = async () => {
    try {
      const res = await fetch('/api/templates?popular=true&limit=10');
      const data = await res.json();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch popular templates:', error);
    }
  };

  const handleTabChange = (tab: 'all' | 'popular' | 'recommend') => {
    setActiveTab(tab);
    setSelectedCategory(null);
    setSearchQuery('');
    setLoading(true);
    
    if (tab === 'all') {
      fetchData();
    } else if (tab === 'popular') {
      fetchPopular();
    } else if (tab === 'recommend') {
      fetchRecommendations();
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      try {
        const res = await fetch(`/api/templates?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setTemplates(data.data);
        }
      } catch (error) {
        console.error('Failed to search templates:', error);
      }
    }
  };

  const handleCategoryClick = async (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setSearchQuery('');
    
    if (categoryId !== selectedCategory) {
      try {
        const res = await fetch(`/api/templates?category=${categoryId}`);
        const data = await res.json();
        if (data.success) {
          setTemplates(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch category templates:', error);
      }
    } else {
      fetchData();
    }
  };

  const filteredTemplates = selectedCategory
    ? templates.filter(t => t.category === selectedCategory)
    : templates;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                📝 模板中心
              </h1>
              <p className="text-gray-600 mt-1">选择一个模板，开始你的写作之旅</p>
            </div>
            <Link 
              href="/write" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ✨ 自由写作
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: '全部模板' },
            { key: 'recommend', label: '为你推荐' },
            { key: 'popular', label: '热门模板' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key as 'all' | 'popular' | 'recommend')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索模板..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">分类浏览</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`p-3 rounded-xl border-2 transition-all text-center ${
                  selectedCategory === category.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : colorStyles[category.color] || 'bg-white border-gray-200'
                }`}
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="text-sm font-medium text-gray-800">{category.name}</div>
                <div className="text-xs text-gray-500">{category.templateCount} 个模板</div>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <Link
              key={template.id}
              href={`/templates/${template.id}`}
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{template.icon}</div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[template.difficulty]}`}>
                    {difficultyLabels[template.difficulty]}
                  </span>
                  <span className="text-xs text-gray-500">
                    🔥 {template.popularity}%
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                {template.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {template.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  📝 {template.wordCount.min}-{template.wordCount.max} 字
                </span>
                <span>
                  {template.sections.length} 个部分
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600">没有找到匹配的模板</p>
          </div>
        )}
      </main>
    </div>
  );
}