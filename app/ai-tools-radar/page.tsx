"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ExternalLink, Star, ArrowUpRight, Sparkles, TrendingUp, Clock, ThumbsUp } from "lucide-react"

export default function AIToolsRadarPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ["All", "Agents", "Development", "Design", "Productivity", "Writing"]

  const tools = [
    {
      id: 1,
      name: "OpenClaw Evo",
      description: "Next-generation local AI agent orchestrator with multi-modal capabilities.",
      category: "Agents",
      tags: ["Local", "Multi-modal", "Open Source"],
      addedAt: "Just now",
      upvotes: 124,
      url: "https://github.com/openclaw",
      trending: true
    },
    {
      id: 2,
      name: "Cursor AI",
      description: "The AI Code Editor built for pair programming.",
      category: "Development",
      tags: ["Editor", "Copilot", "IDE"],
      addedAt: "2 hours ago",
      upvotes: 342,
      url: "https://cursor.sh",
      trending: true
    },
    {
      id: 3,
      name: "Midjourney v6",
      description: "High-quality AI image generation with incredible prompt adherence.",
      category: "Design",
      tags: ["Image", "Generative AI", "Art"],
      addedAt: "Yesterday",
      upvotes: 890,
      url: "https://midjourney.com",
      trending: false
    },
    {
      id: 4,
      name: "Notion AI",
      description: "Your notes, now with a built-in AI assistant.",
      category: "Productivity",
      tags: ["Writing", "Organization", "Workspace"],
      addedAt: "Yesterday",
      upvotes: 512,
      url: "https://notion.so",
      trending: false
    },
    {
      id: 5,
      name: "Claude 3.5 Sonnet",
      description: "Anthropic's fastest and most intelligent model for coding and reasoning.",
      category: "Agents",
      tags: ["LLM", "Coding", "Reasoning"],
      addedAt: "3 days ago",
      upvotes: 1056,
      url: "https://anthropic.com",
      trending: true
    }
  ]

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-blue-500" />
            AI Tools Radar
          </h1>
          <p className="text-muted-foreground mt-2">Discover and track the latest AI tools and agents.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline">Submit Tool</Button>
          <Button>Subscribe</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Discover</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tools..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium mb-2">Categories</h3>
                {categories.map(category => (
                  <Button key={category} variant="ghost" className="w-full justify-start text-sm h-8">
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-none">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Trending Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tools.filter(t => t.trending).slice(0, 3).map((tool, i) => (
                  <li key={tool.id} className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground">{i + 1}</span>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-medium truncate">{tool.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{tool.category}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="newest" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="newest">Newest</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
              </TabsList>
              <div className="text-sm text-muted-foreground">
                Showing {filteredTools.length} tools
              </div>
            </div>

            <TabsContent value="newest" className="space-y-4 mt-0">
              {filteredTools.map(tool => (
                <Card key={tool.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          {tool.name}
                          {tool.trending && <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">Trending</Badge>}
                        </CardTitle>
                        <CardDescription className="mt-1 text-base">{tool.description}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="hidden sm:flex" asChild>
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          Visit <ExternalLink className="ml-2 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{tool.category}</Badge>
                      {tool.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between items-center border-t mt-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {tool.addedAt}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                        <ThumbsUp className="h-4 w-4" />
                        {tool.upvotes}
                      </Button>
                      <Button variant="default" size="sm" className="sm:hidden" asChild>
                         <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
              {filteredTools.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No tools found matching "{searchQuery}"
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="popular">
               <div className="text-center py-12 text-muted-foreground">
                  Popular sorting coming soon...
                </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
