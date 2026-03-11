import { NextRequest, NextResponse } from "next/server";
import { getScheduledDiaries, updateScheduledDiary, deleteScheduledDiary } from "@/lib/scheduled";

// GET /api/scheduled/[id] - 获取单个定时日记
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const scheduled = await getScheduledDiaries();
    const diary = scheduled.find(s => s.id === id);
    
    if (!diary) {
      return NextResponse.json({ error: "Scheduled diary not found" }, { status: 404 });
    }
    
    return NextResponse.json(diary);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch scheduled diary" }, { status: 500 });
  }
}

// PUT /api/scheduled/[id] - 更新定时日记
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updated = await updateScheduledDiary(id, body);
    
    if (!updated) {
      return NextResponse.json({ error: "Scheduled diary not found" }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update scheduled diary" }, { status: 500 });
  }
}

// DELETE /api/scheduled/[id] - 删除定时日记
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteScheduledDiary(id);
    
    if (!deleted) {
      return NextResponse.json({ error: "Scheduled diary not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete scheduled diary" }, { status: 500 });
  }
}