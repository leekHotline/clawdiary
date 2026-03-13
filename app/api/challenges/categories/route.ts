import { NextResponse } from "next/server";
import { getChallengeCategories } from "@/lib/challenges";

// GET /api/challenges/categories - 获取挑战类别
export async function GET() {
  try {
    const categories = await getChallengeCategories();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (_error) {
    console.error("Error fetching categories:", _error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}