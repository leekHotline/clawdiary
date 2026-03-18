import { NextRequest, NextResponse } from "next/server";
import { joinChallenge, leaveChallenge, getChallengeById } from "@/lib/challenges";

// POST /api/challenges/[id]/join - 加入挑战
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const challenge = await getChallengeById(id);
    if (!challenge) {
      return NextResponse.json(
        { success: false, error: "Challenge not found" },
        { status: 404 }
      );
    }

    if (challenge.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Challenge is not active" },
        { status: 400 }
      );
    }

    const result = await joinChallenge(id, userId);

    return NextResponse.json({ 
      success: true, 
      data: result,
      message: "Successfully joined the challenge"
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to join challenge" },
      { status: 500 }
    );
  }
}

// DELETE /api/challenges/[id]/join - 退出挑战
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    await leaveChallenge(id, userId);

    return NextResponse.json({ 
      success: true, 
      message: "Successfully left the challenge" 
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to leave challenge" },
      { status: 500 }
    );
  }
}