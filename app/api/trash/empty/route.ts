import { NextResponse } from "next/server";
import { emptyTrash } from "@/lib/trash";

export async function POST() {
  try {
    const count = await emptyTrash();
    return NextResponse.json({ success: true, count });
  } catch {
    return NextResponse.json({ error: "Failed to empty trash" }, { status: 500 });
  }
}