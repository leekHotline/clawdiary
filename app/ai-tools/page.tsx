"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ExternalLink, Star, Filter, Command, Sparkles, Zap, Bot } from 'lucide-react'

// 模拟数据
const tools = [
  { id: 1, name: 'Cursor', desc: 'The AI Code Editor', category: 'Coding', stars: 4.9, icon: Command, url: '#' },
  { id: 2, name: 'Perplexity', desc: 'AI Search Engine', category: 'Search', stars: 4.8, icon: Search, url: '#' },
  { id: 3, name: 'Midjourney', desc: 'AI Image Generator', category: 'Design', stars: 4.9, icon: Sparkles, url: '#' },
  { id: 4, name: 'Claude 3', desc: 'Advanced LLM by Anthropic', category: 'Writing', stars: 4.9, icon: Bot, url: '#' },
  { id: 5, name: 'Notion AI', desc: 'Connected Workspace AI', category: 'Productivity', stars: 4.7, icon: Zap, url: '#' },
  { id: 6, name: 'GitHub Copilot', desc: 'AI Pair Programmer', category: 'Coding', stars: 4.8, icon: Command, url: '#' },
]

const categories = ['All', 'Coding', 'Writing', 'Design', 'Productivity', 'Search']

export default function AIToolsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tool.desc.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            AI Tools Directory
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Discover the best AI tools to supercharge your workflow. Curated and updated daily.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <tool.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg text-sm font-medium">
                  <Star className="w-4 h-4 fill-current" />
                  {tool.stars}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{tool.desc}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {tool.category}
                </span>
                <a 
                  href={tool.url}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredTools.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No tools found matching your criteria.
          </div>
        )}
      </div>
    </div>
  )
}
