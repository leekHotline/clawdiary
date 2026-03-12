'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface TemplateSection {
  id: string
  title: string
  placeholder: string
  required: boolean
  type: 'text' | 'list' | 'rating' | 'mood' | 'checkbox'
}

interface DiaryTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: string
  sections: TemplateSection[]
  tags: string[]
  isPublic: boolean
  isOfficial: boolean
  useCount: number
  creator: { id: string; name: string; avatar: string }
}

interface TemplateData {
  templates: DiaryTemplate[]
  categories: { id: string; name: string; icon: string }[]
  stats: { total: number; official: number; totalUses: number }
}

export default function TemplatesPage() {
  const [data, setData] = useState<TemplateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    icon: '📄',
    category: 'custom',
    sections: [] as TemplateSection[],
    tags: '',
  })

  useEffect(() => {
    fetchData()
  }, [activeCategory, searchQuery])

  const fetchData = async () => {
    try {
      const params = new URLSearchParams()
      if (activeCategory !== 'all') params.set('category', activeCategory)
      if (searchQuery) params.set('search', searchQuery)
      
      const res = await fetch(`/api/templates?${params}`)
      const json = await res.json()
      if (json.success) {
        setData(json.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = async () => {
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTemplate,
          tags: newTemplate.tags.split(',').map(t => t.trim()).filter(Boolean),
        })
      })
      const json = await res.json()
      if (json.success) {
        setShowCreateModal(false)
        setNewTemplate({ name: '', description: '', icon: '📄', category: 'custom', sections: [], tags: '' })
        fetchData()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const addSection = () => {
    setNewTemplate({
      ...newTemplate,
      sections: [
        ...newTemplate.sections,
        {
          id: `s_${Date.now()}`,
          title: '新区块',
          placeholder: '输入提示...',
          required: false,
          type: 'text',
        }
      ]
    })
  }

  const updateSection = (index: number, field: keyof TemplateSection, value: any) => {
    const sections = [...newTemplate.sections]
    sections[index] = { ...sections[index], [field]: value }
    setNewTemplate({ ...newTemplate, sections })
  }

  const removeSection = (index: number) => {
    const sections = newTemplate.sections.filter((_, i) => i !== index)
    setNewTemplate({ ...newTemplate, sections })
  }

  const getCategoryIcon = (category: string) => {
    const cat = data?.categories.find(c => c.id === category)
    return cat?.icon || '📄'
  }

  const getCategoryName = (category: string) => {
    const cat = data?.categories.find(c => c.id === category)
    return cat?.name || category
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-2xl">🦞</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📄 日记模板</h1>
            <p className="text-gray-600 mt-1">快速开始，让写作更轻松</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
          >
            <span>+</span> 创建模板
          </button>
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-blue-500">{data?.stats.total || 0}</div>
            <div className="text-sm text-gray-500">模板总数</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-purple-500">{data?.stats.official || 0}</div>
            <div className="text-sm text-gray-500">官方模板</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-green-500">{(data?.stats.totalUses || 0).toLocaleString()}</div>
            <div className="text-sm text-gray-500">总使用次数</div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          {/* 搜索 */}
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 搜索模板..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>
          
          {/* 分类 */}
          <div className="flex flex-wrap gap-2">
            {data?.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  activeCategory === cat.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 模板列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.templates.map((template) => (
            <Link
              key={template.id}
              href={`/templates/${template.id}`}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition group"
            >
              <div className="flex items-start gap-3">
                <div className="text-4xl">{template.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
                      {template.name}
                    </h3>
                    {template.isOfficial && (
                      <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded">
                        官方
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{template.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-400">{getCategoryName(template.category)}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-blue-500">{template.useCount} 次使用</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-gray-50 text-gray-400 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 区块预览 */}
              <div className="mt-3 pt-3 border-t border-gray-50">
                <div className="text-xs text-gray-400 mb-1">包含 {template.sections.length} 个区块</div>
                <div className="flex flex-wrap gap-1">
                  {template.sections.slice(0, 3).map((section) => (
                    <span key={section.id} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                      {section.title}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 创建模板弹窗 */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">创建自定义模板</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="text-center">
                    <div className="text-4xl mb-1">{newTemplate.icon}</div>
                    <input
                      type="text"
                      value={newTemplate.icon}
                      onChange={(e) => setNewTemplate({ ...newTemplate, icon: e.target.value })}
                      className="w-16 text-center text-sm p-1 border rounded"
                      maxLength={2}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                      placeholder="模板名称"
                      className="w-full p-2 border rounded-lg mb-2"
                    />
                    <input
                      type="text"
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                      placeholder="模板描述"
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  >
                    {data?.categories.filter(c => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* 区块列表 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">内容区块</label>
                    <button
                      onClick={addSection}
                      className="text-sm text-blue-500 hover:text-blue-600"
                    >
                      + 添加区块
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {newTemplate.sections.map((section, index) => (
                      <div key={section.id} className="flex gap-2 items-center p-2 bg-gray-50 rounded-lg">
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateSection(index, 'title', e.target.value)}
                          placeholder="区块标题"
                          className="flex-1 p-1.5 border rounded text-sm"
                        />
                        <select
                          value={section.type}
                          onChange={(e) => updateSection(index, 'type', e.target.value)}
                          className="p-1.5 border rounded text-sm"
                        >
                          <option value="text">文本</option>
                          <option value="list">列表</option>
                          <option value="rating">评分</option>
                          <option value="mood">心情</option>
                        </select>
                        <button
                          onClick={() => removeSection(index)}
                          className="text-red-400 hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    
                    {newTemplate.sections.length === 0 && (
                      <div className="text-center text-gray-400 py-4 text-sm">
                        点击上方按钮添加内容区块
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标签（逗号分隔）</label>
                  <input
                    type="text"
                    value={newTemplate.tags}
                    onChange={(e) => setNewTemplate({ ...newTemplate, tags: e.target.value })}
                    placeholder="例如：日常, 日记"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                
                <button
                  onClick={handleCreateTemplate}
                  disabled={!newTemplate.name}
                  className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  创建模板
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}