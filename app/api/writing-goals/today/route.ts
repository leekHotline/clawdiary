import { NextRequest, NextResponse } from 'next/server';
import { getDiaries } from '@/lib/diaries';

interface DailyGoal {
  id: string;
  type: 'words' | 'time' | 'diaries';
  target: number;
  current: number;
  unit: string;
  icon: string;
  color: string;
}

export async function GET(request: NextRequest) {
  try {
    const diaries = await getDiaries();
    
    // Get today's diaries
    const today = new Date().toISOString().split('T')[0];
    const todayDiaries = diaries.filter((d: { date?: string; createdAt?: string }) => {
      const dateStr = (d.date || d.createdAt)?.split('T')[0];
      return dateStr === today;
    });
    
    // Calculate today's stats
    const todayWords = todayDiaries.reduce((sum: number, d: { wordCount?: number; content?: string }) => 
      sum + (d.wordCount || d.content?.length || 0), 0);
    
    // Default goals
    const goals: DailyGoal[] = [
      { 
        id: 'words', 
        type: 'words', 
        target: 500, 
        current: todayWords, 
        unit: '字', 
        icon: '✍️', 
        color: 'purple' 
      },
      { 
        id: 'time', 
        type: 'time', 
        target: 30, 
        current: Math.round(todayWords / 20), // Estimate ~20 words per minute
        unit: '分钟', 
        icon: '⏱️', 
        color: 'blue' 
      },
      { 
        id: 'diaries', 
        type: 'diaries', 
        target: 1, 
        current: todayDiaries.length, 
        unit: '篇', 
        icon: '📝', 
        color: 'green' 
      },
    ];
    
    // Calculate weekly progress
    const weeklyProgress = [];
    const todayDate = new Date();
    const startOfWeek = new Date(todayDate);
    startOfWeek.setDate(todayDate.getDate() - todayDate.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(startOfWeek);
      checkDate.setDate(startOfWeek.getDate() + i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const dayDiaries = diaries.filter((d: { date?: string; createdAt?: string }) => {
        const dDate = (d.date || d.createdAt)?.split('T')[0];
        return dDate === dateStr;
      });
      
      const dayWords = dayDiaries.reduce((sum: number, d: { wordCount?: number; content?: string }) => 
        sum + (d.wordCount || d.content?.length || 0), 0);
      
      // Calculate completion percentage (based on words goal)
      const percentage = Math.min((dayWords / 500) * 100, 100);
      
      weeklyProgress.push({
        date: dateStr,
        completed: dayWords >= 500,
        percentage: percentage > 0 ? percentage : undefined,
      });
    }
    
    return NextResponse.json({
      goals,
      weeklyProgress,
      todayStats: {
        words: todayWords,
        diaries: todayDiaries.length,
        time: Math.round(todayWords / 20),
      }
    });
  } catch (_error) {
    console.error('Error fetching daily goals:', _error);
    return NextResponse.json({
      goals: [
        { id: 'words', type: 'words', target: 500, current: 0, unit: '字', icon: '✍️', color: 'purple' },
        { id: 'time', type: 'time', target: 30, current: 0, unit: '分钟', icon: '⏱️', color: 'blue' },
        { id: 'diaries', type: 'diaries', target: 1, current: 0, unit: '篇', icon: '📝', color: 'green' },
      ],
      weeklyProgress: Array(7).fill({ completed: false }),
      todayStats: { words: 0, diaries: 0, time: 0 }
    });
  }
}