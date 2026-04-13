import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function AiFeatureTrackerPage() {
  const features = [
    {
      id: 1,
      title: 'Context-Aware AI Assistant',
      description: 'An AI assistant that understands your current workspace and provides relevant suggestions and context.',
      tags: ['AI Assistant', 'Context', 'Productivity'],
      votes: 1245,
      status: 'In Progress',
    },
    {
      id: 2,
      title: 'Semantic Code Search',
      description: 'Search through your codebase using natural language instead of just keywords.',
      tags: ['Search', 'Code', 'Semantic'],
      votes: 982,
      status: 'Planned',
    },
    {
      id: 3,
      title: 'Automated PR Reviews',
      description: 'Get AI-generated code reviews for your pull requests with suggestions for improvements.',
      tags: ['Code Review', 'Automation', 'GitHub'],
      votes: 856,
      status: 'Released',
    },
    {
      id: 4,
      title: 'Intelligent Test Generation',
      description: 'Automatically generate unit and integration tests based on your code and specifications.',
      tags: ['Testing', 'Automation', 'Quality'],
      votes: 734,
      status: 'Planned',
    },
    {
      id: 5,
      title: 'Real-time Pair Programming',
      description: 'Collaborate with an AI agent in real-time, like having a knowledgeable pair programmer.',
      tags: ['Pair Programming', 'Collaboration', 'Agent'],
      votes: 621,
      status: 'In Progress',
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4 md:px-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Feature Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Discover, vote, and track the latest AI features requested by the community.
          </p>
        </div>
        <Button>Suggest Feature</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,345</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Voters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.2k</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <Users className="h-3 w-3 mr-1 text-green-500" />
              +5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Features Released</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <Star className="h-3 w-3 mr-1 text-yellow-500" />
              This quarter
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Trending Features</h2>
        {features.map((feature) => (
          <Card key={feature.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg min-w-[80px]">
                  <Button variant="ghost" size="icon" className="h-8 w-8 mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevron-up"
                    >
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                  </Button>
                  <span className="font-bold">{feature.votes}</span>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <Badge variant={
                      feature.status === 'Released' ? 'default' : 
                      feature.status === 'In Progress' ? 'secondary' : 'outline'
                    }>
                      {feature.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <div className="flex gap-2 flex-wrap pt-2">
                    {feature.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="hidden md:block">
                  <Button variant="outline" size="sm" className="gap-2">
                    Details <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}