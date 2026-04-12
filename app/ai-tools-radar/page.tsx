import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Star, TrendingUp } from "lucide-react"

export default function AIToolsRadar() {
  const tools = [
    {
      name: "Cursor",
      description: "The AI Code Editor",
      category: "Code",
      trend: "Hot",
      url: "https://cursor.com",
    },
    {
      name: "Midjourney v6",
      description: "High quality AI image generation",
      category: "Design",
      trend: "Stable",
      url: "https://midjourney.com",
    },
    {
      name: "Perplexity",
      description: "AI-powered search engine",
      category: "Search",
      trend: "Rising",
      url: "https://perplexity.ai",
    },
    {
      name: "Claude 3 Opus",
      description: "Anthropic's most capable model",
      category: "LLM",
      trend: "Hot",
      url: "https://anthropic.com",
    }
  ]

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">AI Tools Radar</h1>
          <p className="text-muted-foreground">Discover and track the latest AI tools and trends.</p>
        </div>
        <TrendingUp className="h-8 w-8 text-primary" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {tools.map((tool, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl flex items-center gap-2">
                  {tool.name}
                  {tool.trend === "Hot" && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                </CardTitle>
                <Badge variant={tool.trend === "Hot" ? "default" : "secondary"}>
                  {tool.trend}
                </Badge>
              </div>
              <CardDescription>{tool.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
              <a 
                href={tool.url} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                Visit Site <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
