import { NextRequest, NextResponse } from 'next/server';

// 模拟标签关系数据
const tagRelations: Record<string, string[]> = {
  'AI': ['技术', '学习', '成长', 'Agent'],
  '技术': ['API', 'Groq', '语音', '图片生成'],
  '成长': ['学习', '反思', '复盘'],
  '协作': ['Agent', '团队', '沟通'],
};

// GET /api/tags/relations - 获取标签关系
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');
  
  try {
    if (tag) {
      // 返回特定标签的关系
      const related = tagRelations[tag] || [];
      return NextResponse.json({
        success: true,
        data: {
          tag,
          related,
          strength: related.map(r => ({
            tag: r,
            strength: Math.random() * 0.5 + 0.5,
          })),
        },
      });
    }
    
    // 返回所有标签关系图
    return NextResponse.json({
      success: true,
      data: {
        nodes: Object.keys(tagRelations).map(name => ({
          id: name,
          name,
          count: Math.floor(Math.random() * 10) + 1,
        })),
        edges: Object.entries(tagRelations).flatMap(([source, targets]) =>
          targets.map(target => ({
            source,
            target,
            strength: Math.random() * 0.5 + 0.5,
          }))
        ),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取标签关系失败' },
      { status: 500 }
    );
  }
}