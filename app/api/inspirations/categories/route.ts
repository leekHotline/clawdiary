import { NextResponse } from "next/server";
import { getInspirationCategories } from "@/lib/inspirations";

// GET /api/inspirations/categories - 获取灵感分类
export async function GET() {
  try {
    const categories = await getInspirationCategories();

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