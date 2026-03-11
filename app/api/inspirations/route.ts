import { NextRequest, NextResponse } from "next/server";
import { 
  getInspirations, 
  createInspiration,
  getInspirationsByCategory,
  searchInspirations,
  getPopularInspirations
} from "@/lib/inspirations";

// GET /api/inspirations - 获取灵感列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as string | null;
    const search = searchParams.get("search");
    const popular = searchParams.get("popular");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    let inspirations;

    if (search) {
      inspirations = await searchInspirations(search);
    } else if (popular === "true") {
      inspirations = await getPopularInspirations(limit);
    } else if (category) {
      inspirations = await getInspirationsByCategory(category as any);
    } else {
      inspirations = await getInspirations(limit, offset);
    }

    return NextResponse.json({
      success: true,
      data: inspirations,
      pagination: {
        limit,
        offset,
        total: inspirations.length,
      },
    });
  } catch (error) {
    console.error("Error fetching inspirations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inspirations" },
      { status: 500 }
    );
  }
}

// POST /api/inspirations - 创建新灵感
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      content, 
      category, 
      tags, 
      author,
      source,
      isPublic = true,
      creatorId
    } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const inspiration = await createInspiration({
      title,
      content,
      category,
      tags: tags || [],
      author,
      source,
      isPublic,
      creatorId: creatorId || "anonymous",
    });

    return NextResponse.json({ success: true, data: inspiration }, { status: 201 });
  } catch (error) {
    console.error("Error creating inspiration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create inspiration" },
      { status: 500 }
    );
  }
}