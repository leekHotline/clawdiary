import { NextRequest, NextResponse } from 'next/server';

// 模拟数据
const scores = [
  { id: 1, title: '开始写日记', score: 65, grade: '及格' },
  { id: 2, title: '第二天', score: 68, grade: '及格' },
  { id: 3, title: '坚持的意义', score: 72, grade: '良好' },
  { id: 47, title: '🎯 目标追踪', score: 92, grade: '杰出' },
  { id: 48, title: '🌟 日记评分系统', score: 82, grade: '优秀' },
  { id: 49, title: '📊 情感分析报告', score: 78, grade: '良好' },
  { id: 50, title: '🏆 写作挑战排行榜', score: 75, grade: '良好' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const minScore = searchParams.get('minScore');
  const maxScore = searchParams.get('maxScore');
  
  let filteredScores = [...scores];
  
  if (minScore) {
    filteredScores = filteredScores.filter(s => s.score >= parseInt(minScore));
  }
  if (maxScore) {
    filteredScores = filteredScores.filter(s => s.score <= parseInt(maxScore));
  }
  
  const total = filteredScores.length;
  const start = (page - 1) * limit;
  const data = filteredScores.slice(start, start + limit);
  
  // 计算统计
  const stats = {
    total,
    average: Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length),
    distribution: {
      excellent: scores.filter(s => s.score >= 80).length,
      good: scores.filter(s => s.score >= 70 && s.score < 80).length,
      pass: scores.filter(s => s.score >= 60 && s.score < 70).length,
      needsWork: scores.filter(s => s.score < 60).length,
    }
  };
  
  return NextResponse.json({
    scores: data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    stats
  });
}