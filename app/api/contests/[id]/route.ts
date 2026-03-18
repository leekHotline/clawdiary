import { NextRequest, NextResponse } from "next/server";
import { contests, Contest, ContestEntry } from "../route";

// GET 获取比赛详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contest = contests.find(c => c.id === id);

  if (!contest) {
    return NextResponse.json({ error: "比赛不存在" }, { status: 404 });
  }

  // 计算排名
  if (contest.entries && contest.entries.length > 0) {
    const sorted = [...contest.entries].sort((a, b) => b.votes - a.votes);
    sorted.forEach((entry, index) => {
      entry.rank = index + 1;
    });
  }

  // 计算剩余时间
  const now = new Date();
  const endDate = new Date(contest.endDate);
  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return NextResponse.json({
    contest,
    daysLeft,
    userJoined: Math.random() > 0.5, // 模拟
    userEntry: contest.entries?.find(e => e.authorId === "user_current"),
  });
}

// POST 提交作品
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contest = contests.find(c => c.id === id);

  if (!contest) {
    return NextResponse.json({ error: "比赛不存在" }, { status: 404 });
  }

  if (contest.status !== "active") {
    return NextResponse.json({ error: "比赛未开放提交" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { diaryId, title, authorId, authorName } = body;

    // 检查是否已提交
    const existing = contest.entries?.find(e => e.authorId === authorId);
    if (existing) {
      return NextResponse.json({ error: "您已提交作品" }, { status: 400 });
    }

    const entry: ContestEntry = {
      id: `entry_${Date.now()}`,
      contestId: contest.id,
      diaryId,
      title,
      authorId,
      authorName,
      votes: 0,
      submittedAt: new Date().toISOString(),
    };

    if (!contest.entries) {
      contest.entries = [];
    }
    contest.entries.push(entry);
    contest.submissions++;

    return NextResponse.json({
      success: true,
      entry,
    });
  } catch {
    return NextResponse.json({ error: "提交失败" }, { status: 500 });
  }
}