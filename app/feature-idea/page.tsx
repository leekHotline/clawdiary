import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function FeatureIdea() {
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">💡 产品灵感板</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>提交新想法</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Textarea placeholder="描述你的产品功能想法..." className="min-h-[100px]" />
            <Button>提交想法</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">最新灵感</h2>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">AI 每日简报插件</h3>
                <p className="text-sm text-gray-500 mt-1">
                  自动将当天的日记、任务、心情总结成一份语音简报，支持在通勤时收听。
                </p>
              </div>
              <Button variant="outline" size="sm">👍 12</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">情绪趋势分析图表</h3>
                <p className="text-sm text-gray-500 mt-1">
                  在每周报告中增加情绪变化曲线，结合 AI 分析本周的心理波动原因。
                </p>
              </div>
              <Button variant="outline" size="sm">👍 8</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
