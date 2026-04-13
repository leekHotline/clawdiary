"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, RefreshCw, Zap, Clock, TrendingUp } from "lucide-react"

export default function AINewsPage() {
  const [loading, setLoading] = useState(false)
  const [news, setNews] = useState([
    {
      id: 1,
      title: "Anthropic Releases Claude 3.5 Sonnet",
      source: "Anthropic",
      category: "Model Release",
      time: "2 hours ago",
      url: "#",
      impact: "High"
    },
    {
      id: 2,
      title: "OpenAI Announces New Voice Capabilities for ChatGPT",
      source: "OpenAI Blog",
      category: "Feature",
      time: "5 hours ago",
      url: "#",
      impact: "High"
    },
    {
      id: 3,
      title: "Google DeepMind's New AlphaFold 3 Predicts All Life's Molecules",
      source: "Google",
      category: "Research",
      time: "12 hours ago",
      url: "#",
      impact: "Critical"
    },
    {
      id: 4,
      title: "Meta Open Sources Llama 3 400B Model Weights",
      source: "Meta AI",
      category: "Open Source",
      time: "1 day ago",
      url: "#",
      impact: "High"
    },
    {
      id: 5,
      title: "Cursor IDE Adds Multi-File Editing Features",
      source: "Cursor",
      category: "Tooling",
      time: "1 day ago",
      url: "#",
      impact: "Medium"
    }
  ])

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="container max-w-5xl py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="w-8 h-8 text-yellow-500" />
            AI Daily Pulse
          </h1>
          <p className="text-muted-foreground mt-2">
            The most important AI news, models, and tools from the last 24 hours.
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={loading} variant="outline" className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Top Stories
            </h2>
            <div className="flex gap-2">
              <Badge variant="secondary" className="cursor-pointer">All</Badge>
              <Badge variant="outline" className="cursor-pointer">Models</Badge>
              <Badge variant="outline" className="cursor-pointer">Tools</Badge>
            </div>
          </div>

          <div className="space-y-4">
            {news.map((item) => (
              <Card key={item.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium text-primary">{item.source}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        <a href={item.url} className="flex items-center gap-2">
                          {item.title}
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </h3>
                    </div>
                    <Badge className={getImpactColor(item.impact)} variant="outline">
                      {item.impact}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Trending Models</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Claude 3.5 Sonnet', 'GPT-4o', 'Llama 3 400B', 'Gemini 1.5 Pro'].map((model, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{model}</span>
                  <TrendingUp className="w-3 h-3 text-green-500" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Hot Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Cursor', 'V0', 'Perplexity', 'Midjourney v6'].map((tool, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{tool}</span>
                  <TrendingUp className="w-3 h-3 text-green-500" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
