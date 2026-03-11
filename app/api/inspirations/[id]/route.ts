import { NextRequest, NextResponse } from "next/server";
import { 
  getInspirationById, 
  updateInspiration, 
  deleteInspiration,
  likeInspiration,
  saveInspiration,
  getUserInspirationStatus
} from "@/lib/inspirations";

// GET /api/inspirations/[id] - 获取灵感详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const inspiration = await getInspirationById(id);

    if (!inspiration) {
      return NextResponse.json(
        { success: false, error: "Inspiration not found" },
        { status: 404 }
      );
    }

    // 获取用户状态
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    let userStatus = { liked: false, saved: false };
    if (userId) {
      userStatus = await getUserInspirationStatus(id, userId);
    }

    return NextResponse.json({ 
      success: true, 
      data: inspiration,
      userStatus 
    });
  } catch (error) {
    console.error("Error fetching inspiration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inspiration" },
      { status: 500 }
    );
  }
}

// PUT /api/inspirations/[id] - 更新灵感
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await updateInspiration(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Inspiration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating inspiration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update inspiration" },
      { status: 500 }
    );
  }
}

// DELETE /api/inspirations/[id] - 删除灵感
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteInspiration(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Inspiration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Inspiration deleted" });
  } catch (error) {
    console.error("Error deleting inspiration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete inspiration" },
      { status: 500 }
    );
  }
}