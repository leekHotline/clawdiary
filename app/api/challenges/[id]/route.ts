import { NextRequest, NextResponse } from "next/server";
import { 
  getChallengeById, 
  updateChallenge, 
  deleteChallenge,
  joinChallenge,
  leaveChallenge 
} from "@/lib/challenges";

// GET /api/challenges/[id] - 获取挑战详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const challenge = await getChallengeById(id);

    if (!challenge) {
      return NextResponse.json(
        { success: false, error: "Challenge not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: challenge });
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch challenge" },
      { status: 500 }
    );
  }
}

// PUT /api/challenges/[id] - 更新挑战
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await updateChallenge(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Challenge not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating challenge:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update challenge" },
      { status: 500 }
    );
  }
}

// DELETE /api/challenges/[id] - 删除挑战
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteChallenge(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Challenge not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Challenge deleted" });
  } catch (error) {
    console.error("Error deleting challenge:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete challenge" },
      { status: 500 }
    );
  }
}