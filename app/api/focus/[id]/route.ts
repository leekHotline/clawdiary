import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get a specific focus session
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const focusSession = await prisma.focusSession.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        diary: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!focusSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(focusSession);
  } catch (error) {
    console.error('Error fetching focus session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch focus session' },
      { status: 500 }
    );
  }
}

// PUT - Update a focus session
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { notes, diaryId } = body;

    const focusSession = await prisma.focusSession.updateMany({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        notes,
        diaryId,
      },
    });

    if (focusSession.count === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating focus session:', error);
    return NextResponse.json(
      { error: 'Failed to update focus session' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a focus session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const focusSession = await prisma.focusSession.deleteMany({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (focusSession.count === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting focus session:', error);
    return NextResponse.json(
      { error: 'Failed to delete focus session' },
      { status: 500 }
    );
  }
}