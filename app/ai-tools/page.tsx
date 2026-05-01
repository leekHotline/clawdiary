"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, ExternalLink, Star, ArrowRight, Sparkles, Filter, BookmarkPlus, Zap } from "lucide-react"

export default function AIToolsLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = ["All", "Productivity", "Writing", "Development", "Design", "Research"]

  const tools = [
    {
      id: 1,
      name: "ChatGPT",
      description: "Advanced AI language model for conversation, text generation, and problem solving.",
      category: "Productivity",
      url: "https://chat.openai.com",
      tags: ["LLM", "Chat", "Assistant"],
      featured: true,
      stars: 4.9
    },
    {
      id: 2,
      name: "Claude",
      description: "Anthropic's AI assistant, excellent for long-form content, coding, and nuanced analysis.",
      category: "Writing",
      url: "https://claude.ai",
      tags: ["Writing", "Analysis", "Coding"],
      featured: true,
      stars: 4.8
    },
    {
      id: 3,
      name: "Cursor",
      description: "The AI-first code editor. Build software faster with an editor designed for pair programming with AI.",
      category: "Development",
      url: "https://cursor.sh",
      tags: ["IDE", "Coding", "Copilot"],
      featured: true,
      stars: 4.9
    },
    {
      id: 4,
      name: "Midjourney",
      description: "Generates high-quality images from text descriptions, operating through Discord.",
      category: "Design",
      url: "https://midjourney.com",
      tags: ["Image", "Art", "Discord"],
      featured: false,
      stars: 4.7
    },
    {
      id: 5,
      name: "Perplexity",
      description: "AI search engine that provides cited answers to complex queries in real-time.",
      category: "Research",
      url: "https://perplexity.ai",
      tags: ["Search", "Research", "Citations"],
      featured: true,
      stars: 4.8
    },
    {
      id: 6,
      name: "Notion AI",
      description: "Integrated AI assistant that helps you write, brainstorm, edit, and summarize within Notion.",
      category: "Productivity",
      url: "https://notion.so",
      tags: ["Workspace", "Writing", "Notes"],
      featured: false,
      stars: 4.6
    }
  ]

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = activeCategory === "All" || tool.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-8 pb-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Tools Library</h1>
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg mb-8">
            A curated collection of the most powerful and useful AI tools to supercharge your workflow. Discover, compare, and integrate the best AI into your daily routine.
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tools, categories, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow shadow-sm"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        
        {/* Featured Section */}
        {searchQuery === "" && activeCategory === "All" && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Featured Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.filter(t => t.featured).map((tool, index) => (
                <ToolCard key={tool.id} tool={tool} index={index} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Tools Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            {searchQuery ? "Search Results" : activeCategory === "All" ? "All Tools" : `${activeCategory} Tools`}
            <span className="text-gray-500 text-sm font-normal ml-3">({filteredTools.length} found)</span>
          </h2>
          
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool, index) => (
                <ToolCard key={tool.id} tool={tool} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tools found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find what you&apos;re looking for.</p>
              <button 
                onClick={() => {setSearchQuery(""); setActiveCategory("All")}}
                className="mt-4 text-blue-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ToolCard({ tool, index, featured = false }: { tool: any, index: number, featured?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl border ${
        featured ? 'border-amber-200 dark:border-amber-900/50 shadow-md' : 'border-gray-200 dark:border-gray-700 shadow-sm'
      } overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
    >
      {featured && (
        <div className="absolute top-0 right-0 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-bl-lg">
          Featured
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-xl font-bold text-gray-700 dark:text-gray-300">
            {tool.name.charAt(0)}
          </div>
          <button className="text-gray-400 hover:text-blue-500 transition-colors">
            <BookmarkPlus className="w-5 h-5" />
          </button>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {tool.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2">
          {tool.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {tool.tags.map((tag: string) => (
            <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span>{tool.stars}</span>
          </div>
          
          <a 
            href={tool.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Visit Site
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}
