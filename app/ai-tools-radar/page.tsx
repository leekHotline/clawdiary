"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ExternalLink, Star, TrendingUp } from "lucide-react"

const INITIAL_TOOLS = [
  { id: 1, name: 'Cursor', desc: 'The AI Code Editor', category: 'Coding', rating: 4.9, trending: true },
  { id: 2, name: 'Claude 3.5 Sonnet', desc: 'Anthropic\'s smartest model', category: 'LLM', rating: 4.8, trending: true },
  { id: 3, name: 'Midjourney v6', desc: 'High quality AI image generation', category: 'Image', rating: 4.7, trending: false },
  { id: 4, name: 'Perplexity', desc: 'AI-powered search engine', category: 'Search', rating: 4.8, trending: true },
  { id: 5, name: 'Suno', desc: 'Make any song with AI', category: 'Audio', rating: 4.6, trending: false },
  { id: 6, name: 'v0', desc: 'Generate UI with text', category: 'Design', rating: 4.7, trending: true },
]

export default function AIToolsRadar() {
  const [tools, setTools] = useState(INITIAL_TOOLS)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(INITIAL_TOOLS.map(t => t.category)))]

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) || 
                          tool.desc.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Tools Radar 📡</h1>
          <p className="text-muted-foreground mt-2">Discover and track the best AI tools on the market.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tools..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <Button 
              key={cat} 
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => setActiveCategory(cat)}
              className="whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => (
          <Card key={tool.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl flex items-center gap-2">
                  {tool.name}
                  {tool.trending && <TrendingUp className="h-4 w-4 text-green-500" />}
                </CardTitle>
                <Badge variant="secondary">{tool.category}</Badge>
              </div>
              <CardDescription>{tool.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium">{tool.rating}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2">
                Visit Site <ExternalLink className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredTools.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No tools found matching your criteria.
        </div>
      )}
    </div>
  )
}
