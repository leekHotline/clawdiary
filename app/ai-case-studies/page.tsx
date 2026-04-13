import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ArrowRight, BookOpen, Briefcase, GraduationCap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI 案例库 | ClawDiary',
  description: '探索 AI 在生活、工作和学习中的真实应用案例',
};

const cases = [
  {
    id: '1',
    title: '利用 AI 自动化周报生成',
    description: '通过接入 GitHub 和日志系统，使用大模型自动生成排版精美的团队周报，每周节省 2 小时。',
    category: '工作效率',
    icon: Briefcase,
    tags: ['自动化', '大模型', '效率'],
    readTime: '5 min',
  },
  {
    id: '2',
    title: '构建个人知识库问答助手',
    description: '将个人笔记导入向量数据库，结合 LLM 构建专属的第二大脑，随时解答历史疑问。',
    category: '学习成长',
    icon: GraduationCap,
    tags: ['RAG', '知识管理', '笔记'],
    readTime: '8 min',
  },
  {
    id: '3',
    title: 'AI 辅助小说大纲创作',
    description: '运用提示词工程，让 AI 根据核心设定发散生成多条故事线，提供灵感参考。',
    category: '创意写作',
    icon: BookOpen,
    tags: ['写作', '提示词', '灵感'],
    readTime: '6 min',
  },
];

export default function AICaseStudiesPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Lightbulb className="h-8 w-8 text-yellow-500" />
            AI 案例库
          </h1>
          <p className="text-muted-foreground">
            探索 AI 技术在真实场景中的应用，启发你的下一个自动化灵感。
          </p>
        </div>
        <Button>分享我的案例</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((study) => (
          <Card key={study.id} className="hover:shadow-md transition-shadow flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-primary/10 rounded-md text-primary">
                  <study.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">{study.category}</span>
              </div>
              <CardTitle className="text-xl line-clamp-2">{study.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <CardDescription className="text-sm text-foreground/80 mb-4 flex-1">
                {study.description}
              </CardDescription>
              <div className="flex flex-wrap gap-2 mb-4">
                {study.tags.map(tag => (
                  <Badge variant="outline" key={tag} className="text-xs font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t mt-auto">
                <span className="text-xs text-muted-foreground">{study.readTime} 阅读</span>
                <Button variant="ghost" size="sm" className="gap-1 group">
                  阅读全文 <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}