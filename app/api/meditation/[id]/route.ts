import { NextRequest, NextResponse } from 'next/server';

// Shared meditations data (in production, use database)
declare global {
  var meditationsData: any[] | undefined;
}

// GET - Get single meditation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const meditations = globalThis.meditationsData || [];
  const meditation = meditations.find(m => m.id === params.id);

  if (!meditation) {
    return NextResponse.json(
      { error: 'Meditation not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ meditation });
}

// PUT - Update meditation
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    if (!globalThis.meditationsData) {
      globalThis.meditationsData = [];
    }
    
    const index = globalThis.meditationsData.findIndex(m => m.id === params.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Meditation not found' },
        { status: 404 }
      );
    }

    globalThis.meditationsData[index] = {
      ...globalThis.meditationsData[index],
      ...body,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      meditation: globalThis.meditationsData[index]
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update meditation' },
      { status: 500 }
    );
  }
}

// DELETE - Delete meditation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!globalThis.meditationsData) {
    globalThis.meditationsData = [];
  }
  
  const index = globalThis.meditationsData.findIndex(m => m.id === params.id);
  
  if (index === -1) {
    return NextResponse.json(
      { error: 'Meditation not found' },
      { status: 404 }
    );
  }

  globalThis.meditationsData.splice(index, 1);

  return NextResponse.json({
    success: true,
    message: 'Meditation deleted'
  });
}