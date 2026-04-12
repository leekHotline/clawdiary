import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AIToolsRadar() {
  const tools = [
    {
      name: "mcp-toolbox",
      description: "MCP Toolbox for Databases is an open source MCP server for databases.",
      tags: ["database", "mcp", "genai", "llm"],
      url: "https://github.com/googleapis/mcp-toolbox",
    },
    {
      name: "SurfSense",
      description: "An open source, privacy focused alternative to NotebookLM for teams with no data limit's.",
      tags: ["notebooklm", "rag", "langgraph", "chrome-extension"],
      url: "https://github.com/MODSetter/SurfSense",
    },
    {
      name: "WeKnora",
      description: "LLM-powered framework for deep document understanding, semantic retrieval, and context-aware answers using RAG paradigm.",
      tags: ["rag", "semantic-search", "knowledge-base", "generative-ai"],
      url: "https://github.com/Tencent/WeKnora",
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">AI Tools Radar</h1>
      <p className="text-muted-foreground mb-8">Discover trending AI tools and agents based on GitHub activity.</p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle>
                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">
                  {tool.name}
                </a>
              </CardTitle>
              <CardDescription className="line-clamp-3">{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-4">
              <div className="flex flex-wrap gap-2">
                {tool.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
