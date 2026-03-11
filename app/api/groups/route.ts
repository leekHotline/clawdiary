import { NextRequest, NextResponse } from "next/server";

// 群组系统 API
// GET /api/groups - 获取群组列表
// POST /api/groups - 创建群组

interface Group {
  id: string;
  name: string;
  description: string;
  avatar: string;
  cover: string;
  creatorId: string;
  memberCount: number;
  diaryCount: number;
  isPublic: boolean;
  isMember: boolean;
  isAdmin: boolean;
  tags: string[];
  createdAt: string;
  lastActivity: string;
}

interface GroupMember {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  role: "admin" | "moderator" | "member";
  joinedAt: string;
  diaryCount: number;
}

// 模拟群组数据
const mockGroups: Group[] = [
  {
    id: "g1",
    name: "写作爱好者联盟",
    description: "热爱写作的朋友们的聚集地，分享创作心得，互相激励成长",
    avatar: "📝",
    cover: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
    creatorId: "u1",
    memberCount: 128,
    diaryCount: 1567,
    isPublic: true,
    isMember: true,
    isAdmin: false,
    tags: ["写作", "创作", "文学"],
    createdAt: "2025-06-15",
    lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "g2",
    name: "晨间日记俱乐部",
    description: "每天早起写日记，养成好习惯，一起成为更好的自己",
    avatar: "🌅",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    creatorId: "u2",
    memberCount: 89,
    diaryCount: 2341,
    isPublic: true,
    isMember: true,
    isAdmin: true,
    tags: ["早起", "习惯", "成长"],
    createdAt: "2025-08-20",
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "g3",
    name: "美食记录家",
    description: "记录生活中的每一道美食，分享厨房故事",
    avatar: "🍳",
    cover: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
    creatorId: "u3",
    memberCount: 256,
    diaryCount: 3890,
    isPublic: true,
    isMember: false,
    isAdmin: false,
    tags: ["美食", "烹饪", "生活"],
    createdAt: "2025-03-10",
    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "g4",
    name: "旅行见闻录",
    description: "用文字记录旅途中的点点滴滴，分享世界各地的风景",
    avatar: "✈️",
    cover: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
    creatorId: "u4",
    memberCount: 178,
    diaryCount: 2156,
    isPublic: true,
    isMember: false,
    isAdmin: false,
    tags: ["旅行", "探索", "风景"],
    createdAt: "2025-04-05",
    lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "g5",
    name: "私密读书会",
    description: "小而精的读书分享圈子，深度交流阅读心得",
    avatar: "📚",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
    creatorId: "u5",
    memberCount: 15,
    diaryCount: 234,
    isPublic: false,
    isMember: true,
    isAdmin: false,
    tags: ["读书", "分享", "成长"],
    createdAt: "2025-11-01",
    lastActivity: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

const mockMembers: GroupMember[] = [
  { id: "m1", userId: "u1", name: "星辰", avatar: "⭐", role: "admin", joinedAt: "2025-06-15", diaryCount: 45 },
  { id: "m2", userId: "u2", name: "月光", avatar: "🌙", role: "moderator", joinedAt: "2025-06-16", diaryCount: 38 },
  { id: "m3", userId: "u3", name: "彩虹", avatar: "🌈", role: "member", joinedAt: "2025-06-20", diaryCount: 22 },
  { id: "m4", userId: "u4", name: "小溪", avatar: "🌊", role: "member", joinedAt: "2025-07-01", diaryCount: 15 },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all"; // all, my, public, discover
  const userId = searchParams.get("userId") || "current-user";
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");
  const tag = searchParams.get("tag");
  const search = searchParams.get("search");

  let filteredGroups = [...mockGroups];

  // 类型过滤
  switch (type) {
    case "my":
      filteredGroups = filteredGroups.filter((g) => g.isMember);
      break;
    case "public":
      filteredGroups = filteredGroups.filter((g) => g.isPublic);
      break;
    case "discover":
      filteredGroups = filteredGroups.filter((g) => !g.isMember && g.isPublic);
      break;
  }

  // 标签过滤
  if (tag) {
    filteredGroups = filteredGroups.filter((g) => g.tags.includes(tag));
  }

  // 搜索
  if (search) {
    const searchLower = search.toLowerCase();
    filteredGroups = filteredGroups.filter(
      (g) =>
        g.name.toLowerCase().includes(searchLower) ||
        g.description.toLowerCase().includes(searchLower) ||
        g.tags.some((t) => t.toLowerCase().includes(searchLower))
    );
  }

  // 排序（按最近活动）
  filteredGroups.sort(
    (a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
  );

  // 分页
  const paginatedGroups = filteredGroups.slice(offset, offset + limit);

  return NextResponse.json({
    success: true,
    data: {
      groups: paginatedGroups,
      total: filteredGroups.length,
      hasMore: offset + limit < filteredGroups.length,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, description, isPublic, tags, avatar, creatorId } = body;

  if (!name || !description) {
    return NextResponse.json(
      { success: false, error: "群组名称和描述不能为空" },
      { status: 400 }
    );
  }

  // 创建新群组
  const newGroup: Group = {
    id: `g_${Date.now()}`,
    name,
    description,
    avatar: avatar || "📝",
    cover: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
    creatorId: creatorId || "current-user",
    memberCount: 1,
    diaryCount: 0,
    isPublic: isPublic !== false,
    isMember: true,
    isAdmin: true,
    tags: tags || [],
    createdAt: new Date().toISOString().split("T")[0],
    lastActivity: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    data: {
      group: newGroup,
      message: "群组创建成功",
    },
  });
}