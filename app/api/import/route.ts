import { NextRequest, NextResponse } from 'next/server';

// 模拟数据库
const diaries: any[] = [];

interface ImportItem {
  title?: string;
  content: string;
  date?: string;
  tags?: string[];
  mood?: string;
  [key: string]: any;
}

// 解析 Markdown 文件
function parseMarkdown(content: string): ImportItem[] {
  const items: ImportItem[] = [];
  const lines = content.split('\n');
  let currentItem: ImportItem | null = null;
  let contentLines: string[] = [];
  
  for (const line of lines) {
    // 检测 Front Matter
    if (line.startsWith('---') && !currentItem) {
      continue;
    }
    
    // 检测标题
    if (line.startsWith('# ')) {
      if (currentItem && contentLines.length > 0) {
        currentItem.content = contentLines.join('\n').trim();
        items.push(currentItem);
      }
      currentItem = { title: line.substring(2).trim(), content: '' };
      contentLines = [];
    }
    // 检测日期
    else if (line.match(/^\d{4}-\d{2}-\d{2}/) && currentItem) {
      currentItem.date = line.trim();
    }
    // 检测标签
    else if (line.startsWith('tags:') || line.startsWith('Tags:')) {
      if (currentItem) {
        const tagsStr = line.replace(/tags:\s*/i, '');
        currentItem.tags = tagsStr.split(',').map((t: string) => t.trim());
      }
    }
    // 收集内容
    else if (currentItem) {
      contentLines.push(line);
    }
  }
  
  // 添加最后一个项目
  if (currentItem && contentLines.length > 0) {
    currentItem.content = contentLines.join('\n').trim();
    items.push(currentItem);
  }
  
  return items;
}

// 解析 JSON 文件
function parseJSON(content: string): ImportItem[] {
  try {
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [data];
  } catch {
    return [];
  }
}

// 解析纯文本
function parsePlainText(content: string): ImportItem[] {
  const items: ImportItem[] = [];
  const sections = content.split(/===\s*(\d{4}-\d{2}-\d{2})\s*===/);
  
  for (let i = 1; i < sections.length; i += 2) {
    const date = sections[i];
    const text = sections[i + 1]?.trim();
    if (date && text) {
      items.push({
        date,
        content: text,
        title: `${date} 日记`
      });
    }
  }
  
  return items;
}

// POST - 导入日记
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, content, items } = body as { type: string; content?: string; items?: ImportItem[] };
    
    let parsedItems: ImportItem[] = [];
    
    // 根据类型解析
    if (items && Array.isArray(items)) {
      parsedItems = items;
    } else if (content) {
      switch (type) {
        case 'markdown':
        case 'md':
          parsedItems = parseMarkdown(content);
          break;
        case 'json':
          parsedItems = parseJSON(content);
          break;
        case 'text':
        case 'plain':
          parsedItems = parsePlainText(content);
          break;
        case 'dayone':
          // Day One 格式也是 JSON
          const dayOneData = parseJSON(content);
          parsedItems = dayOneData.map((item: any) => ({
            title: item.text?.substring(0, 50) || '无标题',
            content: item.text || '',
            date: item.creationDate || item.date,
            tags: item.tags || [],
            mood: item.mood,
            location: item.location
          }));
          break;
        case 'notion':
          // Notion 格式解析
          const notionData = parseJSON(content);
          parsedItems = notionData.map((item: any) => ({
            title: item.Name || item.title || '无标题',
            content: item.Content || item.content || '',
            date: item.Date || item.date || item.Created,
            tags: item.Tags || item.tags || []
          }));
          break;
        default:
          parsedItems = parseJSON(content);
      }
    }
    
    if (parsedItems.length === 0) {
      return NextResponse.json(
        { success: false, error: '无法解析导入内容' },
        { status: 400 }
      );
    }
    
    // 创建日记记录
    const importedDiaries = parsedItems.map((item, index) => {
      const diary = {
        id: `import-${Date.now()}-${index}`,
        title: item.title || `日记 ${index + 1}`,
        content: item.content || '',
        date: item.date || new Date().toISOString().split('T')[0],
        tags: item.tags || [],
        mood: item.mood || 'normal',
        isImported: true,
        importedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      return diary;
    });
    
    // 添加到数据库
    diaries.push(...importedDiaries);
    
    return NextResponse.json({
      success: true,
      imported: importedDiaries.length,
      diaries: importedDiaries,
      message: `成功导入 ${importedDiaries.length} 篇日记`
    });
    
  } catch {
    return NextResponse.json(
      { success: false, error: '导入失败' },
      { status: 500 }
    );
  }
}

// GET - 获取导入历史
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  
  const importHistory = [
    {
      id: 'import-1',
      type: 'markdown',
      count: 15,
      importedAt: '2024-03-10T14:30:00Z',
      status: 'completed'
    },
    {
      id: 'import-2',
      type: 'json',
      count: 30,
      importedAt: '2024-03-08T09:15:00Z',
      status: 'completed'
    },
    {
      id: 'import-3',
      type: 'dayone',
      count: 45,
      importedAt: '2024-03-05T18:00:00Z',
      status: 'completed'
    }
  ];
  
  return NextResponse.json({
    success: true,
    history: importHistory.slice(0, limit),
    total: importHistory.length
  });
}

// DELETE - 清除导入历史
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const importId = searchParams.get('id');
  
  // 在实际应用中，这里会删除对应的导入记录
  
  return NextResponse.json({
    success: true,
    message: importId ? `已删除导入记录 ${importId}` : '已清除所有导入历史'
  });
}