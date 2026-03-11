import { NextRequest, NextResponse } from "next/server";
import { 
  getChallengeProgress, 
  updateProgress,
  getChallengeById 
} from "@/lib/challenges";

// GET /api/challenges/[id]/progress - 获取挑战进度
export async function GET(
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

    const challenge = await getChallengeById(id);
    if (!challenge) {
      return NextResponse.json(
        { success: false, error: "Challenge not found" },
        { status: 404 }
      );
    }

    const progress = await getChallengeProgress(id, userId);

    return NextResponse.json({ 
      success: true, 
      data: {
        challenge,
        progress,
        percentage: Math.min(100, Math.round((progress.current / challenge.goal) * 100)),
        remaining: Math.max(0, challenge.goal - progress.current),
        isCompleted: progress.current >= challenge.goal,
      }
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

// POST /api/challenges/[id]/progress - 更新挑战进度
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, increment = 1, diaryId } = body;

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

    const progress = await updateProgress(id, userId, increment, diaryId);
    const isCompleted = progress.current >= challenge.goal;

    return NextResponse.json({ 
      success: true, 
      data: {
        progress,
        isCompleted,
        percentage: Math.min(100, Math.round((progress.current / challenge.goal) * 100)),
      },
      message: isCompleted ? "🎉 Challenge completed!" : "Progress updated"
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update progress" },
      { status: 500 }
    );
  }
}