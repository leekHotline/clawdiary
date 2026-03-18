import { NextRequest, NextResponse } from "next/server";

// Mock privacy settings storage
const privacySettings: Record<string, {
  diaryVisibility: "public" | "followers" | "private";
  settings: Record<string, boolean>;
}> = {};

const defaultSettings = {
  "public-profile": true,
  "show-diaries": true,
  "show-achievements": true,
  "show-activity": false,
  "allow-comments": true,
  "allow-mentions": true,
  "show-in-search": true,
  "analytics-opt-in": true,
};

// GET /api/settings/privacy - Get privacy settings
export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "default-user";
  
  const settings = privacySettings[userId] || {
    diaryVisibility: "public",
    settings: defaultSettings,
  };

  return NextResponse.json({
    success: true,
    data: settings,
  });
}

// PUT /api/settings/privacy - Update privacy settings
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id") || "default-user";
    const body = await request.json();

    const { diaryVisibility, settings } = body;

    // Validate diary visibility
    const validVisibility = ["public", "followers", "private"];
    if (diaryVisibility && !validVisibility.includes(diaryVisibility)) {
      return NextResponse.json(
        { success: false, error: "Invalid diary visibility value" },
        { status: 400 }
      );
    }

    // Update settings
    privacySettings[userId] = {
      diaryVisibility: diaryVisibility || privacySettings[userId]?.diaryVisibility || "public",
      settings: settings || privacySettings[userId]?.settings || defaultSettings,
    };

    return NextResponse.json({
      success: true,
      message: "隐私设置已更新",
      data: privacySettings[userId],
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "更新设置失败" },
      { status: 500 }
    );
  }
}