import { NextResponse } from 'next/server';
import { 
  getAllTemplates, 
  getPopularTemplates, 
  getTemplatesByCategory,
  searchTemplates,
  TemplateCategory 
} from '@/lib/templates';

// GET /api/templates - 获取模板列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as TemplateCategory | null;
  const query = searchParams.get('q');
  const popular = searchParams.get('popular');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    let templates;

    if (query) {
      // 搜索模板
      templates = searchTemplates(query);
    } else if (popular === 'true') {
      // 获取热门模板
      templates = getPopularTemplates(limit);
    } else if (category) {
      // 按分类获取
      templates = getTemplatesByCategory(category);
    } else {
      // 获取所有模板
      templates = getAllTemplates();
    }

    return NextResponse.json({
      success: true,
      data: templates,
      meta: {
        total: templates.length,
        category: category || null,
        query: query || null
      }
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { success: false, error: '获取模板失败' },
      { status: 500 }
    );
  }
}