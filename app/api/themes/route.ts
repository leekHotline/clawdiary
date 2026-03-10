import { NextRequest, NextResponse } from "next/server";

// 主题/皮肤 API
interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  isDefault: boolean;
  isPremium: boolean;
  createdAt: string;
}

// 预设主题
const themes: Theme[] = [
  {
    id: "default",
    name: "默认橙色",
    description: "温暖的龙虾橙色调",
    preview: "🦞",
    colors: {
      primary: "#FF6B35",
      secondary: "#F7C59F",
      background: "#FFF8F0",
      text: "#2D3436",
      accent: "#FF8C42",
    },
    isDefault: true,
    isPremium: false,
    createdAt: "2026-03-09T00:00:00.000Z",
  },
  {
    id: "ocean",
    name: "深海蓝",
    description: "深邃的海洋风格",
    preview: "🌊",
    colors: {
      primary: "#0077B6",
      secondary: "#90E0EF",
      background: "#CAF0F8",
      text: "#03045E",
      accent: "#00B4D8",
    },
    isDefault: false,
    isPremium: false,
    createdAt: "2026-03-09T00:00:00.000Z",
  },
  {
    id: "forest",
    name: "森林绿",
    description: "清新的自然风格",
    preview: "🌲",
    colors: {
      primary: "#2D6A4F",
      secondary: "#95D5B2",
      background: "#D8F3DC",
      text: "#1B4332",
      accent: "#40916C",
    },
    isDefault: false,
    isPremium: false,
    createdAt: "2026-03-09T00:00:00.000Z",
  },
  {
    id: "sunset",
    name: "日落紫",
    description: "浪漫的黄昏色彩",
    preview: "🌅",
    colors: {
      primary: "#7B2CBF",
      secondary: "#E0AAFF",
      background: "#F8F0FF",
      text: "#3C096C",
      accent: "#9D4EDD",
    },
    isDefault: false,
    isPremium: true,
    createdAt: "2026-03-10T00:00:00.000Z",
  },
  {
    id: "midnight",
    name: "午夜黑",
    description: "护眼的深色模式",
    preview: "🌙",
    colors: {
      primary: "#BB86FC",
      secondary: "#03DAC6",
      background: "#121212",
      text: "#E1E1E1",
      accent: "#CF6679",
    },
    isDefault: false,
    isPremium: false,
    createdAt: "2026-03-10T00:00:00.000Z",
  },
  {
    id: "sakura",
    name: "樱花粉",
    description: "浪漫的日式风格",
    preview: "🌸",
    colors: {
      primary: "#FF85A2",
      secondary: "#FFC2D1",
      background: "#FFF0F3",
      text: "#5D2940",
      accent: "#FF5C8D",
    },
    isDefault: false,
    isPremium: true,
    createdAt: "2026-03-11T00:00:00.000Z",
  },
];

// 用户当前主题
let userCurrentTheme = "default";

// GET - 获取所有主题或当前主题
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const current = searchParams.get("current");

  if (current === "true") {
    const theme = themes.find((t) => t.id === userCurrentTheme);
    return NextResponse.json({
      success: true,
      currentTheme: theme,
    });
  }

  return NextResponse.json({
    success: true,
    themes,
    currentThemeId: userCurrentTheme,
    total: themes.length,
    freeCount: themes.filter((t) => !t.isPremium).length,
    premiumCount: themes.filter((t) => t.isPremium).length,
  });
}

// POST - 设置当前主题
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { themeId } = body;

    const theme = themes.find((t) => t.id === themeId);
    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    userCurrentTheme = themeId;

    return NextResponse.json({
      success: true,
      message: "Theme updated successfully",
      currentTheme: theme,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to set theme" },
      { status: 500 }
    );
  }
}