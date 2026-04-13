"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, ThumbsUp, MessageSquare, Clock } from 'lucide-react';

export default function AIFeatureTracker() {
  const [features, setFeatures] = useState([
    { id: 1, title: 'AI 自动生成视频摘要', source: 'ProductHunt', votes: 128, status: 'planning', time: '2小时前', tags: ['Video', 'AI'] },
    { id: 2, title: '智能体协作调试面板', source: 'GitHub', votes: 89, status: 'considering', time: '5小时前', tags: ['Agent', 'DevTools'] },
    { id: 3, title: '语音情感分析日记', source: 'Twitter', votes: 256, status: 'doing', time: '1天前', tags: ['Voice', 'Emotion'] },
    { id: 4, title: '上下文感知自动补全改进', source: 'Cursor', votes: 412, status: 'done', time: '2天前', tags: ['Code', 'DX'] }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'considering': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'doing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'done': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning': return '计划中';
      case 'considering': return '评估中';
      case 'doing': return '开发中';
      case 'done': return '已完成';
      default: return status;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">AI 趋势需求追踪</h1>
          <p className="text-muted-foreground">从各大平台收集最新 AI 产品趋势，转化为 ClawDiary 功能</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none">
            <Search className="mr-2 h-4 w-4" />
            去调研
          </Button>
          <Button className="flex-1 md:flex-none">
            <PlusCircle className="mr-2 h-4 w-4" />
            新建需求
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {['GitHub Trending', 'ProductHunt', 'Twitter/X', '竞品分析'].map((source) => (
          <Card key={source} className="bg-slate-50 border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">{source}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">点击查看最新趋势</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4 mt-12">需求池</h2>
      <div className="grid gap-4">
        {features.map(feature => (
          <Card key={feature.id} className="overflow-hidden hover:border-primary/50 transition-colors">
            <div className="flex flex-col sm:flex-row">
              <div className="p-4 sm:p-6 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={getStatusColor(feature.status)}>
                    {getStatusText(feature.status)}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {feature.time}
                  </span>
                  <span className="text-xs font-medium text-slate-500 ml-auto">
                    来源: {feature.source}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <div className="flex gap-2 mt-3">
                  {feature.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 p-4 sm:p-6 flex flex-row sm:flex-col items-center justify-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-100 min-w-[120px]">
                <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2 w-full">
                  <ThumbsUp className="h-5 w-5 text-slate-400" />
                  <span className="text-sm font-medium">{feature.votes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2 w-full text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">讨论</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
