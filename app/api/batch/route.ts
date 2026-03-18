import { NextRequest, NextResponse } from 'next/server';

// POST - 批量操作
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, diaryIds, options } = body as {
      operation: string;
      diaryIds: string[];
      options?: {
        tags?: string[];
        mood?: string;
        privacy?: 'public' | 'followers' | 'private';
        exportFormat?: string;
      };
    };

    if (!operation || !diaryIds || diaryIds.length === 0) {
      return NextResponse.json(
        { success: false, error: '缺少操作类型或日记ID' },
        { status: 400 }
      );
    }

    const result: Record<string, unknown> = {
      operation,
      affected: diaryIds.length,
      timestamp: new Date().toISOString()
    };

    switch (operation) {
      case 'add-tag':
        // 批量添加标签
        if (!options?.tags || options.tags.length === 0) {
          return NextResponse.json(
            { success: false, error: '请提供要添加的标签' },
            { status: 400 }
          );
        }
        result.message = `已为 ${diaryIds.length} 篇日记添加标签: ${options.tags.join(', ')}`;
        result.addedTags = options.tags;
        break;

      case 'remove-tag':
        // 批量移除标签
        if (!options?.tags || options.tags.length === 0) {
          return NextResponse.json(
            { success: false, error: '请提供要移除的标签' },
            { status: 400 }
          );
        }
        result.message = `已从 ${diaryIds.length} 篇日记移除标签: ${options.tags.join(', ')}`;
        result.removedTags = options.tags;
        break;

      case 'change-mood':
        // 批量修改心情
        if (!options?.mood) {
          return NextResponse.json(
            { success: false, error: '请提供心情值' },
            { status: 400 }
          );
        }
        result.message = `已将 ${diaryIds.length} 篇日记的心情修改为: ${options.mood}`;
        result.newMood = options.mood;
        break;

      case 'change-privacy':
        // 批量修改隐私设置
        if (!options?.privacy) {
          return NextResponse.json(
            { success: false, error: '请提供隐私设置' },
            { status: 400 }
          );
        }
        const privacyLabels = {
          public: '公开',
          followers: '仅关注者',
          private: '私密'
        };
        result.message = `已将 ${diaryIds.length} 篇日记设置为: ${privacyLabels[options.privacy]}`;
        result.newPrivacy = options.privacy;
        break;

      case 'export':
        // 批量导出
        if (!options?.exportFormat) {
          return NextResponse.json(
            { success: false, error: '请提供导出格式' },
            { status: 400 }
          );
        }
        result.message = `已导出 ${diaryIds.length} 篇日记 (${options.exportFormat})`;
        result.exportFormat = options.exportFormat;
        result.downloadUrl = `/api/export/batch?ids=${diaryIds.join(',')}&format=${options.exportFormat}`;
        break;

      case 'archive':
        // 批量归档
        result.message = `已归档 ${diaryIds.length} 篇日记`;
        break;

      case 'delete':
        // 批量删除（移到回收站）
        result.message = `已将 ${diaryIds.length} 篇日记移到回收站`;
        result.deletedCount = diaryIds.length;
        break;

      case 'restore':
        // 批量恢复
        result.message = `已恢复 ${diaryIds.length} 篇日记`;
        break;

      case 'pin':
        // 批量置顶
        result.message = `已置顶 ${diaryIds.length} 篇日记`;
        break;

      case 'unpin':
        // 取消置顶
        result.message = `已取消置顶 ${diaryIds.length} 篇日记`;
        break;

      default:
        return NextResponse.json(
          { success: false, error: `未知操作类型: ${operation}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch {
    return NextResponse.json(
      { success: false, error: '批量操作失败' },
      { status: 500 }
    );
  }
}

// GET - 获取批量操作预览
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids')?.split(',') || [];

  // 模拟获取日记预览
  const previews = ids.map((id, index) => ({
    id,
    title: `日记 ${index + 1}`,
    date: new Date().toISOString().split('T')[0],
    tags: ['标签'],
    mood: 'normal'
  }));

  return NextResponse.json({
    success: true,
    diaries: previews,
    count: previews.length
  });
}

// DELETE - 批量删除
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { diaryIds, permanent } = body as {
      diaryIds: string[];
      permanent?: boolean;
    };

    if (!diaryIds || diaryIds.length === 0) {
      return NextResponse.json(
        { success: false, error: '请提供要删除的日记ID' },
        { status: 400 }
      );
    }

    if (permanent) {
      // 永久删除
      return NextResponse.json({
        success: true,
        message: `已永久删除 ${diaryIds.length} 篇日记`,
        deletedCount: diaryIds.length,
        permanent: true
      });
    } else {
      // 移到回收站
      return NextResponse.json({
        success: true,
        message: `已将 ${diaryIds.length} 篇日记移到回收站`,
        deletedCount: diaryIds.length,
        permanent: false,
        recoverable: true
      });
    }

  } catch {
    return NextResponse.json(
      { success: false, error: '批量删除失败' },
      { status: 500 }
    );
  }
}