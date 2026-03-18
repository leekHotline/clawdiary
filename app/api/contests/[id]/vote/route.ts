import { NextRequest, NextResponse } from "next/server";
import { contests } from "../../route";

// 投票
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contest = contests.find(c => c.id === id);

  if (!contest) {
    return NextResponse.json({ error: "比赛不存在" }, { status: 404 });
  }

  if (contest.status !== "voting" && contest.status !== "active") {
    return NextResponse.json({ error: "当前不可投票" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { entryId } = body;

    const entry = contest.entries?.find(e => e.id === entryId);
    if (!entry) {
      return NextResponse.json({ error: "作品不存在" }, { status: 404 });
    }

    entry.votes++;

    return NextResponse.json({
      success: true,
      votes: entry.votes,
    });
  } catch {
    return NextResponse.json({ error: "投票失败" }, { status: 500 });
  }
}