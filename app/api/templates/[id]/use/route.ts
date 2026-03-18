import { NextResponse } from 'next/server';
import { 
  getTemplateById, 
  generateDraftFromTemplate,
  recordTemplateUsage 
} from '@/lib/templates';

// POST /api/templates/[id]/use - 使用模板创建日记
export async function POST(
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

    // 解析请求体
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || 'anonymous';

    // 生成草稿
    const draft = generateDraftFromTemplate(template);

    // 记录使用历史（这里生成临时日记ID）
    const tempDiaryId = `draft-${Date.now()}`;
    recordTemplateUsage(id, userId, tempDiaryId);

    return NextResponse.json({
      success: true,
      data: {
        template: {
          id: template.id,
          name: template.name,
          category: template.category
        },
        draft
      },
      message: `已使用模板「${template.name}」创建草稿`
    });
  } catch {
    return NextResponse.json(
      { success: false, error: '使用模板失败' },
      { status: 500 }
    );
  }
}