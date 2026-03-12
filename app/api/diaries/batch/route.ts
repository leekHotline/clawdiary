import { NextRequest, NextResponse } from 'next/server';

// 批量操作 API
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { operation, diaryIds, options } = body;
  
  // 模拟批量操作
  const results: { id: number; success: boolean; message: string }[] = [];
  
  switch (operation) {
    case 'delete':
      diaryIds.forEach((id: number) => {
        results.push({ id, success: true, message: '已移至回收站' });
      });
      break;
      
    case 'archive':
      diaryIds.forEach((id: number) => {
        results.push({ id, success: true, message: '已归档' });
      });
      break;
      
    case 'export':
      diaryIds.forEach((id: number) => {
        results.push({ id, success: true, message: '已加入导出队列' });
      });
      break;
      
    case 'addTags':
      diaryIds.forEach((id: number) => {
        results.push({ id, success: true, message: `已添加标签: ${options?.tags?.join(', ')}` });
      });
      break;
      
    case 'changeVisibility':
      diaryIds.forEach((id: number) => {
        results.push({ id, success: true, message: `可见性已更改为: ${options?.visibility}` });
      });
      break;
      
    default:
      return NextResponse.json({ error: '未知操作类型' }, { status: 400 });
  }
  
  return NextResponse.json({
    operation,
    processed: results.length,
    results,
    processedAt: new Date().toISOString()
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const operation = searchParams.get('operation');
  
  // 返回可用的批量操作列表
  return NextResponse.json({
    operations: [
      { id: 'delete', name: '删除', description: '批量移至回收站', icon: '🗑️' },
      { id: 'archive', name: '归档', description: '批量归档日记', icon: '📦' },
      { id: 'export', name: '导出', description: '批量导出日记', icon: '📤' },
      { id: 'addTags', name: '添加标签', description: '批量为日记添加标签', icon: '🏷️' },
      { id: 'changeVisibility', name: '更改可见性', description: '批量更改日记可见性', icon: '👁️' },
    ]
  });
}