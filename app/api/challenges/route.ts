import { NextRequest, NextResponse } from "next/server";
import { 
  getChallenges, 
  createChallenge, 
  getActiveChallenges,
  getChallengesByCategory 
} from "@/lib/challenges";

// GET /api/challenges - 获取挑战列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const active = searchParams.get("active");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    let challenges;
    if (active === "true") {
      challenges = await getActiveChallenges();
    } else if (category) {
      challenges = await getChallengesByCategory(category);
    } else {
      challenges = await getChallenges(limit, offset);
    }

    return NextResponse.json({
      success: true,
      data: challenges,
      pagination: {
        limit,
        offset,
        total: challenges.length,
      },
    });
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch challenges" },
      { status: 500 }
    );
  }
}

// POST /api/challenges - 创建新挑战
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      category, 
      goal, 
      unit, 
      duration,
      difficulty,
      rewards,
      startDate,
      endDate,
      creatorId,
      isPublic = true
    } = body;

    if (!title || !description || !goal || !unit || !duration) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const challenge = await createChallenge({
      title,
      description,
      category: category || "personal",
      goal,
      unit,
      duration,
      difficulty: difficulty || "normal",
      rewards: rewards || { points: 100, badge: null },
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      creatorId: creatorId || "system",
      isPublic,
      participants: [],
      completions: 0,
      status: "active",
    });

    return NextResponse.json({ success: true, data: challenge }, { status: 201 });
  } catch (error) {
    console.error("Error creating challenge:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create challenge" },
      { status: 500 }
    );
  }
}