import { NextResponse } from 'next/server';
import { getTemplateById } from '@/lib/templates';

// GET /api/templates/[id] - 获取单个模板详情
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const template = getTemplateById(id);

    if (!template) {
      return NextResponse.json(
        { success: false, error: '模板不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { success: false, error: '获取模板失败' },
      { status: 500 }
    );
  }
}