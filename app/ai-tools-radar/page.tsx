"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Radar, TrendingUp, Zap, Sparkles, Filter, ExternalLink, Star, ArrowUpRight } from 'lucide-react'

// 模拟数据
const radarItems = [
  { id: 1, name: 'Suno V3', category: 'Audio Gen', trend: 'hot', desc: 'Breakthrough in AI music generation with realistic vocals.', score: 98, url: '#' },
  { id: 2, name: 'Claude 3.5 Sonnet', category: 'LLM', trend: 'rising', desc: 'New benchmark in coding and reasoning tasks.', score: 96, url: '#' },
  { id: 3, name: 'Luma Dream Machine', category: 'Video Gen', trend: 'hot', desc: 'Fast, high-quality text-to-video model.', score: 92, url: '#' },
  { id: 4, name: 'Cursor Composer', category: 'DevTools', trend: 'rising', desc: 'Multi-file AI editing feature taking over dev workflows.', score: 95, url: '#' },
  { id: 5, name: 'OpenAI Sora', category: 'Video Gen', trend: 'stable', desc: 'Photorealistic text-to-video generator.', score: 99, url: '#' },
  { id: 6, name: 'Grok 1.5', category: 'LLM', trend: 'new', desc: 'Latest open-weight model with improved reasoning.', score: 88, url: '#' },
  { id: 7, name: 'V0 by Vercel', category: 'DevTools', trend: 'hot', desc: 'Generative UI built on React and Tailwind.', score: 94, url: '#' },
  { id: 8, name: 'Midjourney v6', category: 'Image Gen', trend: 'stable', desc: 'State of the art image generation with better text rendering.', score: 97, url: '#' },
]

export default function AIToolsRadarPage() {
  const [filter, setFilter] = useState('all')

  const filteredItems = filter === 'all' 
    ? radarItems 
    : radarItems.filter(item => item.trend === filter)

  const getTrendBadge = (trend: string) => {
    switch(trend) {
      case 'hot': return <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full"><Zap className="w-3 h-3" /> HOT</span>
      case 'rising': return <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full"><TrendingUp className="w-3 h-3" /> RISING</span>
      case 'new': return <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full"><Sparkles className="w-3 h-3" /> NEW</span>
      default: return <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">STABLE</span>
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              <Radar className="w-4 h-4 animate-pulse" />
              Live Radar
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              AI Trend Radar
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Tracking the fastest-growing and most impactful AI tools in the market right now. Updated continuously.
            </p>
          </div>
          
          <div className="flex gap-2">
            {['all', 'hot', 'rising', 'new'].map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                  filter === t 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Radar List */}
        <div className="grid gap-4">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all flex flex-col md:flex-row gap-6 items-start md:items-center"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center border border-indigo-100/50">
                <span className="text-2xl font-black text-indigo-600">#{item.id}</span>
              </div>
              
              <div className="flex-grow space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.name}
                  </h3>
                  {getTrendBadge(item.trend)}
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md uppercase tracking-wide">
                    {item.category}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="flex flex-col items-center justify-center px-4">
                  <span className="text-3xl font-black text-slate-800">{item.score}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</span>
                </div>
                
                <a 
                  href={item.url}
                  className="ml-auto md:ml-0 flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-200"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
            <Radar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700">No signals found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters.</p>
          </div>
        )}

      </div>
    </div>
  )
}