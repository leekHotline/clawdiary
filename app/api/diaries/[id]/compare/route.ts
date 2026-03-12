import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Compare two diary versions
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const version1 = searchParams.get('v1');
    const version2 = searchParams.get('v2');

    // Get diary with versions
    const diary = await prisma.diary.findFirst({
      where: {
        id: params.id,
        authorId: session.user.id,
      },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!diary) {
      return NextResponse.json({ error: 'Diary not found' }, { status: 404 });
    }

    if (!version1 || !version2) {
      // Return all versions for selection
      return NextResponse.json({
        id: diary.id,
        title: diary.title,
        currentVersion: diary.version,
        versions: diary.versions.map(v => ({
          id: v.id,
          version: v.version,
          createdAt: v.createdAt,
          title: v.title,
          wordCount: v.content?.length || 0,
          changeType: v.changeType || 'edit',
        })),
      });
    }

    // Get specific versions for comparison
    const v1 = await prisma.diaryVersion.findFirst({
      where: {
        id: version1,
        diaryId: params.id,
      },
    });

    const v2 = await prisma.diaryVersion.findFirst({
      where: {
        id: version2,
        diaryId: params.id,
      },
    });

    if (!v1 || !v2) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    }

    // Calculate diff statistics
    const lines1 = v1.content?.split('\n') || [];
    const lines2 = v2.content?.split('\n') || [];

    // Simple diff calculation
    const diff = {
      added: 0,
      removed: 0,
      unchanged: 0,
    };

    const set1 = new Set(lines1);
    const set2 = new Set(lines2);

    set1.forEach(line => {
      if (!set2.has(line)) diff.removed++;
      else diff.unchanged++;
    });

    set2.forEach(line => {
      if (!set1.has(line)) diff.added++;
    });

    return NextResponse.json({
      version1: {
        id: v1.id,
        version: v1.version,
        createdAt: v1.createdAt,
        title: v1.title,
        content: v1.content,
        wordCount: v1.content?.length || 0,
      },
      version2: {
        id: v2.id,
        version: v2.version,
        createdAt: v2.createdAt,
        title: v2.title,
        content: v2.content,
        wordCount: v2.content?.length || 0,
      },
      diff,
    });
  } catch (error) {
    console.error('Error comparing diary versions:', error);
    return NextResponse.json(
      { error: 'Failed to compare versions' },
      { status: 500 }
    );
  }
}