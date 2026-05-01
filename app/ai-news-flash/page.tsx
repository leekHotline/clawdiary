"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockNews = [
  { id: 1, title: "GPT-4.5 Announced", category: "Release", upvotes: 120 },
  { id: 2, title: "New Agent Framework by Meta", category: "Framework", upvotes: 85 },
  { id: 3, title: "Cursor Update: Multi-file Editing", category: "Tooling", upvotes: 205 },
];

export default function AINewsFlash() {
  const [news, setNews] = useState(mockNews);

  const handleUpvote = (id: number) => {
    setNews(news.map(n => n.id === id ? { ...n, upvotes: n.upvotes + 1 } : n));
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">AI News Flash</h1>
      <p className="text-muted-foreground mb-8">Latest trends and updates in the AI world, ranked by community.</p>
      
      <div className="grid gap-4">
        {news.sort((a, b) => b.upvotes - a.upvotes).map(item => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                {item.title}
              </CardTitle>
              <Badge variant="secondary">{item.category}</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleUpvote(item.id)}>
                  👍 Upvote ({item.upvotes})
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
