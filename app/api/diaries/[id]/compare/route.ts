import { NextRequest, NextResponse } from 'next/server';

// 模拟版本数据
const mockVersions: Record<string, any[]> = {
  '1': [
    {
      id: 'v5',
      number: 5,
      date: '2024-03-10T15:30:00Z',
      changes: '修复错别字，添加名言引用',
      author: 'Alex',
      content: {
        title: '第一天 - 新的开始',
        content: `今天是开始的第一天。

我决定开始写日记，记录每一天的生活。这是一个重要的决定。

这是一个新的开始，希望能够坚持下去。

今天天气很好，阳光明媚。心情也不错。

## 今日感悟

开始是成功的一半。只要坚持下去，一定会有收获。

> "千里之行，始于足下。"

这句话一直激励着我。`,
        tags: ['开始', '决心', '阳光', '心情', '感悟', '名言'],
        mood: 'happy'
      }
    },
    {
      id: 'v4',
      number: 4,
      date: '2024-03-10T12:00:00Z',
      changes: '添加感悟段落',
      author: 'Alex',
      content: {
        title: '第一天 - 新的开始',
        content: `今天是开始的第一天。

我决定开始写日记，记录每一天的生活。这是一个重要的决定。

这是一个新的开始，希望能够坚持下去。

今天天气很好，阳光明媚。心情也不错。

## 今日感悟

开始是成功的一半。只要坚持下去，一定会有收获。`,
        tags: ['开始', '决心', '阳光', '心情', '感悟'],
        mood: 'happy'
      }
    },
    {
      id: 'v3',
      number: 3,
      date: '2024-03-09T18:45:00Z',
      changes: '修改标题，新增内容',
      author: 'Alex',
      content: {
        title: '第一天 - 新的开始',
        content: `今天是开始的第一天。

我决定开始写日记，记录每一天的生活。

这是一个新的开始，希望能够坚持下去。

今天天气很好，阳光明媚。心情也不错。

新增了一段内容。`,
        tags: ['开始', '决心', '阳光', '心情'],
        mood: 'happy'
      }
    },
    {
      id: 'v2',
      number: 2,
      date: '2024-03-09T10:00:00Z',
      changes: '添加天气和心情描述',
      author: 'Alex',
      content: {
        title: '第一天',
        content: `今天是开始的第一天。

我决定开始写日记，记录每一天的生活。

这是一个新的开始，希望能够坚持下去。

今天天气很好，阳光明媚。`,
        tags: ['开始', '决心', '阳光'],
        mood: 'happy'
      }
    },
    {
      id: 'v1',
      number: 1,
      date: '2024-03-08T20:00:00Z',
      changes: '创建日记',
      author: 'Alex',
      content: {
        title: '第一天',
        content: `今天是开始的第一天。

我决定开始写日记，记录每一天的生活。

这是一个新的开始，希望能够坚持下去。`,
        tags: ['开始', '决心'],
        mood: 'normal'
      }
    }
  ]
};

// GET - 获取版本对比
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: diaryId } = await params;
  const { searchParams } = new URL(request.url);
  const versionA = searchParams.get('v1');
  const versionB = searchParams.get('v2');

  const versions = mockVersions[diaryId] || mockVersions['1'];

  // 如果没有指定版本，返回所有版本列表
  if (!versionA && !versionB) {
    return NextResponse.json({
      success: true,
      diaryId,
      versions: versions.map(v => ({
        id: v.id,
        number: v.number,
        date: v.date,
        changes: v.changes,
        author: v.author
      }))
    });
  }

  // 获取指定版本
  const vA = versions.find(v => v.id === versionA);
  const vB = versions.find(v => v.id === versionB);

  if (!vA || !vB) {
    return NextResponse.json(
      { success: false, error: '找不到指定的版本' },
      { status: 404 }
    );
  }

  // 生成差异
  const diff = generateDiff(vA.content, vB.content);

  return NextResponse.json({
    success: true,
    diaryId,
    comparison: {
      versionA: {
        id: vA.id,
        number: vA.number,
        date: vA.date,
        content: vA.content
      },
      versionB: {
        id: vB.id,
        number: vB.number,
        date: vB.date,
        content: vB.content
      },
      diff
    }
  });
}

// 生成差异对比
function generateDiff(contentA: any, contentB: any) {
  const diff: any = {
    title: {
      old: contentA.title,
      new: contentB.title,
      changed: contentA.title !== contentB.title
    },
    tags: {
      added: contentB.tags.filter((t: string) => !contentA.tags.includes(t)),
      removed: contentA.tags.filter((t: string) => !contentB.tags.includes(t)),
      unchanged: contentA.tags.filter((t: string) => contentB.tags.includes(t))
    },
    mood: {
      old: contentA.mood,
      new: contentB.mood,
      changed: contentA.mood !== contentB.mood
    },
    content: diffText(contentA.content, contentB.content)
  };

  return diff;
}

// 文本差异算法（简化版）
function diffText(oldText: string, newText: string) {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  
  const changes: any[] = [];
  const maxLen = Math.max(oldLines.length, newLines.length);
  
  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i] || '';
    const newLine = newLines[i] || '';
    
    if (oldLine === newLine) {
      changes.push({ type: 'unchanged', oldLine, newLine, lineNumber: i + 1 });
    } else if (!oldLine && newLine) {
      changes.push({ type: 'added', newLine, lineNumber: i + 1 });
    } else if (oldLine && !newLine) {
      changes.push({ type: 'removed', oldLine, lineNumber: i + 1 });
    } else {
      changes.push({ type: 'modified', oldLine, newLine, lineNumber: i + 1 });
    }
  }
  
  return {
    changes,
    summary: {
      added: changes.filter(c => c.type === 'added').length,
      removed: changes.filter(c => c.type === 'removed').length,
      modified: changes.filter(c => c.type === 'modified').length,
      unchanged: changes.filter(c => c.type === 'unchanged').length
    }
  };
}

// POST - 恢复到指定版本
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: diaryId } = await params;
  
  try {
    const body = await request.json();
    const { targetVersion, reason } = body;

    if (!targetVersion) {
      return NextResponse.json(
        { success: false, error: '请指定要恢复的版本' },
        { status: 400 }
      );
    }

    const versions = mockVersions[diaryId] || mockVersions['1'];
    const target = versions.find(v => v.id === targetVersion);

    if (!target) {
      return NextResponse.json(
        { success: false, error: '找不到指定的版本' },
        { status: 404 }
      );
    }

    // 模拟恢复操作
    return NextResponse.json({
      success: true,
      message: `已恢复到版本 V${target.number}`,
      diaryId,
      restoredVersion: {
        id: target.id,
        number: target.number,
        date: target.date,
        content: target.content
      },
      restoredAt: new Date().toISOString(),
      reason
    });

  } catch (error) {
    console.error('Version restore error:', error);
    return NextResponse.json(
      { success: false, error: '恢复版本失败' },
      { status: 500 }
    );
  }
}