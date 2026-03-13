import { NextResponse } from "next/server";
import { getDiaryHistory } from "@/lib/history";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const history = await getDiaryHistory(id);
    return NextResponse.json({ history });
  } catch (_error) {
    console.error("Error fetching diary history:", _error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}