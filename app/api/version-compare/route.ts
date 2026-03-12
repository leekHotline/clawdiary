import { NextRequest, NextResponse } from 'next/server';
import { diaries } from '@/data/diaries';

// 简单的文本差异计算
function calculateDiff(text1: string, text2: string) {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const changes: any[] = [];
  
  const maxLen = Math.max(lines1.length, lines2.length);
  let added = 0;
  let removed = 0;
  let modified = 0;
  
  for (let i = 0; i < maxLen; i++) {
    const line1 = lines1[i];
    const line2 = lines2[i];
    
    if (line1 === undefined) {
      added++;
      changes.push({
        type: 'add',
        line: i + 1,
        newContent: line2
      });
    } else if (line2 === undefined) {
      removed++;
      changes.push({
        type: 'remove',
        line: i + 1,
        oldContent: line1
      });
    } else if (line1 !== line2) {
      modified++;
      changes.push({
        type: 'modify',
        line: i + 1,
        oldContent: line1,
        newContent: line2
      });
    }
  }
  
  return { changes, added, removed, modified };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const diaryId = searchParams.get('diaryId');
    const version1 = searchParams.get('version1');
    const version2 = searchParams.get('version2');
    
    if (!diaryId || !version1 || !version2) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }
    
    const diary = diaries.find(d => d.id === parseInt(diaryId));
    if (!diary) {
      return NextResponse.json(
        { error: '日记不存在' },
        { status: 404 }
      );
    }
    
    // 模拟版本数据（实际项目中应从版本历史表获取）
    const content = diary.content || '';
    
    // 创建模拟版本（实际应该从数据库获取）
    const v1 = {
      version: parseInt(version1),
      content: content,
      createdAt: diary.createdAt
    };
    
    const v2 = {
      version: parseInt(version2),
      content: content, // 实际应该是不同版本的内容
      createdAt: diary.updatedAt || diary.createdAt
    };
    
    const { changes, added, removed, modified } = calculateDiff(v1.content, v2.content);
    
    const totalLines = Math.max(
      v1.content.split('\n').length,
      v2.content.split('\n').length
    );
    const changePercent = totalLines > 0 
      ? Math.round(((added + removed + modified) / totalLines) * 100) 
      : 0;
    
    return NextResponse.json({
      version1: v1,
      version2: v2,
      changes,
      stats: {
        added,
        removed,
        modified,
        totalLines,
        changePercent
      }
    });
  } catch (error) {
    console.error('Version compare error:', error);
    return NextResponse.json(
      { error: '对比失败' },
      { status: 500 }
    );
  }
}