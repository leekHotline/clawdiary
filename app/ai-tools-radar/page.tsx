"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Flame, 
  Rocket, 
  Star, 
  ExternalLink, 
  ArrowUpRight,
  Sparkles,
  Search,
  Filter
} from 'lucide-react'

// Mock Data based on current AI trends
const trendingTools = [
  {
    id: 1,
    name: 'Cursor',
    description: 'The AI Code Editor built for pair programming.',
    category: 'Development',
    tags: ['Coding', 'AI Assistant', 'IDE'],
    growth: '+124%',
    users: '2.5M+',
    status: 'Hot',
    url: 'https://cursor.com',
    icon: Flame
  },
  {
    id: 2,
    name: 'Claude 3.5 Sonnet',
    description: 'Anthropic\'s most intelligent and capable model yet.',
    category: 'LLM',
    tags: ['Chat', 'Reasoning', 'Vision'],
    growth: '+89%',
    users: '10M+',
    status: 'Trending',
    url: 'https://anthropic.com',
    icon: Sparkles
  },
  {
    id: 3,
    name: 'Midjourney v6',
    description: 'High-quality AI image generation with incredible detail.',
    category: 'Design',
    tags: ['Image', 'Creative', 'Art'],
    growth: '+45%',
    users: '15M+',
    status: 'Stable',
    url: 'https://midjourney.com',
    icon: Star
  },
  {
    id: 4,
    name: 'Perplexity AI',
    description: 'AI-powered search engine that provides direct answers.',
    category: 'Search',
    tags: ['Research', 'Answers', 'Web'],
    growth: '+156%',
    users: '5M+',
    status: 'Hot',
    url: 'https://perplexity.ai',
    icon: Search
  },
  {
    id: 5,
    name: 'v0.dev',
    description: 'Generative UI system by Vercel. Describe UI, get code.',
    category: 'Development',
    tags: ['UI/UX', 'React', 'Tailwind'],
    growth: '+210%',
    users: '1M+',
    status: 'Rocket',
    url: 'https://v0.dev',
    icon: Rocket
  },
  {
    id: 6,
    name: 'Suno',
    description: 'Make a song about anything. High quality AI music generation.',
    category: 'Audio',
    tags: ['Music', 'Creative', 'Audio'],
    growth: '+180%',
    users: '3M+',
    status: 'Hot',
    url: 'https://suno.com',
    icon: Flame
  }
]

const categories = ['All', 'Development', 'LLM', 'Design', 'Search', 'Audio']

export default function AIToolsRadar() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTools = trendingTools.filter(tool => {
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Updated Daily</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            AI Tools <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Radar</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover the fastest-growing AI tools, models, and platforms shaping the future of technology.
          </p>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tools, tags, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700 placeholder-slate-400"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === category 
                    ? 'bg-slate-900 text-white shadow-md scale-105' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative overflow-hidden"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  tool.status === 'Hot' ? 'bg-orange-100 text-orange-700' :
                  tool.status === 'Rocket' ? 'bg-purple-100 text-purple-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {tool.status === 'Hot' && <Flame className="w-3 h-3" />}
                  {tool.status === 'Rocket' && <Rocket className="w-3 h-3" />}
                  {tool.status === 'Trending' && <TrendingUp className="w-3 h-3" />}
                  {tool.status}
                </span>
              </div>

              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-700 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <tool.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm font-medium text-slate-500">{tool.category}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">
                {tool.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {tool.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200/50">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer Stats & Action */}
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Growth</p>
                    <p className="text-sm font-bold text-emerald-600">{tool.growth}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Users</p>
                    <p className="text-sm font-bold text-slate-700">{tool.users}</p>
                  </div>
                </div>
                <a 
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 group/link"
                >
                  <ArrowUpRight className="w-5 h-5 group-hover/link:rotate-45 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No tools found</h3>
            <p className="text-slate-500">We couldn't find any tools matching "{searchQuery}" in the {activeCategory} category.</p>
          </motion.div>
        )}

      </div>
    </div>
  )
}
