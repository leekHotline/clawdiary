import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, TrendingUp, Sparkles, Zap, Star } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI 工具雷达 | ClawDiary',
  description: '发现最新、最热的 AI 工具和产品，提升效率',
};

const tools = [
  {
    id: '1',
    name: 'Cursor',
    description: 'The AI Code Editor',
    category: '开发工具',
    tags: ['Code', 'IDE', 'Copilot'],
    url: 'https://cursor.sh',
    icon: Sparkles,
    trending: true,
    likes: 1250,
  },
  {
    id: '2',
    name: 'Midjourney v6',
    description: 'Next generation AI image creation',
    category: '设计工具',
    tags: ['Image', 'Design', 'Generative'],
    url: 'https://midjourney.com',
    icon: Star,
    trending: true,
    likes: 3420,
  },
  {
    id: '3',
    name: 'Perplexity AI',
    description: 'AI powered search engine',
    category: '搜索调研',
    tags: ['Search', 'Research', 'LLM'],
    url: 'https://perplexity.ai',
    icon: Zap,
    trending: false,
    likes: 890,
  },
  {
    id: '4',
    name: 'Notion AI',
    description: 'Write better, think bigger',
    category: '生产力',
    tags: ['Writing', 'Workspace', 'Note'],
    url: 'https://notion.so/product/ai',
    icon: TrendingUp,
    trending: false,
    likes: 2100,
  }
];

export default function AIToolsRadarPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Zap className="h-8 w-8 text-amber-500" />
            AI 工具雷达
          </h1>
          <p className="text-muted-foreground">
            发现最新、最热的 AI 工具和产品，探索效率进化的可能边界。
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">提交新工具</Button>
          <Button>订阅周报</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Card key={tool.id} className="hover:shadow-md transition-shadow relative overflow-hidden group">
            {tool.trending && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 font-medium rounded-bl-lg">
                Trending
              </div>
            )}
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <tool.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{tool.name}</CardTitle>
                    <CardDescription className="mt-1">{tool.category}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 mb-4 line-clamp-2">
                {tool.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {tool.tags.map(tag => (
                  <Badge variant="secondary" key={tag} className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-yellow-500" />
                  <span>{tool.likes} 人推荐</span>
                </div>
                <Button variant="ghost" size="sm" asChild className="gap-1 group-hover:text-primary transition-colors">
                  <Link href={tool.url} target="_blank" rel="noopener noreferrer">
                    访问官网 <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
