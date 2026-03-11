import { NextRequest, NextResponse } from "next/server";

// 表情反应详情 API
// GET /api/reactions/[id] - 获取某内容的表情反应详情

// 支持的表情列表
const SUPPORTED_EMOJIS = [
  "❤️", "👍", "👏", "😊", "🤔", "😢", "😮", "🔥", "🎉", "💪",
  "🙏", "😍", "😂", "🥰", "😎", "🌟", "✨", "💯", "🙌", "💖"
];

const mockReactionDetails = {
  "diary_37": {
    targetType: "diary",
    targetId: "diary_37",
    summary: [
      { emoji: "❤️", count: 15, isReacted: true, users: [
        { id: "u1", name: "星辰", avatar: "⭐" },
        { id: "u2", name: "月光", avatar: "🌙" },
        { id: "u3", name: "彩虹", avatar: "🌈" },
        { id: "u4", name: "小溪", avatar: "🌊" },
        { id: "u5", name: "晨曦", avatar: "🌅" },
      ]},
      { emoji: "👍", count: 8, isReacted: false, users: [
        { id: "u6", name: "落叶", avatar: "🍂" },
        { id: "u7", name: "云朵", avatar: "☁️" },
      ]},
      { emoji: "🔥", count: 5, isReacted: true, users: [
        { id: "u8", name: "森林", avatar: "🌲" },
      ]},
      { emoji: "🎉", count: 3, isReacted: false, users: [] },
    ],
    totalReactors: 28,
    topReactors: [
      { id: "u1", name: "星辰", avatar: "⭐", reactionCount: 5 },
      { id: "u2", name: "月光", avatar: "🌙", reactionCount: 3 },
    ],
  },
  "diary_36": {
    targetType: "diary",
    targetId: "diary_36",
    summary: [
      { emoji: "❤️", count: 12, isReacted: false, users: [] },
      { emoji: "🔥", count: 6, isReacted: true, users: [] },
      { emoji: "💪", count: 4, isReacted: false, users: [] },
    ],
    totalReactors: 20,
    topReactors: [],
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: targetId } = await params;
  const { searchParams } = new URL(request.url);
  const targetType = searchParams.get("targetType") || "diary";
  const userId = searchParams.get("userId") || "current-user";

  // 查找反应详情
  const details = mockReactionDetails[targetId as keyof typeof mockReactionDetails];

  if (!details) {
    // 返回空的反应数据
    return NextResponse.json({
      success: true,
      data: {
        targetType,
        targetId,
        summary: [],
        totalReactors: 0,
        topReactors: [],
        supportedEmojis: SUPPORTED_EMOJIS,
      },
    });
  }

  return NextResponse.json({
    success: true,
    data: {
      ...details,
      supportedEmojis: SUPPORTED_EMOJIS,
    },
  });
}