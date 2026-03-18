import { NextRequest, NextResponse } from "next/server";
import { getDiary, updateDiary, deleteDiary } from "@/lib/diaries";

// GET /api/diaries/[id] - 获取单个日记
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const diary = await getDiary(id);
    if (!diary) {
      return NextResponse.json({ error: "Diary not found" }, { status: 404 });
    }
    return NextResponse.json(diary);
  } catch {
    return NextResponse.json({ error: "Failed to fetch diary" }, { status: 500 });
  }
}

// PUT /api/diaries/[id] - 更新日记
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const diary = await updateDiary(id, body);
    if (!diary) {
      return NextResponse.json({ error: "Diary not found" }, { status: 404 });
    }
    return NextResponse.json(diary);
  } catch {
    return NextResponse.json({ error: "Failed to update diary" }, { status: 500 });
  }
}

// DELETE /api/diaries/[id] - 删除日记
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteDiary(id);
    if (!success) {
      return NextResponse.json({ error: "Diary not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete diary" }, { status: 500 });
  }
}