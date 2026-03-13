import { NextRequest, NextResponse } from 'next/server';
import { diaries } from '@/data/diaries';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const format = searchParams.get('format') || 'markdown';
  const diaryId = searchParams.get('diaryId');
  const includeMetadata = searchParams.get('metadata') === 'true';

  try {
    // 获取要导出的日记
    let targetDiaries = diaries;
    if (diaryId) {
      const id = parseInt(diaryId);
      targetDiaries = diaries.filter(d => d.id === id);
      if (targetDiaries.length === 0) {
        return NextResponse.json({ error: '日记不存在' }, { status: 404 });
      }
    }

    // 按日期排序
    targetDiaries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let content = '';
    let filename = '';
    let mimeType = 'text/plain';

    switch (format) {
      case 'markdown':
      case 'md':
        content = exportMarkdown(targetDiaries, includeMetadata === false);
        filename = diaryId ? `diary-${diaryId}.md` : 'diaries-export.md';
        mimeType = 'text/markdown';
        break;

      case 'json':
        content = JSON.stringify(targetDiaries, null, 2);
        filename = diaryId ? `diary-${diaryId}.json` : 'diaries-export.json';
        mimeType = 'application/json';
        break;

      case 'txt':
        content = exportPlainText(targetDiaries, includeMetadata === false);
        filename = diaryId ? `diary-${diaryId}.txt` : 'diaries-export.txt';
        break;

      case 'html':
        content = exportHTML(targetDiaries, includeMetadata === false);
        filename = diaryId ? `diary-${diaryId}.html` : 'diaries-export.html';
        mimeType = 'text/html';
        break;

      case 'csv':
        content = exportCSV(targetDiaries);
        filename = diaryId ? `diary-${diaryId}.csv` : 'diaries-export.csv';
        mimeType = 'text/csv';
        break;

      default:
        return NextResponse.json({ error: '不支持的导出格式' }, { status: 400 });
    }

    return new NextResponse(content, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': Buffer.byteLength(content).toString(),
      },
    });
  } catch (_error) {
    console.error('Export error:', _error);
    return NextResponse.json({ error: '导出失败' }, { status: 500 });
  }
}

function exportMarkdown(diaries: any[], skipMetadata: boolean): string {
  let content = '# 日记导出\n\n';
  content += `> 导出时间: ${new Date().toLocaleString('zh-CN')}\n\n`;
  content += `> 共 ${diaries.length} 篇日记\n\n---\n\n`;

  for (const diary of diaries) {
    content += `## ${diary.title}\n\n`;
    
    if (!skipMetadata) {
      content += `**日期**: ${diary.date}\n`;
      content += `**心情**: ${diary.mood || '未记录'}\n`;
      content += `**天气**: ${diary.weather || '未记录'}\n`;
      content += `**地点**: ${diary.location || '未记录'}\n`;
      content += `**标签**: ${(diary.tags || []).join(', ') || '无'}\n`;
      content += `**字数**: ${diary.wordCount || 0}\n`;
      content += `**阅读时长**: ${diary.readingTime || 0} 分钟\n\n`;
    }

    content += `${diary.content}\n\n`;
    content += '---\n\n';
  }

  return content;
}

function exportPlainText(diaries: any[], skipMetadata: boolean): string {
  let content = '日记导出\n';
  content += `导出时间: ${new Date().toLocaleString('zh-CN')}\n`;
  content += `共 ${diaries.length} 篇日记\n\n`;
  content += '='.repeat(50) + '\n\n';

  for (const diary of diaries) {
    content += `${diary.title}\n`;
    
    if (!skipMetadata) {
      content += `-`.repeat(30) + '\n';
      content += `日期: ${diary.date}\n`;
      content += `心情: ${diary.mood || '未记录'}\n`;
      content += `天气: ${diary.weather || '未记录'}\n`;
      content += `地点: ${diary.location || '未记录'}\n`;
      content += `标签: ${(diary.tags || []).join(', ') || '无'}\n`;
      content += `字数: ${diary.wordCount || 0}\n`;
    }

    content += '-'.repeat(30) + '\n';
    content += `${diary.content}\n\n`;
    content += '='.repeat(50) + '\n\n';
  }

  return content;
}

function exportHTML(diaries: any[], skipMetadata: boolean): string {
  let content = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>日记导出</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .diary {
      background: white;
      padding: 24px;
      border-radius: 8px;
      margin-bottom: 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin-bottom: 16px;
    }
    .metadata {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
      color: #666;
      font-size: 14px;
    }
    .metadata span {
      background: #f0f0f0;
      padding: 4px 8px;
      border-radius: 4px;
    }
    .content {
      line-height: 1.8;
      white-space: pre-wrap;
    }
    .tags {
      margin-top: 16px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .tag {
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .header h1 {
      font-size: 32px;
      color: #333;
    }
    .header p {
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📔 日记导出</h1>
    <p>导出时间: ${new Date().toLocaleString('zh-CN')} · 共 ${diaries.length} 篇日记</p>
  </div>
`;

  for (const diary of diaries) {
    content += `
  <div class="diary">
    <div class="title">${diary.title}</div>
    ${!skipMetadata ? `
    <div class="metadata">
      <span>📅 ${diary.date}</span>
      <span>😊 ${diary.mood || '未记录'}</span>
      <span>🌤️ ${diary.weather || '未记录'}</span>
      <span>📍 ${diary.location || '未记录'}</span>
      <span>📝 ${diary.wordCount || 0} 字</span>
    </div>
    ` : ''}
    <div class="content">${diary.content.replace(/\n/g, '<br>')}</div>
    ${(diary.tags || []).length > 0 && !skipMetadata ? `
    <div class="tags">
      ${diary.tags.map((t: string) => `<span class="tag">#${t}</span>`).join('')}
    </div>
    ` : ''}
  </div>
`;
  }

  content += `
</body>
</html>
`;

  return content;
}

function exportCSV(diaries: any[]): string {
  let content = 'ID,标题,日期,心情,天气,地点,字数,阅读时长,标签,创建时间\n';

  for (const diary of diaries) {
    const tags = (diary.tags || []).join('; ');
    content += `${diary.id},"${diary.title}",${diary.date},${diary.mood || ''},${diary.weather || ''},"${diary.location || ''}",${diary.wordCount || 0},${diary.readingTime || 0},"${tags}",${diary.createdAt}\n`;
  }

  return content;
}