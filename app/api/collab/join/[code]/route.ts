import { NextRequest, NextResponse } from "next/server";
import { inviteCodes } from "../../[id]/invite/route";

// 类型定义
interface Contributor {
  id: string;
  name: string;
  avatar: string;
  contributedAt?: string;
}

interface CollabDiary {
  id: string;
  title: string;
  maxContributors: number;
  contributors: Contributor[];
  status: string;
  updatedAt?: string;
}

// 协作日记数据（应与主路由同步）
const collabDiaries: CollabDiary[] = [
  {
    id: "collab-1",
    title: "太空龙虾的一周年庆生计划",
    maxContributors: 10,
    contributors: [
      { id: "user-1", name: "Alex", avatar: "🧑‍💻" },
      { id: "user-2", name: "小龙虾", avatar: "🦞" }
    ],
    status: "active"
  },
  {
    id: "collab-2", 
    title: "Agent 协作故事接龙",
    maxContributors: 6,
    contributors: [
      { id: "agent-leek", name: "采风", avatar: "🌿" },
      { id: "agent-write", name: "执笔", avatar: "✍️" },
      { id: "agent-review", name: "审阅", avatar: "📝" }
    ],
    status: "active"
  },
  {
    id: "collab-3",
    title: "开源项目文档共建",
    maxContributors: 10,
    contributors: [
      { id: "user-1", name: "Alex", avatar: "🧑‍💻" },
      { id: "user-3", name: "文档君", avatar: "📚" },
      { id: "user-4", name: "代码侠", avatar: "💻" },
      { id: "user-5", name: "翻译官", avatar: "🌐" }
    ],
    status: "completed"
  }
];

// GET - 获取邀请码信息
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  
  const invite = inviteCodes[code.toUpperCase()];
  
  if (!invite) {
    return NextResponse.json(
      { success: false, message: "邀请码无效或已过期" },
      { status: 404 }
    );
  }
  
  // 检查是否过期
  if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
    return NextResponse.json(
      { success: false, message: "邀请码已过期" },
      { status: 400 }
    );
  }
  
  // 检查是否已用完
  if (invite.usedCount >= invite.maxUses) {
    return NextResponse.json(
      { success: false, message: "邀请码已被使用完" },
      { status: 400 }
    );
  }
  
  // 获取协作详情
  const collab = collabDiaries.find(c => c.id === invite.collabId);
  
  if (!collab) {
    return NextResponse.json(
      { success: false, message: "协作项目不存在" },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    success: true,
    data: {
      invite,
      collab: {
        id: collab.id,
        title: collab.title,
        contributors: collab.contributors.length,
        maxContributors: collab.maxContributors,
        status: collab.status
      }
    }
  });
}

// POST - 通过邀请码加入协作
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const body = await request.json();
  const { userId, userName, userAvatar } = body;
  
  const invite = inviteCodes[code.toUpperCase()];
  
  if (!invite) {
    return NextResponse.json(
      { success: false, message: "邀请码无效" },
      { status: 404 }
    );
  }
  
  // 检查是否过期
  if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
    return NextResponse.json(
      { success: false, message: "邀请码已过期" },
      { status: 400 }
    );
  }
  
  // 检查是否已用完
  if (invite.usedCount >= invite.maxUses) {
    return NextResponse.json(
      { success: false, message: "邀请码已被使用完" },
      { status: 400 }
    );
  }
  
  // 获取协作
  const collabIndex = collabDiaries.findIndex(c => c.id === invite.collabId);
  
  if (collabIndex === -1) {
    return NextResponse.json(
      { success: false, message: "协作项目不存在" },
      { status: 404 }
    );
  }
  
  const collab = collabDiaries[collabIndex];
  
  // 检查协作状态
  if (collab.status !== "active") {
    return NextResponse.json(
      { success: false, message: "协作项目已结束" },
      { status: 400 }
    );
  }
  
  // 检查是否已满
  if (collab.contributors.length >= collab.maxContributors) {
    return NextResponse.json(
      { success: false, message: "协作项目人数已满" },
      { status: 400 }
    );
  }
  
  // 检查是否已加入
  if (collab.contributors.some((c: any) => c.id === userId)) {
    return NextResponse.json(
      { success: false, message: "你已经是协作者了" },
      { status: 400 }
    );
  }
  
  // 添加贡献者
  const newContributor = {
    id: userId || `user-${Date.now()}`,
    name: userName || "匿名用户",
    avatar: userAvatar || "👤",
    contributedAt: new Date().toISOString()
  };
  
  collabDiaries[collabIndex].contributors.push(newContributor);
  collabDiaries[collabIndex].updatedAt = new Date().toISOString();
  
  // 更新邀请码使用次数
  inviteCodes[code.toUpperCase()].usedCount++;
  
  return NextResponse.json({
    success: true,
    data: {
      collabId: collab.id,
      collabTitle: collab.title,
      contributor: newContributor
    },
    message: `成功加入「${collab.title}」！`
  });
}