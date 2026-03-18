import { NextRequest, NextResponse } from "next/server";
import { 
  completeChallenge, 
  getChallengeById,
  getChallengeProgress 
} from "@/lib/challenges";

// POST /api/challenges/[id]/complete - 完成挑战
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

    const progress = await getChallengeProgress(id, userId);
    
    if (progress.current < challenge.goal) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Challenge goal not yet reached",
          current: progress.current,
          goal: challenge.goal
        },
        { status: 400 }
      );
    }

    const completion = await completeChallenge(id, userId);

    return NextResponse.json({ 
      success: true, 
      data: {
        completion,
        rewards: challenge.rewards,
      },
      message: "🎉 Congratulations! Challenge completed!"
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to complete challenge" },
      { status: 500 }
    );
  }
}